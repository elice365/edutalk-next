'use client';

import AuthLayout from '@/components/layout/Auth';
import Login from '@/components/page/auth/Login';

export default function LoginPage() {
  return (
    <AuthLayout>
      <Login />
    </AuthLayout>
  );
}