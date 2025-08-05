import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLogin } from '@/hooks/useLogin.js';
import AuthHeader from '@/components/ui/auth/Header.js';
import AuthInput from '@/components/ui/auth/Input.js';
import AuthButton from '@/components/ui/auth/Button.js';
import AuthNavigate from '@/components/ui/auth/Navigate.js';
import Alert from '@/components/ui/auth/Alert.js';
import { auth } from '@/styles/auth.js';

const RegistrationSuccess = ({ registrationInfo }) => {
  if (!registrationInfo) return null;

  return (
    <Alert type="success" title="회원가입 완료!">
      <p className={auth.alert.success.text}>{registrationInfo.message}</p>
      <div className={`${auth.alert.info.container} mt-4`}>
        <div className={auth.alert.info.content}>
          <div className={auth.alert.info.icon}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className={auth.alert.info.title}>이메일 인증을 확인해주세요</p>
            <p className={auth.alert.info.text}>
              <strong>{registrationInfo.email}</strong>로 인증 이메일을 발송했습니다.<br/>인증 후 로그인해주세요.
            </p>
          </div>
        </div>
      </div>
    </Alert>
  );
};

const Login = () => {
  const {
    formData,
    isLoading,
    error,
    focusedField,
    registrationInfo,
    setFocusedField,
    handleInputChange,
    handleSubmit,
  } = useLogin();

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={auth.container}
    >
      <AuthHeader
        icon={<svg className={auth.header.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
        title="EduTalk"
        subtitle="교육기관과 함께 바꿔가는 미래"
      />

      <RegistrationSuccess registrationInfo={registrationInfo} />

      <form onSubmit={handleSubmit} className={auth.form.container}>
        <AuthInput
          id="email"
          name="email"
          type="email"
          placeholder="이메일 주소"
          value={formData.email}
          onChange={handleInputChange}
          onFocus={() => setFocusedField('email')}
          onBlur={() => setFocusedField('')}
          focused={focusedField === 'email'}
          icon={<svg className={auth.input.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>}
          required
        />
        <AuthInput
          id="password"
          name="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={handleInputChange}
          onFocus={() => setFocusedField('password')}
          onBlur={() => setFocusedField('')}
          focused={focusedField === 'password'}
          isPassword={true}
          icon={<svg className={auth.input.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
          required
        />

        {error && (
          <Alert type="error" message={error} />
        )}

        <AuthButton type="submit" isLoading={isLoading} disabled={!formData.email || !formData.password}>
          {isLoading ? "로그인 중..." : "로그인"}
        </AuthButton>

        <div className={auth.navigation.container}>
            <div className={auth.navigation.centerLinks}>
                <Link href="/auth/find" className={auth.link.secondary}>비밀번호를 잊으셨나요?</Link>
            </div>
            <AuthNavigate text="아직 계정이 없으신가요?" link="/auth/register" linkText="회원가입" />
        </div>
      </form>
    </motion.div>
  );
};

export default Login;
