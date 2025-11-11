'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { useChat } from '@/hooks/useChat';
import ChatHeader from '@/components/ui/chat/Header';
import ChatMessage from '@/components/ui/chat/Message';
import ChatInput from '@/components/ui/chat/Input';
import { dashboard } from '@/styles/dashboard';
import { getUserFromToken, isValid, decodeToken } from '@/utils/tokenUtils';
import { useRef } from 'react';

const ChatInterface = ({ token }) => {
  const searchParams = useSearchParams();
  const chatId = searchParams.get('chatId');
  const messagesEndRef = useRef(null);

  // 토큰에서 사용자 정보 추출
  const user = useMemo(() => {
    if (!token || !isValid(token)) {
      return null;
    }
    
    return getUserFromToken(token);
  }, [token]);

  // URL의 chatId를 사용해서 기본 selectedChatUser 생성
  const selectedChatUser = useMemo(() => {
    if (!chatId) return null;
    
    // URL에서 추가 파라미터들 가져오기
    const instructorName = searchParams.get('instructorName') || '강사';
    const studentName = searchParams.get('studentName') || '학생';
    const instructorID = searchParams.get('instructorID') || 'instructor-id';
    const studentID = searchParams.get('studentID') || 'student-id';
    const avatar = searchParams.get('avatar');
    
    return {
      uid: chatId,
      name: "Chat User",
      avatar: avatar || "https://cdn-icons-png.flaticon.com/512/9187/9187604.png",
      // useChat hook에서 필요한 필드들 추가
      instructorName,
      studentName, 
      instructorID,
      studentID
    };
  }, [chatId, searchParams]);

  const {
    currentChatUser,
    messages,
    newMessage,
    setNewMessage,
    handleSendMessage,
    handleTyping,
    handleDeleteMessage,
    isLoading,
    isOpponentTyping
  } = useChat(user, selectedChatUser, token);
  

  // 토큰이 유효하지 않은 경우
  if (!token || !isValid(token)) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center text-neutral-500 bg-neutral-50/50">
        <div className="p-8 border-2 border-dashed border-neutral-200 rounded-2xl bg-white">
          <svg className="w-12 h-12 mx-auto text-neutral-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h2 className="text-lg font-semibold text-neutral-700 mb-2">유효하지 않은 토큰</h2>
          <p className="text-sm text-neutral-500">토큰이 만료되었거나 유효하지 않습니다.</p>
        </div>
      </div>
    );
  }

  if (!chatId) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center text-neutral-500 bg-neutral-50/50">
        <div className="p-8 border-2 border-dashed border-neutral-200 rounded-2xl bg-white">
          <svg className="w-16 h-16 mx-auto text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
          <h2 className="mt-4 text-lg font-semibold text-neutral-700">대화를 시작해보세요</h2>
          <p className="mt-1 text-sm text-neutral-500">
            왼쪽 목록에서 대화 상대를 선택하거나<br/>
            새로운 대화를 시작하여 소통을 시작하세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={dashboard?.chat?.container || "h-full flex flex-col bg-white"}>
      <ChatHeader 
        user={currentChatUser}
        isOpponentTyping={isOpponentTyping}
      />
      
      <div className={dashboard?.chat?.messagesContainer || "flex-1 overflow-hidden"}>
        <ChatMessage
          messages={messages}
          messagesEndRef={messagesEndRef}
          autoScroll={true}
          isOpponentTyping={isOpponentTyping}
          onDeleteMessage={handleDeleteMessage}
        />
      </div>
      
      <div className={dashboard?.chat?.inputContainer || "border-t border-neutral-200 bg-white"}>
        <ChatInput
          message={newMessage}
          setMessage={setNewMessage}
          onSendMessage={handleSendMessage}
          disabled={isLoading}
          onTyping={handleTyping}
        />
      </div>
    </div>
  );
};

export default ChatInterface;