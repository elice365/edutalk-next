import { NextResponse } from 'next/server';
import { withAuth } from '@/middleware/auth';
import { getChatMessages, markMessagesAsRead } from '@/utils/mongodb';
import { getAvatarUrl } from '@/constants/defaults';

/**
 * API: /api/chat/messages?token=&chatRoomId=
 * 
 * 채팅 메시지 조회 API
 * GET: 채팅방의 메시지 히스토리 조회
 * POST: 메시지 읽음 처리
 */

async function handler(req) {
  if (!req.user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { identy, sub: userId, name: userName } = req.user;
  const url = new URL(req.url);
  const chatRoomId = url.searchParams.get('chatRoomId');

  if (!chatRoomId) {
    return NextResponse.json(
      { error: 'Chat room ID is required' },
      { status: 400 }
    );
  }

  try {
    if (req.method === 'GET') {
      // 메시지 조회 - 전체 메시지 가져오기
      const limit = parseInt(url.searchParams.get('limit')) || 9999;  // 기본값을 9999로 변경하여 모든 메시지 가져오기
      const skip = parseInt(url.searchParams.get('skip')) || 0;
      
      console.log(`Fetching messages for chatRoomId: ${chatRoomId}, identity: ${identy}`);
      
      const { messages, totalCount, hasMore, chatRoom } = await getChatMessages(
        chatRoomId, 
        identy, 
        { limit, skip }
      );

      console.log(`Found ${messages.length} messages for chat room ${chatRoomId}`);

      // 메시지를 클라이언트 형식으로 변환
      const formattedMessages = messages.map(msg => {
        // 디버깅을 위한 로그
        console.log(`Message sender check - msgSenderId: ${msg.senderId}, currentUserId: ${userId}, isOwn: ${msg.senderId === userId}`);
        
        return {
          id: msg.uid,
          sender: msg.senderName,
          message: msg.message,
          timestamp: msg.createdAt,
          isOwn: msg.senderId === userId,  // 메시지 발신자 ID와 현재 사용자 ID 비교
          senderId: msg.senderId,  // senderId도 포함
          type: msg.type || 'text',
          avatar: msg.senderId === userId ? null : getAvatarUrl(), // 상대방 아바타
          status: 'delivered',
          sequence: msg.sequence,
          read: msg.read
        };
      });

      return NextResponse.json({
        success: true,
        messages: formattedMessages,
        pagination: {
          totalCount,
          hasMore,
          limit,
          skip
        },
        chatRoomInfo: {
          id: chatRoomId,
          participants: chatRoom?.participants,
          lastMessage: chatRoom?.lastMessage
        },
        userInfo: {
          identy,
          userId,
          userName
        }
      });

    } else if (req.method === 'POST') {
      // 메시지 읽음 처리
      const markedCount = await markMessagesAsRead(chatRoomId, identy, userId);
      
      console.log(`Marked ${markedCount} messages as read in chat room ${chatRoomId} for user ${userId}`);

      return NextResponse.json({
        success: true,
        message: `${markedCount} messages marked as read`,
        markedCount
      });

    } else {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      );
    }

  } catch (error) {
    console.error('Chat messages API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process chat messages request',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);
export const POST = withAuth(handler);