import { chat } from "@/styles/chat";
import { useEffect } from "react";
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
  isOpponentTyping = false
}) => {
    useEffect(() => {
        if (autoScroll && messagesEndRef?.current) {
        // requestAnimationFrame으로 DOM 업데이트 완료 후 스크롤
        requestAnimationFrame(() => {
            if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'auto', block: 'end' });
            }
        });
        }
    }, [messages, autoScroll, messagesEndRef]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* 스크롤 가능한 메시지 컨테이너 - 고정 높이 */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className={chat.messages.container}>
          {/* 실제 메시지 */}
          {messages.map((message, index) => (
            <MessageItem key={message.id || `msg-${index}`} message={message} />
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
      </div>
    </div>
  );
}


export default ChatMessage;