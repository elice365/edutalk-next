'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { dashboard } from '@/styles/dashboard';
import Modal from '@/components/ui/Modal';
import { api } from '@/utils/axios'; // api 임포트
import { useNotices } from '@/hooks/useNotices'; // useNotices 훅 임포트
import AuthButton from '@/components/ui/auth/Button';

//  공지사항 드롭다운 메뉴
const NotificationDropdown = ({ isNotificationOpen, setIsNotificationOpen, notificationRef }) => {
  const [isViewAllNotificationsModalOpen, setIsViewAllNotificationsModalOpen] = useState(false);
  const { notices, loading, error, fetchNotices } = useNotices(); // useNotices 훅 사용

  const unreadNoticesCount = notices.filter(notice => !notice.isRead).length;

  const handleMarkAllAsRead = async () => {
    try {
      // 모든 공지사항을 읽음 상태로 업데이트
      const updatePromises = notices.map(notice => {
        if (!notice.isRead) {
          return api.patch(`/notices/${notice.id}`, { isRead: true });
        }
        return Promise.resolve(); // 이미 읽은 공지사항은 스킵
      });
      await Promise.all(updatePromises);
      fetchNotices(); // 업데이트된 공지사항 다시 불러오기
      alert('모든 알림을 읽음 처리했습니다.');
    } catch (err) {
      console.error('모든 알림 읽음 처리 실패:', err);
      alert('모든 알림 읽음 처리에 실패했습니다.');
    } finally {
      setIsNotificationOpen(false); // 드롭다운 메뉴 닫기
    }
  };

  const handleOpenViewAllNotificationsModal = () => {
    setIsViewAllNotificationsModalOpen(true);
    setIsNotificationOpen(false); // 드롭다운 메뉴 닫기
  };

  const handleCloseViewAllNotificationsModal = () => {
    setIsViewAllNotificationsModalOpen(false);
  };

  return (
    <React.Fragment>
      <div className={dashboard.header.notifications.container} ref={notificationRef}>
        <motion.button 
          onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          className={dashboard.header.notifications.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="알림"
        >
          <svg className={dashboard.header.notifications.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <div className={dashboard.header.notifications.badge}>
            <span className={dashboard.header.notifications.badgeText}>{unreadNoticesCount}</span>
          </div>
        </motion.button>
        
        {isNotificationOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={dashboard.header.notifications.dropdown.container}
          >
            <div className={dashboard.header.notifications.dropdown.content}>
              <div className={dashboard.header.notifications.dropdown.header}>
                <h3 className={dashboard.header.notifications.dropdown.title}>알림</h3>
                <button className={dashboard.header.notifications.dropdown.allRead} onClick={handleMarkAllAsRead}>모두 읽음</button>
              </div>
              
              <div className={dashboard.header.notifications.dropdown.list}>
                {loading ? (
                  <div className="text-center py-4 text-neutral-500">알림 로딩 중...</div>
                ) : error ? (
                  <div className="text-center py-4 text-error-500">알림을 불러오는 데 실패했습니다.</div>
                ) : notices.length === 0 ? (
                  <div className="text-center py-4 text-neutral-500">새로운 알림이 없습니다.</div>
                ) : (
                  notices.map((notice) => (
                    <div key={notice.id} className={`${dashboard.header.notifications.dropdown.item} ${!notice.isRead ? 'bg-primary-50 border border-primary-100' : 'hover:bg-neutral-50'}`}>
                      <div className={`${dashboard.header.notifications.dropdown.icon} ${!notice.isRead ? 'bg-primary-500' : 'bg-neutral-300'}`}>
                        {/* 아이콘은 알림 타입에 따라 변경 가능 */}
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <div className={dashboard.header.notifications.dropdown.section}>
                        <p className={`${dashboard.header.notifications.dropdown.title} ${!notice.isRead ? 'font-semibold' : 'font-normal'}`}>{notice.title}</p>
                        <p className={dashboard.header.notifications.dropdown.text}>{notice.context}</p>
                        <span className={dashboard.header.notifications.dropdown.time}>{new Date(notice.createTime).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className={dashboard.header.notifications.notificationFooter}>
                <button className={dashboard.header.notifications.viewAllButton} onClick={handleOpenViewAllNotificationsModal}>
                  모든 알림 보기
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <Modal
        isOpen={isViewAllNotificationsModalOpen}
        onClose={handleCloseViewAllNotificationsModal}
        title="모든 알림"
      >
        <p className="mb-4">여기에 모든 알림 내용을 표시합니다.</p>
        <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
          {notices.map((notice) => {
            const isExpired = notice.expirationTime && new Date(notice.expirationTime) < new Date();
            return (
              <div key={notice.uid} className={`p-3 rounded-lg border ${isExpired ? 'bg-gray-100 text-gray-500 border-gray-200' : 'bg-white border-gray-300'}`}>
                <h4 className="font-semibold text-lg mb-1">{notice.title}</h4>
                <p className="text-sm">{notice.context}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(notice.createTime).toLocaleDateString()} 등록
                  {isExpired && <span className="ml-2 text-red-500"> (만료됨)</span>}
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex justify-end mt-4">
          <AuthButton onClick={handleCloseViewAllNotificationsModal} isPrimary={false}>닫기</AuthButton>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default NotificationDropdown;
