import { useEffect, useRef, useState } from 'react';
import { realtimeChat } from '@/utils/supabase';

// 2. Supabase 실시간 통신을 관리하는 커스텀 훅
export const useSupabaseRealtime = (user, chatRoomId, onNewMessage, onTyping) => {
  const subscriptionRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [isOpponentTyping, setIsOpponentTyping] = useState(false);

  useEffect(() => {

    // 실시간 기능이 사용 불가능하거나 필요한 정보가 없으면 아무 작업도 하지 않습니다.
    if (!realtimeChat.isAvailable()) {
      console.error('❌ 실시간 채팅 기능을 사용할 수 없습니다. Supabase 클라이언트가 초기화되지 않았습니다.');
      return;
    }

    if (!user?.id) {
      console.error('❌ 사용자 정보가 없습니다:', user);
      return;
    }

    if (!chatRoomId) {
      return;
    }

    const userId = user.id;

    // 채팅방별 실시간 구독
    subscriptionRef.current = realtimeChat.subscribeToChatRoom(chatRoomId, {
      onMessage: (message) => {
        // 내가 보낸 메시지가 아닐 경우에만 onNewMessage 콜백을 호출합니다.
        if (message && message.uid && message.senderId !== userId) {
          onNewMessage(message);
        }
      },
      
      onTyping: (typingData) => {
        if (typingData.userId !== userId) {
          setIsOpponentTyping(true);
          
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }
          
          // 1.5초 후에 타이핑 상태를 false로 변경합니다.
          typingTimeoutRef.current = setTimeout(() => {
            setIsOpponentTyping(false);
          }, 1500);
          
          // onTyping 콜백을 호출하여 외부 상태를 업데이트 할 수도 있습니다.
          if (onTyping) {
            onTyping(true);
          }
        }
      },
      
      onMessageDeleted: (deletionData) => {
        // TODO: 메시지 삭제 처리 로직 추가
      },
      
      onError: (error) => {
        console.error('❌ 실시간 구독 오류:', error);
      }
    });

    // 컴포넌트가 언마운트될 때 정리 함수를 실행합니다.
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      // 채널 구독을 해제합니다.
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [user?.id, user?.name, chatRoomId, onNewMessage, onTyping]);

  // 타이핑 이벤트를 Supabase 채널로 전송하는 함수
  const sendTypingEvent = async () => {
    if (!realtimeChat.isAvailable() || !chatRoomId || !user?.id) {
      return;
    }
    
    try {
      await realtimeChat.broadcastTyping(chatRoomId, {
        userId: user.id,
        userName: user.name
      });
    } catch (error) {
      console.error('타이핑 이벤트 전송 실패:', error);
    }
  };

  return { isOpponentTyping, sendTypingEvent };
};