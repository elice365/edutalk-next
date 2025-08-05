'use client';

import AuthLayout from '@/components/layout/Auth';
import Register from '@/components/page/auth/Register';

export default function RegisterPage() {
  return (
    <AuthLayout>
      <Register />
    </AuthLayout>
  );
}