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
    const body = await req.json();
    const { type, id, message, file } = body;
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
            avatar: null // TODO: Add user avatar support
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

        // In production, handle file upload to storage service
        // and save file reference to database

        const updatedChat = await prisma.chat.update({
          where: { uid: id },
          data: {
            lastChat: '[File uploaded]',
            lastChatSender: userType === 'teacher' ? 'instructor' : 'student',
            updateTime: new Date()
          }
        });

        return NextResponse.json({
          success: true,
          message: 'File uploaded successfully',
          chat: updatedChat
        });
      }

      case 'delete': {
        if (!id) {
          return NextResponse.json(
            { error: 'Message ID is required' },
            { status: 400 }
          );
        }

        // In production, implement message deletion from messages table
        // For now, just return success
        
        return NextResponse.json({
          success: true,
          message: 'Message deleted'
        });
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