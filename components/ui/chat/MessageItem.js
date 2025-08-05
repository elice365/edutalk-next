import { chat } from "@/styles/chat";
import { getAvatarUrl } from "@/constants/defaults";
import Image from "next/image";

const formatTime = (timestamp) => {
  if (!timestamp) return '';
  
  // timestamp가 Date 객체가 아닌 경우 변환
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  
  // 유효하지 않은 날짜인 경우 기본값 반환
  if (isNaN(date.getTime())) {
    return '방금 전';
  }
  
  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// 메세지 전송 상태 : sending = 보내는 중 / delivered = 전송 완료 / read = 읽음
const MessageStatus = ({ status }) => {
  const statusClasses = {
    'sending': chat.messages.status.sending,
    'delivered': chat.messages.status.delivered,
    'read': chat.messages.status.read,
  };

  const statusClass = statusClasses[status] || chat.messages.status.sending; // 기본값 설정

  if (status === 'sending') {
    return (
      <div className={`${chat.messages.status.icon} ${statusClass} rounded-full animate-pulse`}></div>
    );
  }
  
  if (status === 'delivered') {
    return (
      <svg className={`${chat.messages.status.icon} ${statusClass}`} fill="currentColor" viewBox="0 0 24 24">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
      </svg>
    );
  }
  
  if (status === 'read') {
    return (
      <svg className={`${chat.messages.status.icon} ${statusClass}`} fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"/>
      </svg>
    );
  }
  
  return null;
};

export default function MessageItem({ message }) {
  const { sender, message: content, timestamp, isOwn, avatar, status, isTyping } = message;

  // 상대가 채팅을 입력 중
  if (isTyping) {
    return (
      <div className={`${chat.messages.other.wrapper} animate-slide-up group`}>
        <Image 
          src={getAvatarUrl(avatar)} 
          alt={sender}
          width={32}
          height={32}
          className={chat.messages.other.avatar}
        />
        <div className={chat.messages.other.section}>
          <div className={`${chat.messages.bubble} ${chat.messages.other.bubble}`}>
            <div className="flex items-center justify-center h-6">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isOwn) {
    // 내가 보낸 메시지 - 오른쪽 정렬
    return (
      <div className={`${chat.messages.own.wrapper} animate-slide-up group`}>
        <div className={chat.messages.own.section}>
          <div className={`${chat.messages.bubble} ${chat.messages.own.bubble} `}>
            <p className={chat.messages.text}>{content}</p>
          </div>
          
          <div className={`${chat.messages.status.container} ${chat.messages.own.time} `}>
            <span className={chat.messages.time}>{formatTime(timestamp)}</span>
            <div className={chat.messages.own.status}>
              <MessageStatus status={status} />
            </div>
            {/* TODO: 서버측 삭제 기능이 구현되면 현재 사용자가 보낸 메시지에 대한 삭제 버튼을 여기에 추가합니다. */}
          </div>
        </div>
      </div>
    );
  }

  // 상대방이 보낸 메시지 - 왼쪽 정렬
  return (
    <div className={`${chat.messages.other.wrapper} animate-slide-up group`}>
      <Image 
        src={getAvatarUrl(avatar)} 
        alt={sender}
        width={32}
        height={32}
        className={chat.messages.other.avatar}
      />
      <div className={chat.messages.other.section}>
        <p className={chat.messages.other.name}>{sender}</p>
        
        <div className={`${chat.messages.bubble} ${chat.messages.other.bubble} `}>
          <p className={chat.messages.text}>{content}</p>
        </div>
        
        <div className={`${chat.messages.status.container} ${chat.messages.other.time} `}>
          <span className={chat.messages.time}>{formatTime(timestamp)}</span>
        </div>
      </div>
    </div>
  );
}