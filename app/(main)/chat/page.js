'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import Panel from '@/components/layout/Panel';
import ChatInterface from '@/components/layout/ChatInterface';
import { dashboard } from '@/styles/dashboard';
import { getUserFromToken, isValid } from '@/utils/tokenUtils';

export default function ChatPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  // 토큰에서 사용자 정보 추출
  const user = useMemo(() => {
    if (!token || !isValid(token)) {
      return null;
    }
    return getUserFromToken(token);
  }, [token]);

  // 토큰이 없으면 로그인 화면 표시
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              채팅 서비스
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              채팅을 이용하려면 로그인이 필요합니다
            </p>
          </div>
          
          <div className="space-y-4">
            <a
              href="/auth/login"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              로그인
            </a>
            
            <a
              href="/auth/register"
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              회원가입
            </a>
            
            <a
              href="/docs"
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              테스트 토큰 생성
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={dashboard.layout.mainContent}>
      {/* Sidebar Panel */}
      <div className="hidden lg:block lg:w-64 xl:w-72 2xl:w-80 fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-neutral-200">
        <Panel token={token} user={user} />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 lg:ml-64 xl:ml-72 2xl:ml-80 h-[calc(100vh-4rem)]">
        <ChatInterface token={token} />
      </div>
    </div>
  );
}