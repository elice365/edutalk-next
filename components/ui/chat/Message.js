import { chat } from "@/styles/chat";
import { useEffect, useRef, useState, useCallback } from "react";
import MessageItem from "./MessageItem";
import { getAvatarUrl } from "@/constants/defaults";
import Image from "next/image";

// 타이핑 애니메이션을 위한 CSS 추가
const typingAnimation = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
  
  @keyframes typing-bounce {
    0%, 60%, 100% {
      transform: translateY(0);
    }
    30% {
      transform: translateY(-10px);
    }
  }
  
  .typing-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #9CA3AF;
    margin: 0 2px;
    animation: typing-bounce 1.4s infinite;
  }
  
  .typing-dot:nth-child(1) {
    animation-delay: 0ms;
  }
  
  .typing-dot:nth-child(2) {
    animation-delay: 200ms;
  }
  
  .typing-dot:nth-child(3) {
    animation-delay: 400ms;
  }
`;

// 스타일 추가
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = typingAnimation;
  if (!document.head.querySelector('style[data-chat-typing-animation]')) {
    style.setAttribute('data-chat-typing-animation', 'true');
    document.head.appendChild(style);
  }
}

const ChatMessage = ({
  messages,
  messagesEndRef,
  autoScroll = true,
  isOpponentTyping = false,
  onDeleteMessage
}) => {
  const scrollContainerRef = useRef(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const lastMessageCountRef = useRef(messages.length);
  const lastReadMessageCountRef = useRef(messages.length);
  const scrollTimeoutRef = useRef(null);

  // 스크롤이 최하단에 있는지 확인
  const isAtBottom = useCallback(() => {
    if (!scrollContainerRef.current) return true;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const threshold = 100; // 100px 여유분
    return scrollHeight - scrollTop - clientHeight < threshold;
  }, []);

  // 스크롤을 최하단으로 이동
  const scrollToBottom = useCallback((smooth = false) => {
    if (messagesEndRef?.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: smooth ? 'smooth' : 'auto', 
        block: 'end' 
      });
    }
    // 스크롤 후 읽지 않은 메시지 카운트 리셋
    setUnreadCount(0);
    lastReadMessageCountRef.current = messages.length;
  }, [messagesEndRef, messages.length]);

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const atBottom = isAtBottom();
    setShowScrollToBottom(!atBottom);

    // 사용자가 스크롤 중인지 감지
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    if (atBottom) {
      setIsUserScrolling(false);
      // 최하단에 있으면 읽지 않은 메시지 카운트 리셋
      setUnreadCount(0);
      lastReadMessageCountRef.current = messages.length;
    } else {
      setIsUserScrolling(true);
      // 2초 후 사용자 스크롤 상태 해제
      scrollTimeoutRef.current = setTimeout(() => {
        setIsUserScrolling(false);
      }, 2000);
    }
  }, [isAtBottom]);

  // 새 메시지나 타이핑 상태 변경 시 자동 스크롤
  useEffect(() => {
    if (!autoScroll) return;

    const hasNewMessages = messages.length > lastMessageCountRef.current;
    const newMessageCount = messages.length - lastMessageCountRef.current;
    lastMessageCountRef.current = messages.length;

    // 새 메시지가 있거나 타이핑 상태 변경 시
    if (hasNewMessages || isOpponentTyping) {
      // 사용자가 스크롤 중이 아니거나 이미 최하단에 있는 경우 자동 스크롤
      if (!isUserScrolling || isAtBottom()) {
        // DOM 업데이트를 위해 약간의 지연
        setTimeout(() => {
          scrollToBottom(false);
        }, 50);
      } else if (hasNewMessages) {
        // 사용자가 스크롤 중인 경우 읽지 않은 메시지 카운트 증가
        setUnreadCount(prev => prev + newMessageCount);
      }
    }
  }, [messages, isOpponentTyping, autoScroll, isUserScrolling, isAtBottom, scrollToBottom]);

  // 타이핑 상태 변경 시 추가 스크롤 처리
  useEffect(() => {
    if (isOpponentTyping && !isUserScrolling) {
      // 타이핑 애니메이션이 나타날 때 스크롤
      setTimeout(() => {
        scrollToBottom(true);
      }, 100);
    }
  }, [isOpponentTyping, isUserScrolling, scrollToBottom]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="h-full flex flex-col overflow-hidden relative">
      {/* 스크롤 가능한 메시지 컨테이너 - 고정 높이 */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden"
        onScroll={handleScroll}
      >
        <div className={chat.messages.container}>
          {/* 실제 메시지 */}
          {messages.map((message, index) => (
            <MessageItem
              key={message.id || `msg-${index}`}
              message={message}
              onDeleteMessage={onDeleteMessage}
            />
          ))}
          
          {/* 타이핑 표시기 - 채팅 풍선 형태 */}
          {isOpponentTyping && (
            <div className="flex items-start gap-2 mb-4 animate-fadeIn">
              <Image 
                src={getAvatarUrl()}
                alt="상대방"
                width={32}
                height={32}
                className="w-8 h-8 rounded-lg border border-neutral-200 flex-shrink-0"
              />
              <div className="flex flex-col items-start">
                <p className="text-xs text-neutral-500 mb-1 px-1">상대방</p>
                <div className="bg-white border border-neutral-200 text-neutral-900 rounded-2xl rounded-tl-md shadow-soft px-4 py-3 max-w-xs">
                  <div className="flex items-center justify-center h-6">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* 스크롤 앵커 */}
          <div ref={messagesEndRef} />
        </div>
        
        {/* 아래로 스크롤 버튼 - 메시지 컨테이너 내부 하단에 고정 */}
        {showScrollToBottom && (
          <div className="sticky bottom-2 right-0 flex justify-end pr-4 pb-2">
            <button
              onClick={() => scrollToBottom(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 relative"
              aria-label="맨 아래로 스크롤"
            >
              {/* 읽지 않은 메시지 카운트 배지 */}
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 font-semibold">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                />
              </svg>
            </button>
          </div>
        )}
      </div>

    </div>
  );
}


export default ChatMessage;