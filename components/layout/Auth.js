'use client';

import { auth } from "@/styles/auth";
import AuthHeroSide from '@/components/page/auth/Hero';
import AuthFormSide from '@/components/page/auth/Form';

/**
 * Reusable auth layout wrapper for Next.js App Router
 * Provides consistent layout structure across all auth pages
 */
const AuthLayout = ({ children }) => {
  return (
    <div className={auth.layout.background}>
      <div className={auth.layout.mainContainer}>
        <AuthHeroSide />
        <AuthFormSide>
          {children}
        </AuthFormSide>
      </div>
    </div>
  );
};

export default AuthLayout;