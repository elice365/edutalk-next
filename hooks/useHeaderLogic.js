import { AuthContext } from '@/components/provider/Auth';
import { useState, useEffect, useRef, useCallback, useContext } from 'react';

export const useHeaderLogic = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const sidebarRef = useRef(null);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isSidebarOpen) {
        const menuButton = document.querySelector(`[data-testid="mobile-menu-button"]`);
        if (menuButton && !menuButton.contains(event.target)) {
            setIsSidebarOpen(false);
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen, isSidebarOpen]);

  return {
    isLoggedIn,
    handleLogout,
    isProfileMenuOpen,
    setIsProfileMenuOpen,
    isNotificationOpen,
    setIsNotificationOpen,
    isSidebarOpen,
    setIsSidebarOpen,
    notificationRef,
    profileRef,
    sidebarRef
  };
};
