import { useState, useCallback, useMemo } from 'react';
import { api } from '@/utils/axios'; // api 임포트

// 1. 메시지 상태와 관련된 로직을 관리하는 커스텀 훅
export const useChatMessages = (currentChatUser, token) => {
  // messagesHistory는 채팅방 별 메시지 목록을 저장하는 객체입니다。
  // { [chatKey]: [message1, message2, ...] }
  const [messagesHistory, setMessagesHistory] = useState({});

  // 현재 채팅방의 메시지 목록을 가져옵니다.
  // 정렬 및 타이핑 인디케이터 로직도 포함됩니다.
  const currentMessages = useMemo(() => {
    const chatKey = currentChatUser.chatId;
    // messagesHistory[chatKey]가 없으면 빈 배열을 반환하여 다른 채팅방의 메시지가 표시되지 않도록 합니다.
    const msgs = messagesHistory[chatKey] || [];
    // 메시지를 시간순으로 정렬합니다.
    return [...msgs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [messagesHistory, currentChatUser.chatId]); // 의존성 배열에 currentChatUser.chatId 추가

  // 채팅방의 메시지를 로드하는 함수 (새로운 메시지 조회 API 사용)
  const loadChatMessages = useCallback(async (chatRoomId) => {
    if (!chatRoomId || !token) {
      return;
    }
    try {
      console.log(`Loading messages for chatRoomId: ${chatRoomId}`);
      
      // 새로운 메시지 조회 API 사용
      const response = await api.get(`/api/chat/messages?chatRoomId=${chatRoomId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.success && response.data.messages) {
        console.log(`Loaded ${response.data.messages.length} messages for chat ${chatRoomId}`);
        setMessagesHistory(prev => ({ 
          ...prev, 
          [chatRoomId]: response.data.messages 
        }));

        // 메시지를 읽음으로 표시
        try {
          await api.post(`/api/chat/messages?chatRoomId=${chatRoomId}`, {}, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          console.log(`Messages marked as read for chat ${chatRoomId}`);
        } catch (readError) {
          console.error('Failed to mark messages as read:', readError);
        }
      } else {
        console.warn('No messages found or invalid response structure');
        setMessagesHistory(prev => ({ ...prev, [chatRoomId]: [] }));
      }

    } catch (error) {
      console.error('메시지 로드 오류:', error.response?.data || error.message);
      // 오류 발생 시 빈 배열로 초기화
      setMessagesHistory(prev => ({ ...prev, [chatRoomId]: [] }));
    }
  }, [token]);

  return {
    messagesHistory,
    setMessagesHistory,
    currentMessages,
    loadChatMessages,
  };
};