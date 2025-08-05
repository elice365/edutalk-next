import { useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { SpeakerIcon, ChatIcon } from '@/components/ui/icons';

export const useSidebarTabs = () => {
  const pathname = usePathname();

  // 현재 경로에 따라 활성 탭 설정
  let initialActiveTab = "notices";
  if (pathname.includes("/chat")) {
    initialActiveTab = "chats";
  }
  const [sidebarTab, setSidebarTab] = useState(initialActiveTab);

  const tabs = [
    {
      id: "notices",
      label: "공지사항",
      mainTab: "/",
      icon: <SpeakerIcon className="w-4 h-4" />
    },
    {
      id: "chats",
      label: "채팅",
      mainTab: "/chat",
      icon: <ChatIcon className="w-4 h-4" />
    }
  ];

  const handleTabClick = useCallback((tab) => {
    setSidebarTab(tab.id);
  }, []);

  return {
    sidebarTab,
    setSidebarTab,
    tabs,
    handleTabClick
  };
};
