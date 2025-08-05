import { useRouter } from "next/navigation";
import { useChatList } from '@/hooks/useChatList';
import { dashboard } from "@/styles/dashboard";
import { api } from '@/utils/axios';
import { useChat } from "@/components/provider/Chat";
import StateMessage from '@/components/ui/StateMessage';
import { getAvatarUrl } from '@/constants/defaults';
import Image from 'next/image';

// 채팅 목록 컨텐츠 컴포넌트
const ChatsContent = ({ setIsSidebarOpen, user, token }) => {
  const router = useRouter();
  const { chats, loading, error, formatTime, setChats } = useChatList(token);
  const { setSelectedChatUser } = useChat();


  const getPartnerName = (chat) => {
    if (!user) {
      return '알 수 없는 사용자';
    }
    
    // 사용자 타입에 따라 상대방 이름 결정
    const partnerName = user.userType === 'student' ? chat.instructorName : chat.studentName;
    
    // 이름이 없거나 빈 문자열인 경우 기본값 제공
    if (!partnerName || partnerName.trim() === '') {
      return user.userType === 'student' ? '강사' : '학생';
    }
    
    return partnerName.trim();
  };

  const handleChatClick = async (chat) => {
    setSelectedChatUser(chat);
    
    // URL에 필요한 모든 채팅 정보 포함
    const params = new URLSearchParams({
      token,
      chatId: chat.uid,
      instructorName: chat.instructorName || '강사',
      studentName: chat.studentName || '학생',
      instructorID: chat.instructorID || 'instructor-id',
      studentID: chat.studentID || 'student-id'
    });
    
    if (chat.avatar) {
      params.append('avatar', chat.avatar);
    }
    
    router.push(`/chat?${params.toString()}`);
    if (setIsSidebarOpen) {
      setIsSidebarOpen(false);
    }

    // 메시지를 읽음으로 표시하는 API 호출
    if (chat.unreadCount > 0) {
      try {
        await api.post('/api/chat/mark-read', { chatRoomId: chat.uid });
        // API 호출 성공 시, UI에서도 unreadCount를 0으로 업데이트
        // useChatList 훅의 setChats를 직접 호출하여 상태 업데이트
        setChats(prevChats => prevChats.map(c => 
          c.uid === chat.uid ? { ...c, unreadCount: 0 } : c
        ));
      } catch (error) {
        console.error('메시지 읽음 처리 실패:', error);
      }
    }
  };

  if (loading) {
    return <StateMessage title="최근 채팅" type="loading" message="로딩 중..." />;
  }

  if (error) {
    return <StateMessage title="최근 채팅" type="error" message={`오류: ${error}`} />;
  }

  return (
    <div className={dashboard.sidebar.section.container}>
      <div className={dashboard.sidebar.section.header}>
        <h4 className={dashboard.sidebar.section.title}>최근 채팅</h4>
      </div>
      {chats.length === 0 ? (
        <div className="text-center py-4">
          <div className="text-sm text-gray-500 dark:text-neutral-400">채팅이 없습니다</div>
        </div>
      ) : (
        chats.map((chat) => {
          const partnerName = getPartnerName(chat);
          return (
            <button
              key={chat.uid || chat.id}
              onClick={() => handleChatClick(chat)}
              className={dashboard.sidebar.chat.button}
            >
              <Image
                key={`avatar-${chat.uid || chat.id}`}
                src={getAvatarUrl(chat.avatar)}
                alt={partnerName}
                width={40}
                height={40}
                className={dashboard.sidebar.chat.avatar}
              />
              <div className={dashboard.sidebar.chat.content}>
                <div className={dashboard.sidebar.chat.headerRow}>
                  <p className={dashboard.sidebar.chat.name}>
                    {partnerName}
                  </p>
                  <span className={dashboard.sidebar.chat.time}>
                    {formatTime(chat.updateTime)}
                  </span>
                </div>
                <div className={dashboard.sidebar.chat.messageRow}>
                  <p className={dashboard.sidebar.chat.message}>
                    {chat.lastChat}
                  </p>
                  {chat.unreadCount > 0 && (
                    <span className={dashboard.sidebar.chat.unreadBadge}>
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          )
        })
      )}
    </div>
  );
};

export default ChatsContent;
