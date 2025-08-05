"use client";
import { dashboard } from "@/styles/dashboard";
import { AnimatePresence, motion } from "framer-motion";
import HeaderLogo from '@/components/ui/header/Logo';
import NotificationDropdown from '@/components/ui/header/Notification';
import ProfileDropdown from '@/components/ui/header/Profile';
import MobileMenuButton from '@/components/ui/header/MobileMenu';
import { route } from "@/styles/route"; // route 스타일 임포트
import { Panel } from "@/components/layout/Panel";
import { useHeaderLogic } from '@/hooks/useHeaderLogic';
import { useAuth } from "@/components/provider/Auth";

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

const Header=()=> {
  const { user } = useAuth();
  const {
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
  } = useHeaderLogic();

    return(
     <motion.header 
      className={dashboard.header.container}
      variants={itemVariants}
    >
      <div className={dashboard.header.wrapper}>
        <div className={dashboard.header.content}>
          {/* Left Section */}
          <div className={dashboard.header.leftSection}>
            <MobileMenuButton
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
            <HeaderLogo />
          </div>
          
          {/* Right Section */}
          <div className={dashboard.header.rightSection}>
            <AnimatePresence mode="wait">
            {isLoggedIn ? (
              <>
                <NotificationDropdown
                  isNotificationOpen={isNotificationOpen}
                  setIsNotificationOpen={setIsNotificationOpen}
                  notificationRef={notificationRef}
                />
                <ProfileDropdown
                  user={user}
                  isProfileMenuOpen={isProfileMenuOpen}
                  setIsProfileMenuOpen={setIsProfileMenuOpen}
                  profileRef={profileRef}
                  onLogout={handleLogout}
                />
              </>
            ) : (
              <div className="flex items-center gap-2">
                <motion.a
                  href="/auth/login"
                  className={route.header.cta.login}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  로그인
                </motion.a>
                <motion.a
                  href="/auth/register"
                  className={route.header.cta.register.group}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <span className={route.header.cta.register.span}></span>
                  <span className={route.header.cta.register.text}>회원 가입</span>
                </motion.a>
              </div>
            )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Mobile Sidebar */}
      <div ref={sidebarRef} className="lg:hidden">
        {isSidebarOpen && (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl shadow-lg border-t border-neutral-200/50"
                style={{ height: 'calc(100vh - 4.5rem)' }}
            >
                <Panel
                    isMobile={true}
                    user={user}
                    setIsSidebarOpen={setIsSidebarOpen}
                />
            </motion.div>
        )}
      </div>
    </motion.header>
    )
}

export default Header;