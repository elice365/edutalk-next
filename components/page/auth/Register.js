import React from 'react';
import { motion } from 'framer-motion';
import { useRegister } from '@/hooks/useRegister.js';
import AuthHeader from '@/components/ui/auth/Header.js';
import ProgressBar from '@/components/ui/auth/ProgressBar.js';
import AuthButton from '@/components/ui/auth/Button.js';
import AuthNavigate from '@/components/ui/auth/Navigate.js';
import Alert from '@/components/ui/auth/Alert.js';
import { Step1, Step2, Step3 } from '@/components/ui/auth/Step.js';
import { auth } from '@/styles/auth.js';

const Register = () => {
  const {
    currentStep,
    totalSteps,
    isLoading,
    formData,
    focusedField,
    registrationResult,
    handleInputChange,
    nextStep,
    prevStep,
    isStepValid,
    getPasswordStrength,
    handleSubmit,
    setFocusedField
  } = useRegister();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 formData={formData} handleInputChange={handleInputChange} focusedField={focusedField} setFocusedField={setFocusedField} />;
      case 2:
        return <Step2 formData={formData} handleInputChange={handleInputChange} focusedField={focusedField} setFocusedField={setFocusedField} getPasswordStrength={getPasswordStrength} />;
      case 3:
        return <Step3 formData={formData} handleInputChange={handleInputChange} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={auth.container}
    >
      <AuthHeader
        icon={<svg className={auth.header.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>}
        title="EduTalk과 함께하세요"
        subtitle="혁신적인 교육 플랫폼에서 새로운 학습 여정을 시작하세요"
      />

      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

      {(!registrationResult || !registrationResult.success) && (
        <form onSubmit={handleSubmit} className={auth.register.formContainer}>
          {renderStep()}

          {registrationResult?.error && (
            <Alert type="error" message={registrationResult.error} />
          )}

          <div className="flex items-center justify-between pt-6 gap-3">
            {currentStep > 1 ? (
              <AuthButton onClick={prevStep} isPrimary={false}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                이전
              </AuthButton>
            ) : (
              <div></div>
            )}

            {currentStep < totalSteps ? (
              <AuthButton onClick={nextStep} disabled={!isStepValid()}>
                다음
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </AuthButton>
            ) : (
              <AuthButton type="submit" isLoading={isLoading} disabled={!isStepValid()}>
                {isLoading ? "가입 중..." : "가입 완료"}
              </AuthButton>
            )}
          </div>

          <AuthNavigate text="이미 계정이 있으신가요?" link="/auth/login" linkText="로그인" />
        </form>
      )}
    </motion.div>
  );
};

export default Register;
