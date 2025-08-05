'use client';

import React from 'react';
import { motion } from 'framer-motion';

import { dashboard } from '@/styles/dashboard';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const HeaderLogo = () => {
  const router = useRouter();
    return (
        <motion.div
            className={`${dashboard.header.logo.container} cursor-pointer`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            onClick={() => router.push('/')}
        >
            <motion.div
                className={dashboard.header.logo.icon}
                whileHover={{ scale: 1.1, rotate: 3 }}
                transition={{ duration: 0.3 }}
            >
                <Image alt="Logo" width="40" height="40" src="/favicon.svg" />
            </motion.div>
            <div>
                <h1 className={dashboard.header.logo.title}>EduTalk</h1>
                <p className={dashboard.header.logo.subtitle}>Education Platform</p>
            </div>
        </motion.div>
    );
};

export default HeaderLogo;
