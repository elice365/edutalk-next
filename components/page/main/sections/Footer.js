"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { route } from '@/styles/route';

const MainFooter = () => {
  return (
    <footer className={route.footer.section}>
      <div className={route.footer.wrapper}>
        <div className={route.footer.inner}>
          <motion.div 
            className={route.footer.logo.wrap}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className={route.footer.logo.icon}>
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div>
              <h3 className={route.footer.logo.title}>EduTalk</h3>
              <p className={route.footer.logo.subtitle}>Education Platform</p>
            </div>
          </motion.div>
          <p className={route.footer.description}>
            강사와 학생을 연결하는 혁신적인 교육 플랫폼으로 더 나은 미래를 만들어갑니다
          </p>
          <div className={route.footer.links}>
            <motion.a 
              href="/auth/login" 
              className={route.footer.link}
              whileHover={{ scale: 1.05 }}
            >
              로그인
            </motion.a>
            <motion.a 
              href="/auth/register" 
              className={route.footer.link}
              whileHover={{ scale: 1.05 }}
            >
              회원가입
            </motion.a>
            <motion.a 
              href="#" 
              className={route.footer.link}
              whileHover={{ scale: 1.05 }}
            >
              고객지원
            </motion.a>
          </div>
          <div className={route.footer.copyright}>
            © 2024 EduTalk. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
