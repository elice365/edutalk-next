import { chat } from "@/styles/chat";
import { useEffect } from "react";
import { getAvatarUrl } from "@/constants/defaults";
import Image from "next/image";

const ChatHeader = ({ user, isOpponentTyping }) => {
  
  // CSS 애니메이션 키프레임을 직접 정의
  const pulseAnimation = {
    animation: 'pulse-typing 2s infinite',
  };
  
  const bounceAnimation = {
    animation: 'bounce-typing 1s infinite',
  };
  
  // 스타일에 키프레임 추가
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse-typing {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      
      @keyframes bounce-typing {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-3px); }
        60% { transform: translateY(-1px); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  

  return (
 <div className={chat.header.container}>
      <div className={chat.header.leftSection}>
        <div className={chat.header.avatar.container}>
          <Image 
            src={getAvatarUrl(user.avatar)} 
            alt={user.name}
            width={40}
            height={40}
            className={chat.header.avatar.picture}
          />
          {user.status === "online" ? 
            <div className={chat.header.avatar.status.online}></div>
          :
            <div className={chat.header.avatar.status.offline}></div>
          }
        </div>
        <div className={chat.header.user.info}>
          <h3 className={chat.header.user.name}>{user.name}</h3>
          
          
          <p className={`${chat.header.user.status} ${isOpponentTyping ? "text-blue-600" : user.status === "online" ? "text-green-600" : "text-neutral-500"}`}>
            {isOpponentTyping ? (
              <span className="flex items-center text-blue-600 text-sm font-medium">
                <span style={pulseAnimation} className="mr-1">⌨️</span>
                입력 중
                <span style={bounceAnimation} className="ml-1">...</span>
              </span>
            ) : (
              user.status === "online" ? "온라인" : "오프라인"
            )}
          </p>

        </div>
      </div>
    </div>
  );
}


export default ChatHeader;