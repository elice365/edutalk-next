"use client";
import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { useRouter } from 'next/navigation';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // SSR 안전성을 위한 로딩 상태
  const router = useRouter();

  // SSR 안전한 초기 로그인 상태 확인
  useEffect(() => {
    try {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loggedIn);
      
      const storedUser = localStorage.getItem('user');
      if (loggedIn && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
      // 에러 발생 시 초기 상태로 리셋
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 안전한 로그인 함수
  const login = useCallback((userData) => {
    try {
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
      if (userData) {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error saving auth state:', error);
    }
  }, []);

  // 안전한 로그아웃 함수
  const logout = useCallback(() => {
    try {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      localStorage.removeItem('authToken'); // 토큰도 제거
      setIsLoggedIn(false);
      setUser(null);
      router.push('/auth/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // 에러가 발생해도 상태는 초기화
      setIsLoggedIn(false);
      setUser(null);
    }
  }, [router]);

  // 로딩 중일 때는 로딩 상태 표시
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);