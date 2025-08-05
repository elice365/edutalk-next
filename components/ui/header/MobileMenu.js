'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { dashboard } from '@/styles/dashboard';

// 모바일 UI 사이드바 메뉴 버튼

const MobileMenuButton = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <motion.button
      data-testid="mobile-menu-button"
      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      className={`${dashboard.header.menuButton} lg:hidden`}
    >
      <motion.svg 
        className={dashboard.header.menuIcon}
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        animate={{ rotate: isSidebarOpen ? 90 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </motion.svg>
    </motion.button>
  );
};

export default MobileMenuButton;
