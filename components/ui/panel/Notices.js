import { useNotices } from '@/hooks/useNotices';
import StateMessage from '@/components/ui/StateMessage';
import { api } from '@/utils/axios';

// 공지사항 컨텐츠 컴포넌트
const NoticesContent = () => {
  const { notices, loading, error, formatDate, isExpired, fetchNotices } = useNotices();

  const handleNoticeClick = async (notice) => {
    try {
      // 읽지 않은 공지사항인 경우 읽음 상태로 업데이트
      if (!notice.isRead) {
        await api.patch(`/notices/${notice.uid}`, { isRead: true });
        fetchNotices(); // 공지사항 목록 새로고침
      }
      
      // 공지사항 상세 내용 표시 (모달 또는 알림)
      alert(`공지사항: ${notice.title}\n\n${notice.context}`);
    } catch (error) {
      console.error('공지사항 읽음 처리 실패:', error);
    }
  };

  if (loading) {
    return <StateMessage title="최신 공지사항" type="loading" message="로딩 중..." />;
  }

  if (error) {
    return <StateMessage title="최신 공지사항" type="error" message={`오류: ${error}`} />;
  }

  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-neutral-800 dark:text-neutral-200">최신 공지사항</h4>
      {notices.length === 0 ? (
        <div className="text-center py-4">
          <div className="text-sm text-gray-500 dark:text-neutral-400">공지사항이 없습니다</div>
        </div>
      ) : (
        notices.map((notice) => (
          <div 
            key={notice.uid} 
            onClick={() => handleNoticeClick(notice)}
            className={`p-3 rounded-xl border transition-colors cursor-pointer ${notice.isRead ? 'bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200/50 dark:border-neutral-700/50 hover:bg-neutral-100 dark:hover:bg-neutral-700/50' : 'bg-primary-50 dark:bg-primary-500/10 border-primary-200/50 dark:border-primary-700/50 hover:bg-primary-100 dark:hover:bg-primary-500/20'}`}
          >
            <div className="flex items-start justify-between mb-2">
              <h5 className={`font-medium text-sm line-clamp-1 ${notice.isRead ? 'text-neutral-800 dark:text-neutral-200' : 'text-primary-700 dark:text-primary-300'} ${
                isExpired(notice.expirationTime) ? 'text-gray-500 dark:text-neutral-500' : ''
              }`}>
                {notice.title}
              </h5>
              {notice.displayOrder > 0 && (
                <span className="px-2 py-1 rounded-lg text-xs font-medium bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300">
                  {notice.displayOrder}
                </span>
              )}
            </div>
            <p className={`text-sm mb-2 ${notice.isRead ? 'text-neutral-600 dark:text-neutral-300' : 'text-primary-600 dark:text-primary-200'} ${
              isExpired(notice.expirationTime) ? 'text-gray-400 dark:text-neutral-500' : ''
            }`}>
              {notice.context}
            </p>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {formatDate(notice.createTime)}
              {isExpired(notice.expirationTime) && (
                <span className="text-red-500 dark:text-red-400 ml-2">만료됨</span>
              )}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default NoticesContent;
