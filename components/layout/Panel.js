'use client';

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import NoticesContent from '@/components/ui/panel/Notices';
import ChatsContent from '@/components/ui/panel/Chats';
import { useSidebarTabs } from '@/hooks/useSidebarTabs';
import { dashboard } from '@/styles/dashboard'; // dashboard 스타일 임포트



export function Panel({
  setIsSidebarOpen,
  user,
  isMobile,
  token,
}) {
  const router = useRouter();
  const { sidebarTab, tabs, handleTabClick } = useSidebarTabs();
  return (
    <motion.div
      className={dashboard.sidebar.panel}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      {/* Tab Header */}
      <div className={dashboard.sidebar.tab.header}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              handleTabClick(tab);
              if (!isMobile && tab.id === "chats") {
                // 채팅 탭인 경우에만 라우팅
                router.push(`${tab.mainTab}?token=${token}`);
                if (setIsSidebarOpen) {
                  setIsSidebarOpen(false);
                }
              } else if (tab.id === "notices") {
                // 공지사항 탭인 경우 라우팅하지 않고 탭만 변경
                // 사이드바가 열려있으면 그대로 유지
              }
            }}
            className={`${dashboard.sidebar.tab.button} ${
              sidebarTab === tab.id
                ? dashboard.sidebar.tab.buttonActive
                : dashboard.sidebar.tab.buttonInactive
            }`}
          >
            {tab.icon}
            <span className={dashboard.sidebar.tab.label}>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-neutral-900">
        <div className="p-3 sm:p-4">
          {sidebarTab === "notices" && <NoticesContent />}
          {sidebarTab === "chats" && (
            <ChatsContent
              user={user}
              setIsSidebarOpen={setIsSidebarOpen}
              token={token}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default Panel;