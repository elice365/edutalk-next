
'use client';

import React from 'react';
import { motion } from 'framer-motion';

import { auth } from '@/styles/auth';

const icons = {
  success: (
    <svg fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  ),
  error: (
    <svg fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
    </svg>
  ),
  info: (
    <svg fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
  ),
};

const Alert = ({ type = 'info', title, message, children }) => {
  const alertStyles = auth.alert[type] || auth.alert.info;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={alertStyles.container}
    >
      <div className={alertStyles.content}>
        <div className={alertStyles.icon}>{icons[type]}</div>
        <div className="flex-grow">
          {title && <h3 className={alertStyles.title}>{title}</h3>}
          {message && <p className={alertStyles.text}>{message}</p>}
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export default Alert;
