import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { withAuth } from '@/middleware/auth';
import { 
  storeMessage, 
  createChatRoom, 
  generateMessageUID,
  initializeMongoDB 
} from '@/utils/mongodb';
import { realtimeChat } from '@/utils/supabase';
import { 
  ChatError, 
  validateChatParams, 
  handleApiError, 
  logError,
  withRetry 
} from '@/utils/errorHandler';

async function handler(req) {
  if (!req.user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // Content-Type에 따라 다르게 파싱
    const contentType = req.headers.get('content-type') || '';
    let body, type, id, message, file, fileName, fileType, fileSize;

    if (contentType.includes('multipart/form-data')) {
      // multipart/form-data 처리 (파일 업로드)
      const formData = await req.formData();
      type = formData.get('type');
      id = formData.get('id');
      message = formData.get('message');
      file = formData.get('file'); // File 객체
      fileName = formData.get('fileName');
      fileType = formData.get('fileType');
      fileSize = formData.get('fileSize');
    } else {
      // JSON 처리 (일반 메시지, 삭제 등)
      body = await req.json();
      ({ type, id, message, file } = body);
    }

    const { identy, sub: userId, name: userName, type: userType } = req.user;

    switch (type) {
      case 'send': {
        // Enhanced validation
        try {
          validateChatParams({
            chatRoomId: id,
            userId,
            message
          });
        } catch (error) {
          const errorResponse = handleApiError(error, req);
          return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
        }

        let chat;
        try {
          chat = await withRetry(async () => {
            return await prisma.chat.findUnique({
              where: { uid: id }
            });
          }, 2, 500);
        } catch (error) {
          const errorResponse = handleApiError(error, req);
          return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
        }

        if (!chat || chat.identy !== identy) {
          const error = new ChatError(
            'Chat not found or access denied',
            'CHAT_NOT_FOUND',
            404,
            { chatId: id, identity: identy }
          );
          const errorResponse = handleApiError(error, req);
          return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
        }

        // Verify user is part of this chat
        const isParticipant = 
          (userType === 'teacher' && chat.instructorID === userId) ||
          (userType === 'student' && chat.studentID === userId);

        if (!isParticipant) {
          const error = new ChatError(
            'Access denied - user not participant of this chat',
            'ACCESS_DENIED',
            403,
            { chatId: id, userId, userType }
          );
          const errorResponse = handleApiError(error, req);
          return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
        }

        // Initialize MongoDB for this identity if needed
        try {
          await initializeMongoDB(identy);
        } catch (initError) {
          console.error('MongoDB initialization warning:', initError);
        }

        // Ensure MongoDB chat room exists
        try {
          await createChatRoom(chat.uid, identy, {
            instructorId: chat.instructorID,
            instructorName: chat.instructorName,
            studentId: chat.studentID,
            studentName: chat.studentName
          });
        } catch (roomError) {
          console.error('Chat room creation warning:', roomError);
        }

        // Update last chat in PostgreSQL
        const updatedChat = await prisma.chat.update({
          where: { uid: id },
          data: {
            lastChat: message,
            lastChatSender: userType === 'teacher' ? 'instructor' : 'student',
            updateTime: new Date()
          }
        });

        // Store message in MongoDB
        const messageUID = generateMessageUID();
        let storedMessage = null;
        
        try {
          storedMessage = await storeMessage({
            uid: messageUID,
            type: 'text',
            senderId: userId,
            senderName: userName,
            message: message,
            read: false,
            chatRoomId: chat.uid
          }, identy);
          
          console.log(`Message stored in MongoDB: ${messageUID} for chat ${chat.uid}`);
        } catch (storeError) {
          console.error('Failed to store message in MongoDB:', storeError);
          // Continue even if MongoDB storage fails
        }

        // Broadcast message via Supabase Realtime
        try {
          // TODO: Add avatar support when Contractor model includes avatar field
          const userAvatar = null;

          const realtimeMessage = {
            uid: messageUID,
            type: 'text',
            senderId: userId,
            senderName: userName,
            message: message,
            chatRoomId: chat.uid,
            timestamp: storedMessage?.createdAt || new Date().toISOString(),
            sequence: storedMessage?.sequence || 1,
            read: false,
            avatar: userAvatar // 추후 확장 가능
          };
          
          await realtimeChat.broadcastMessage(chat.uid, realtimeMessage);
          console.log(`Realtime message broadcasted for chat ${chat.uid}`);
        } catch (realtimeError) {
          console.error('Realtime broadcast failed:', realtimeError);
          // Continue even if realtime broadcast fails
        }

        return NextResponse.json({
          success: true,
          chat: updatedChat,
          messageInfo: {
            uid: messageUID,
            content: message,
            sender: userId,
            senderName: userName,
            timestamp: storedMessage?.createdAt || new Date().toISOString(),
            sequence: storedMessage?.sequence || 1
          }
        });
      }

      case 'file': {
        if (!id || !file) {
          return NextResponse.json(
            { error: 'Chat ID and file are required' },
            { status: 400 }
          );
        }

        const chat = await prisma.chat.findUnique({
          where: { uid: id }
        });

        if (!chat || chat.identy !== identy) {
          return NextResponse.json(
            { error: 'Chat not found' },
            { status: 404 }
          );
        }

        // Verify user is part of this chat
        const isParticipant =
          (userType === 'teacher' && chat.instructorID === userId) ||
          (userType === 'student' && chat.studentID === userId);

        if (!isParticipant) {
          return NextResponse.json(
            { error: 'Forbidden' },
            { status: 403 }
          );
        }

        // multipart/form-data로 받은 파일 처리
        let fileData;
        if (file instanceof File) {
          // File 객체를 Base64로 변환 (기존 시스템과 호환성 유지)
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const base64 = buffer.toString('base64');
          fileData = `data:${fileType || file.type};base64,${base64}`;
        } else {
          // 이미 Base64 문자열인 경우 (하위 호환성)
          fileData = file;
        }

        // TODO: 향후 개선 - 파일 스토리지 서비스(S3, Cloudinary 등)에 업로드하고 URL만 저장
        // 현재는 Base64로 변환하여 저장 (메모리/DB 크기 비효율적)

        const updatedChat = await prisma.chat.update({
          where: { uid: id },
          data: {
            lastChat: `[파일: ${fileName || file.name || 'unknown'}]`,
            lastChatSender: userType === 'teacher' ? 'instructor' : 'student',
            updateTime: new Date()
          }
        });

        return NextResponse.json({
          success: true,
          message: 'File uploaded successfully',
          chat: updatedChat,
          fileData // 클라이언트로 다시 전송 (필요시)
        });
      }

      case 'delete': {
        if (!id) {
          return NextResponse.json(
            { error: 'Message ID is required' },
            { status: 400 }
          );
        }

        try {
          // MongoDB에서 메시지 조회 (권한 확인을 위해)
          const collection = await (await import('@/utils/mongodb')).getChatCollection(identy);

          // messages.uid로 해당 메시지가 포함된 채팅방 찾기
          const chatRoom = await collection.findOne(
            { 'messages.uid': id },
            { projection: { messages: { $elemMatch: { uid: id } }, _id: 1 } }
          );

          if (!chatRoom || !chatRoom.messages || chatRoom.messages.length === 0) {
            return NextResponse.json(
              { error: 'Message not found' },
              { status: 404 }
            );
          }

          const message = chatRoom.messages[0];

          // 권한 확인: 메시지 작성자만 삭제 가능
          if (message.senderId !== userId) {
            return NextResponse.json(
              { error: 'You can only delete your own messages' },
              { status: 403 }
            );
          }

          // 메시지 삭제 실행
          const { deleteMessage } = await import('@/utils/mongodb');
          const deleted = await deleteMessage(id, identy);

          if (!deleted) {
            throw new Error('Failed to delete message');
          }

          console.log(`Message deleted: ${id} by user ${userId}`);

          return NextResponse.json({
            success: true,
            message: 'Message deleted successfully'
          });
        } catch (error) {
          console.error('Message deletion error:', error);
          return NextResponse.json(
            { error: error.message || 'Failed to delete message' },
            { status: 500 }
          );
        }
      }

      case 'list': {
        // Get all chats for the user
        const whereClause = userType === 'teacher'
          ? { identy, instructorID: userId }
          : { identy, studentID: userId };

        const chats = await prisma.chat.findMany({
          where: whereClause,
          orderBy: { updateTime: 'desc' }
        });

        return NextResponse.json({
          success: true,
          chats
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid operation type' },
          { status: 400 }
        );
    }
  } catch (error) {
    logError('CHAT_API_ERROR', error, {
      method: req.method,
      userType,
      userId,
      identity: identy
    });
    
    const errorResponse = handleApiError(error, req);
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
  }
}

export const POST = withAuth(handler);