'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { dashboard } from '@/styles/dashboard';
import Modal from '@/components/ui/Modal'; // 새로 생성한 Modal 컴포넌트 임포트
import ProfileSettingsForm from '@/components/ui/ProfileSettingsForm';
import { getAvatarUrl } from '@/constants/defaults';
import Image from 'next/image';
// 프로필 드롭다운 메뉴

const ProfileDropdown = ({ user, isProfileMenuOpen, setIsProfileMenuOpen, profileRef, onLogout }) => {
  const [isProfileSettingsModalOpen, setIsProfileSettingsModalOpen] = React.useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = React.useState(false);

  const handleOpenProfileSettingsModal = () => {
    setIsProfileSettingsModalOpen(true);
    setIsProfileMenuOpen(false); // 드롭다운 메뉴 닫기
  };

  const handleCloseProfileSettingsModal = () => {
    setIsProfileSettingsModalOpen(false);
  };

  const handleOpenSettingsModal = () => {
    setIsSettingsModalOpen(true);
    setIsProfileMenuOpen(false); // 드롭다운 메뉴 닫기
  };

  const handleCloseSettingsModal = () => {
    setIsSettingsModalOpen(false);
  };

  return (
    <React.Fragment>
      <div className={dashboard.header.profile.container} ref={profileRef}>
      <motion.button
        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        className={dashboard.header.profile.button}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label={`${user?.name} 프로필 메뉴`}
      >
        <Image 
          src={getAvatarUrl(user?.avatar)} 
          alt={user?.name}
          width={40}
          height={40}
          className={dashboard.header.profile.avatar}
        />
      </motion.button>
      
      {isProfileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={dashboard.header.profile.dropdown.container}
        >
          <div className={dashboard.header.profile.dropdown.content}>
            <div className={dashboard.header.profile.dropdown.header}>
              <Image 
                src={getAvatarUrl(user?.avatar)} 
                alt={user?.name}
                width={48}
                height={48}
                className={dashboard.header.profile.dropdown.avatar}
              />
              <div className={dashboard.header.profile.dropdown.userInfo}>
                <h3 className={dashboard.header.profile.dropdown.userName}>{user?.name}</h3>
              </div>
            </div>
            
            <div className={dashboard.header.profile.dropdown.menu}>
              <button className={dashboard.header.profile.dropdown.item} onClick={handleOpenProfileSettingsModal}>
                <svg className={dashboard.header.profile.dropdown.itemIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className={dashboard.header.profile.dropdown.itemText}>프로필 설정</span>
              </button>
              
              <button className={dashboard.header.profile.dropdown.item} onClick={handleOpenSettingsModal}>
                <svg className={dashboard.header.profile.dropdown.itemIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className={dashboard.header.profile.dropdown.itemText}>환경 설정</span>
              </button>
              
              <hr className="border-neutral-200/50 my-2" />
              
              <button onClick={onLogout} className={dashboard.header.profile.dropdown.logout}>
                <svg className={dashboard.header.profile.dropdown.logoutIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className={dashboard.header.profile.dropdown.logoutText}>로그아웃</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>

      <Modal
        isOpen={isProfileSettingsModalOpen}
        onClose={handleCloseProfileSettingsModal}
        title="내 프로필"
      >
        <ProfileSettingsForm user={user} onClose={handleCloseProfileSettingsModal} />
      </Modal>

      <Modal
        isOpen={isSettingsModalOpen}
        onClose={handleCloseSettingsModal}
        title="환경 설정"
      >
        <div>
          <div className="mt-4">
          </div>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default ProfileDropdown;