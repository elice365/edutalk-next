
'use client';

import React from 'react';
import { motion } from 'framer-motion';

import { auth } from '@/styles/auth';

const AuthButton = ({ type = "button", onClick, disabled, isLoading, children, isPrimary = true }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={isPrimary ? auth.button.primary : auth.button.secondary}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className={auth.spinner}
          />
          {children}
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default AuthButton;
