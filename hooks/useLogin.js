import { useState, useCallback, useEffect, useContext } from 'react';
import { api } from '@/utils/axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthContext } from '@/components/provider/Auth';

export const useLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [focusedField, setFocusedField] = useState("");
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useContext(AuthContext);

  // 회원가입 완료 정보 확인
  const [registrationInfo, setRegistrationInfo] = useState(null);
  useEffect(() => {
    const isRegistered = searchParams.get('registered') === 'true';
    if (isRegistered) {
      setRegistrationInfo({
        email: searchParams.get('email'),
        message: searchParams.get('message') || '회원가입이 완료되었습니다.',
      });
    }
  }, [searchParams]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleDemoLogin = useCallback(() => {
    setFormData({
      email: "test@mail.com",
      password: "qwer1234"
    });
    setError(null);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.post('/api/auth/login', formData);

      // 응답 데이터 검증
      const responseData = response.data || {};
      if (!responseData.token) {
        throw new Error('Invalid response format: missing token');
      }

      // 토큰 저장
      localStorage.setItem('authToken', responseData.token);
      
      // JWT 페이로드 파싱 (기본적인 검증 포함)
      try {
        const [, payload] = responseData.token.split('.');
        const tokenPayload = JSON.parse(atob(payload));
        
        const userData = {
          id: tokenPayload.sub || tokenPayload.id,
          email: tokenPayload.email,
          identity: tokenPayload.identity || tokenPayload.identy,
          userType: tokenPayload.type || tokenPayload.userType,
          name: tokenPayload.name || tokenPayload.email,
        };
        
        login(userData);
        setSuccess('로그인이 성공적으로 완료되었습니다!');
        
        // 대시보드로 리다이렉트
        setTimeout(() => router.push('/docs'), 1000);
      } catch (tokenError) {
        throw new Error('Invalid token format');
      }

    } catch (err) {
      console.error('Login failed:', err);
      
      // 에러 메시지 설정
      const errorMessage = err.response?.data?.error || err.response?.data?.message;
      
      if (err.response?.status === 401) {
        if (errorMessage === 'Email not verified') {
          setError('이메일 인증이 완료되지 않았습니다. 이메일을 확인하여 인증을 완료해주세요.');
        } else {
          setError('아이디 또는 비밀번호가 일치하지 않습니다.');
        }
      } else if (err.message === 'Invalid token format' || err.message === 'Invalid response format: missing token') {
        setError('서버 응답 형식이 올바르지 않습니다.');
      } else {
        setError(errorMessage || '로그인 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    error,
    success,
    focusedField,
    registrationInfo,
    setFocusedField,
    handleInputChange,
    handleSubmit,
    handleDemoLogin,
  };
};
