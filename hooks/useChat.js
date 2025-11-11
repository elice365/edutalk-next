import { useState, useCallback, useMemo, useEffect } from 'react';
import { api } from '@/utils/axios';
import { useChatMessages } from './useChatMessages';
import { useSupabaseRealtime } from './useSupabaseRealtime';
import { getAvatarUrl } from '@/constants/defaults';
import { realtimeChat } from '@/utils/supabase';

// 3. 채팅 관련 로직을 총괄하는 메인 커스텀 훅
export const useChat = (user, selectedChatUser, token) => {
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // 기본 채팅 유저 정보 (선택된 채팅이 없을 때 사용)
  const defaultChatUser = useMemo(() => ({
    name: "새로운 대화",
    avatar: getAvatarUrl(),
    status: "online",
    chatId: null // 기본적으로는 chatId가 없음
  }), []);

  const currentChatUser = useMemo(() => {
    if (!selectedChatUser) {
      return defaultChatUser;
    }
    
    // 수정: selectedChatUser 객체를 기반으로 현재 채팅 유저 정보를 구성합니다.
    // userType에 따라 상대방의 이름과 ID를 동적으로 설정합니다.
    const opponentName = user?.userType === 'student' ? selectedChatUser.instructorName : selectedChatUser.studentName;
    const opponentId = user?.userType === 'student' ? selectedChatUser.instructorID : selectedChatUser.studentID;

    const chatUser = {
      ...selectedChatUser,
      id: opponentId, // 메시지 전송 시 to 필드에서 사용될 수 있도록 상대방 ID를 설정
      name: opponentName,
      chatId: selectedChatUser.uid, // selectedChatUser.uid를 chatId로 명시적으로 할당
      avatar: getAvatarUrl(selectedChatUser.avatar),
      status: "online" // 이 부분은 실제 presence 상태에 따라 동적으로 변경될 수 있습니다.
    };
    
    return chatUser;
  }, [selectedChatUser, defaultChatUser, user?.userType]);

  // --- 하위 훅 사용 ---
  const {
    setMessagesHistory,
    currentMessages,
    loadChatMessages,
  } = useChatMessages(currentChatUser, token);

  // 실시간 메시지 수신 처리
  const handleNewMessage = useCallback((message) => {
    try {
      // 현재 사용자가 보낸 메시지인 경우, handleSendMessage에서 이미 처리되었으므로 무시
      if (user && message.senderId === user.id) {
        return;
      }

      const formattedMessage = {
        id: message.uid,
        sender: message.senderName,
        message: message.message,
        timestamp: new Date(message.timestamp),
        isOwn: false, // 다른 사용자가 보낸 메시지이므로 false 유지
        type: message.type || 'text',
        avatar: getAvatarUrl(message.avatar),
        status: 'delivered'
      };

      setMessagesHistory(prev => ({
        ...prev,
        [message.chatRoomId]: [...(prev[message.chatRoomId] || []), formattedMessage]
      }));

      window.dispatchEvent(new CustomEvent('chatUpdated', {
        detail: {
          chatUser: message.chatRoomId, // Use chatRoomId from the incoming message
          lastChat: message.message,
          unreadCount: (currentChatUser.chatId !== message.chatRoomId) ? 1 : 0 // Only increment if not current chat
        }
      }));

    } catch (error) {
      console.error('React handleNewMessage - Uncaught error in handleNewMessage:', error);
    }
  }, [setMessagesHistory, user, currentChatUser.chatId]);

  // 실시간 타이핑 이벤트 수신 처리
  const handleOpponentTyping = useCallback((isTyping) => {
    // 타이핑 상태 변경에 대한 추가 로직 (예: 로깅, 분석 등)
    if (isTyping) {
      console.log(`${currentChatUser.name}님이 입력 중입니다...`);
    }
  }, [currentChatUser.name]);

  // 메시지 삭제 이벤트 수신 처리
  const handleMessageDeleted = useCallback((messageId, chatRoomId) => {
    console.log('메시지 삭제:', messageId);

    // 현재 채팅방의 메시지인 경우에만 처리
    if (chatRoomId === currentChatUser.chatId) {
      setMessagesHistory(prev => ({
        ...prev,
        [chatRoomId]: (prev[chatRoomId] || []).filter(msg => msg.id !== messageId)
      }));
    }
  }, [currentChatUser.chatId, setMessagesHistory]);

  const { isOpponentTyping, sendTypingEvent } = useSupabaseRealtime(
    user,
    currentChatUser.chatId, // chatRoomId 전달
    handleNewMessage,
    handleOpponentTyping,
    handleMessageDeleted
  );
  
  // ------------------

  // 컴포넌트 마운트 시 또는 채팅 유저 변경 시 메시지 로드
  useEffect(() => {
    if (currentChatUser.chatId) {
        // 항상 최신 메시지를 가져오기 위해 강제 로드 (forceReload = true)
        console.log('Force loading messages for chat:', currentChatUser.chatId);
        loadChatMessages(currentChatUser.chatId, true);
        
        // 채팅방 진입 시 읽지 않은 메시지 수 0으로 업데이트
        if (currentChatUser.unreadCount > 0) {
          // UI를 먼저 업데이트하기 위해 이벤트 먼저 발생
          window.dispatchEvent(new CustomEvent('chatUpdated', {
            detail: { chatUser: currentChatUser.chatId, message: currentChatUser.lastChat, unreadCount: 0 } // unreadCount도 함께 전달
          }));
        }
    }
  }, [currentChatUser.chatId, loadChatMessages]); // chatId만 의존성으로 설정하여 새로고침 시 다시 로드

  // 메시지 전송 핸들러
  const handleSendMessage = useCallback(async (messageText) => {
    if (!messageText.trim() || isLoading) return;

    setIsLoading(true);
    const tempId = Date.now() + Math.random();
    const message = {
      id: tempId,
      sender: user?.name,
      message: messageText,
      timestamp: new Date(),
      isOwn: true,
      type: 'text',
      avatar: getAvatarUrl(user?.avatar),
      status: 'sending'
    };

    const chatKey = currentChatUser.chatId;
    setMessagesHistory(prev => ({
      ...prev,
      [chatKey]: [...(prev[chatKey] || []), message]
    }));
    setNewMessage('');

    try {
      // 메시지 전송 API 호출 (Authorization 헤더 사용)
      const sendMessageResponse = await api.post('/api/chat', {
        type: 'send',
        id: currentChatUser.chatId,
        message: messageText
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (sendMessageResponse.status !== 200 || !sendMessageResponse.data.success) {
        throw new Error(sendMessageResponse.data.error || '메시지 전송에 실패했습니다.');
      }
      
      const { chat, messageInfo } = sendMessageResponse.data;

      // UI 업데이트 - messageInfo로 실제 메시지 정보 업데이트
      setMessagesHistory(prev => ({
        ...prev,
        [chatKey]: prev[chatKey].map(msg =>
          msg.id === tempId ? { 
            ...msg, 
            id: messageInfo.uid,
            timestamp: new Date(messageInfo.timestamp),
            status: 'delivered',
            sequence: messageInfo.sequence
          } : msg
        )
      }));

      // 사이드바 채팅 목록 업데이트
      window.dispatchEvent(new CustomEvent('chatUpdated', {
        detail: { chatUser: chatKey, lastChat: chat.lastChat, unreadCount: 0 }
      }));

    } catch (error) {
      console.error('메시지 전송 오류:', error);
      // 에러 UI 처리
      setMessagesHistory(prev => ({
        ...prev,
        [chatKey]: prev[chatKey].map(msg =>
          msg.id === tempId ? { ...msg, status: 'failed', errorMessage: error.response?.data?.error || error.message } : msg
        )
      }));
    } finally {
      setIsLoading(false);
    }
  }, [user, currentChatUser, setMessagesHistory, isLoading, setNewMessage, token]);

  // 파일 첨부 핸들러
  const handleAttachment = useCallback(async (file) => {
    if (!file || isLoading) return;

    // 허용된 파일 타입 정의
    const ALLOWED_FILE_TYPES = {
      // 이미지
      'image/jpeg': '.jpg, .jpeg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
      // 문서
      'application/pdf': '.pdf',
      'application/msword': '.doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
      'application/vnd.ms-excel': '.xls',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
      'application/vnd.ms-powerpoint': '.ppt',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
      // 텍스트
      'text/plain': '.txt',
      // 압축
      'application/zip': '.zip',
      'application/x-rar-compressed': '.rar'
    };

    // 파일 타입 검증
    if (!ALLOWED_FILE_TYPES[file.type]) {
      const allowedExtensions = Object.values(ALLOWED_FILE_TYPES).join(', ');
      console.error(`지원하지 않는 파일 형식입니다: ${file.type}`);
      alert(`지원하지 않는 파일 형식입니다.\n\n허용된 파일 형식:\n${allowedExtensions}`);
      return;
    }

    // 파일 크기 제한 (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      console.error('파일 크기가 너무 큽니다. 최대 10MB까지 업로드 가능합니다.');
      alert('파일 크기가 너무 큽니다.\n최대 10MB까지 업로드 가능합니다.');
      return;
    }

    setIsLoading(true);
    const tempId = Date.now() + Math.random();
    const message = {
      id: tempId,
      sender: user?.name,
      message: `[파일: ${file.name}]`,
      timestamp: new Date(),
      isOwn: true,
      type: 'file',
      avatar: getAvatarUrl(user?.avatar),
      status: 'sending',
      fileName: file.name
    };

    const chatKey = currentChatUser.chatId;
    setMessagesHistory(prev => ({
      ...prev,
      [chatKey]: [...(prev[chatKey] || []), message]
    }));

    try {
      // Base64로 파일 인코딩
      const reader = new FileReader();
      const fileData = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // 파일 업로드 API 호출
      const response = await api.post('/api/chat', {
        type: 'file',
        id: currentChatUser.chatId,
        file: fileData,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status !== 200 || !response.data.success) {
        throw new Error(response.data.error || '파일 업로드에 실패했습니다.');
      }

      // UI 업데이트
      setMessagesHistory(prev => ({
        ...prev,
        [chatKey]: prev[chatKey].map(msg =>
          msg.id === tempId ? { ...msg, status: 'delivered' } : msg
        )
      }));

      // 사이드바 채팅 목록 업데이트
      window.dispatchEvent(new CustomEvent('chatUpdated', {
        detail: { chatUser: chatKey, lastChat: `[파일: ${file.name}]`, unreadCount: 0 }
      }));

    } catch (error) {
      console.error('파일 업로드 오류:', error);
      // 에러 UI 처리
      setMessagesHistory(prev => ({
        ...prev,
        [chatKey]: prev[chatKey].map(msg =>
          msg.id === tempId ? { ...msg, status: 'failed', errorMessage: error.response?.data?.error || error.message } : msg
        )
      }));
    } finally {
      setIsLoading(false);
    }
  }, [user, currentChatUser, setMessagesHistory, isLoading, token]);

  // 메시지 삭제 핸들러
  const handleDeleteMessage = useCallback(async (messageId) => {
    if (!messageId || isLoading) return;

    const chatKey = currentChatUser.chatId;

    try {
      // 서버에 메시지 삭제 요청
      const response = await api.post('/api/chat', {
        type: 'delete',
        id: messageId
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status !== 200 || !response.data.success) {
        throw new Error(response.data.error || '메시지 삭제에 실패했습니다.');
      }

      // UI에서 메시지 제거
      setMessagesHistory(prev => ({
        ...prev,
        [chatKey]: (prev[chatKey] || []).filter(msg => msg.id !== messageId)
      }));

      // 실시간으로 다른 사용자에게 삭제 알림 (Supabase)
      try {
        await realtimeChat.broadcastMessageDeletion(chatKey, messageId);
      } catch (realtimeError) {
        console.error('실시간 삭제 알림 실패:', realtimeError);
      }

      console.log('메시지 삭제 완료:', messageId);

    } catch (error) {
      console.error('메시지 삭제 오류:', error);
      alert(error.response?.data?.error || error.message || '메시지 삭제에 실패했습니다.');
    }
  }, [currentChatUser.chatId, setMessagesHistory, isLoading, token]);

  // 최종적으로 UI 컴포넌트에 전달할 값들을 반환합니다.
  return {
    currentChatUser,
    messages: currentMessages,
    newMessage,
    isLoading,
    isOpponentTyping,
    setNewMessage,
    handleSendMessage,
    handleTyping: sendTypingEvent, // Supabase 훅에서 받은 함수를 그대로 전달
    handleAttachment,
    handleDeleteMessage
  };
};

        