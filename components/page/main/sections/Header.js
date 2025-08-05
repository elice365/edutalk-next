"use client";
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { route } from '@/styles/route';
import { mobileMenuSlide, mobileMenuFade } from '@/utils/animationVariants';

const MainHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);
  
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <nav className={route.header.container}>
      <div className={route.header.wrapper}>
        <div className={route.header.inner}>
          {/* Logo Section */}
          <motion.div 
            className={route.header.logo.section}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className={route.header.logo.icon}
              whileHover={{ scale: 1.1, rotate: 3 }}
              transition={{ duration: 0.3 }}
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </motion.div>
            
            <div className={route.header.logo.text}>
              <h1 className={route.header.logo.title}>EduTalk</h1>
              <p className={route.header.logo.subtitle}>Education Platform</p>
            </div>
          </motion.div>
          
          {/* Desktop Navigation */}
          <motion.div 
            className={route.header.navigation.desktop.navigation}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.a 
              href="#features" 
              className={route.header.navigation.desktop.navigationLink}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              기능
            </motion.a>
            <motion.a 
              href="#how-it-works" 
              className={route.header.navigation.desktop.navigationLink}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              사용법
            </motion.a>
            <motion.a 
              href="#pricing" 
              className={route.header.navigation.desktop.navigationLink}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              요금제
            </motion.a>
          </motion.div>
          
          {/* Mobile Menu Button */}
          <motion.button 
            onClick={toggleMobileMenu}
            className={route.header.mobileMenuButton}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </motion.svg>
          </motion.button>
          
          {/* CTA Buttons */}
          <motion.div 
            className={route.header.cta.button}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
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
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              className={route.mobileMenu.backdrop}
              onClick={closeMobileMenu}
              {...mobileMenuFade}
            />
            
            {/* Mobile Menu */}
            <motion.div 
              className={route.mobileMenu.panel}
              {...mobileMenuSlide}
            >
              <div className={route.mobileMenu.closeButtonWrap}>
                <motion.button
                  onClick={closeMobileMenu}
                  className={route.mobileMenu.closeButton}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="메뉴 닫기"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              <div className="px-4 pt-20 pb-6">
                {/* Mobile Navigation Links */}
                <div className={route.mobileMenu.links}>
                  <motion.a 
                    href="#features" 
                    onClick={closeMobileMenu}
                    className={route.mobileMenu.link}
                    whileHover={{ x: 5 }}
                  >
                    기능
                  </motion.a>
                  <motion.a 
                    href="#how-it-works" 
                    onClick={closeMobileMenu}
                    className={route.mobileMenu.link}
                    whileHover={{ x: 5 }}
                  >
                    사용법
                  </motion.a>
                  <motion.a 
                    href="#pricing" 
                    onClick={closeMobileMenu}
                    className={route.mobileMenu.link}
                    whileHover={{ x: 5 }}
                  >
                    요금제
                  </motion.a>
                </div>
                
                {/* Mobile CTA Buttons */}
                <div className={route.mobileMenu.cta.button}>
                  <motion.a
                    href="/auth/login"
                    onClick={closeMobileMenu}
                    className={route.mobileMenu.cta.login}
                    whileHover={{ scale: 1.02 }}
                  >
                    로그인
                  </motion.a>
                  <motion.a
                    href="/auth/register"
                    onClick={closeMobileMenu}
                    className={route.mobileMenu.cta.register}
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)"
                    }}
                  >
                    회원 가입
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default MainHeader;
