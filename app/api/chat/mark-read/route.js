import { NextResponse } from 'next/server';
import { withAuth } from '@/middleware/auth';
import { markMessagesAsRead } from '@/utils/mongodb';

/**
 * API: /api/chat/mark-read
 * 
 * 채팅 메시지 읽음 처리 전용 API
 * POST: 특정 채팅방의 메시지를 읽음으로 표시
 */

async function handler(req) {
  if (!req.user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  if (req.method !== 'POST') {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }

  const { identy, sub: userId, name: userName } = req.user;

  try {
    const body = await req.json();
    const { chatRoomId } = body;

    if (!chatRoomId) {
      return NextResponse.json(
        { error: 'Chat room ID is required' },
        { status: 400 }
      );
    }

    console.log(`Marking messages as read for chatRoomId: ${chatRoomId}, userId: ${userId}, identity: ${identy}`);

    // MongoDB에서 메시지를 읽음으로 표시
    const markedCount = await markMessagesAsRead(chatRoomId, identy, userId);
    
    console.log(`Successfully marked ${markedCount} messages as read in chat room ${chatRoomId} for user ${userId}`);

    return NextResponse.json({
      success: true,
      message: `${markedCount} messages marked as read`,
      data: {
        chatRoomId,
        userId,
        markedCount,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Mark read API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to mark messages as read',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export const POST = withAuth(handler);