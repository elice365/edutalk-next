'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import KeyGenerator from '@/components/docs/KeyGenerator';
import TokenGenerator from '@/components/docs/TokenGenerator';
import ApiTester from '@/components/docs/ApiTester';
import ApiDocumentation from '@/components/docs/ApiDocumentation';

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState('docs');

  const tabs = useMemo(() => [
    { id: 'docs', label: 'API 문서', icon: '📚' },
    { id: 'keys', label: 'RSA 키 생성기', icon: '🔐' },
    { id: 'tokens', label: '토큰 생성기', icon: '🎫' },
    { id: 'tester', label: 'API 테스터', icon: '🧪' },
  ], []);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const tabContent = useMemo(() => {
    switch (activeTab) {
      case 'keys':
        return <KeyGenerator />;
      case 'tokens':
        return <TokenGenerator />;
      case 'tester':
        return <ApiTester />;
      case 'docs':
        return <ApiDocumentation />;
      default:
        return null;
    }
  }, [activeTab]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">API 문서 및 도구</h1>
              <p className="mt-2 text-primary-100 text-sm md:text-base leading-relaxed">
                키 생성, 토큰 생성 및 API 통합 테스트를 위한<br className="sm:hidden" />
                종합적인 도구
              </p>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex -mb-px overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  flex items-center px-3 sm:px-6 py-4 text-xs sm:text-sm font-medium border-b-2 transition-all whitespace-nowrap flex-shrink-0
                  ${activeTab === tab.id
                    ? 'text-primary-600 border-primary-500 bg-primary-50'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <span className="mr-1 sm:mr-2 text-sm sm:text-base">{tab.icon}</span>
                <span className="hidden xs:inline sm:inline">{tab.label}</span>
                <span className="xs:hidden sm:hidden text-xs">{tab.label.split(' ')[0]}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {tabContent}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row">
          <div className="flex-shrink-0 mb-3 sm:mb-0">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="sm:ml-4">
            <h3 className="text-sm sm:text-base font-semibold text-blue-900 flex items-center space-x-2">
              <span>🔒</span>
              <span>중요한 보안 안내사항</span>
            </h3>
            <div className="mt-3 text-xs sm:text-sm text-blue-800">
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 font-medium flex-shrink-0">•</span>
                  <span className="leading-relaxed">RSA 개인키는 한 번만 표시되며 나중에 다시 조회할 수 없습니다</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 font-medium flex-shrink-0">•</span>
                  <span className="leading-relaxed">키를 안전하게 보관하고 공개적으로 공유하지 마세요</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 font-medium flex-shrink-0">•</span>
                  <span className="leading-relaxed">보안을 위해 토큰은 24시간 후 만료됩니다</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 font-medium flex-shrink-0">•</span>
                  <span className="leading-relaxed">프로덕션 환경에서는 HTTPS를 사용하세요</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}