import { useState, useCallback } from 'react';
import { api } from '@/utils/axios';
import { useRouter } from 'next/navigation';




export const useRegister = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    identy: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
    marketing: false
  });
  const [focusedField, setFocusedField] = useState("");
  const [registrationResult, setRegistrationResult] = useState(null);

  const totalSteps = 3;

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, totalSteps]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const isStepValid = useCallback(() => {
    switch (currentStep) {
      case 1:
        return formData.identy.length >= 2 &&
               formData.email.length > 0 &&
               /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
      case 2:
        return formData.password.length >= 6 &&
               formData.password === formData.confirmPassword;
      case 3:
        return formData.terms;
      default:
        return false;
    }
  }, [currentStep, formData]);

  const getPasswordStrength = useCallback((password) => {
    if (password.length === 0) return { strength: 0, label: "" };
    if (password.length < 6) return { strength: 1, label: "약함", color: "text-error-500" };
    if (password.length < 8) return { strength: 2, label: "보통", color: "text-warning-500" };
    if (password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password)) {
      return { strength: 4, label: "매우 강함", color: "text-success-500" };
    }
    return { strength: 3, label: "강함", color: "text-success-400" };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isStepValid()) {
      alert('현재 단계의 모든 필드를 올바르게 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setRegistrationResult(null);

    try {
      const response = await api.post('/api/auth/register', {
        identy : formData.identy,
        email : formData.email,
        password : formData.password,
        confirmPassword : formData.confirmPassword,
        terms : formData.terms,
        marketing : formData.marketing
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      setRegistrationResult({ success: true, data: response.data, message: '회원가입이 성공적으로 완료되었습니다.' });
      alert('회원가입이 성공적으로 완료되었습니다!');
      // 성공 시 로그인 페이지로 리다이렉트하거나, 추가적인 처리를 할 수 있습니다.
      router.push('/auth/login?registered=true&email=' + formData.email);

    } catch (error) {
      console.error('회원가입 실패:', error);
      let errorMessage = '회원가입에 실패했습니다. 다시 시도해주세요.';
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          errorMessage = data.message || '입력 내용을 다시 확인해주세요.';
        } else if (status === 409) {
          errorMessage = data.message || '이미 가입된 이메일입니다.';
        } else if (status >= 500) {
          errorMessage = '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
        }
      } else if (error.request) {
        errorMessage = '서버로부터 응답을 받지 못했습니다. 네트워크 연결을 확인해주세요.';
      } 

      setRegistrationResult({ success: false, error: errorMessage });
      alert(`회원가입에 실패했습니다: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
};
