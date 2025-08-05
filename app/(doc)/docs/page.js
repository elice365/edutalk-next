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
    { id: 'docs', label: 'API Documentation', icon: '📚' },
    { id: 'keys', label: 'RSA Key Generator', icon: '🔐' },
    { id: 'tokens', label: 'Token Generator', icon: '🎫' },
    { id: 'tester', label: 'API Tester', icon: '🧪' },
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
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6">
          <h1 className="text-3xl font-bold">API Documentation & Tools</h1>
          <p className="mt-2 text-primary-100">
            Generate keys, create tokens, and test your API integration
          </p>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-all
                  ${activeTab === tab.id
                    ? 'text-primary-600 border-primary-500 bg-primary-50'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
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

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Important Security Notice</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>RSA private keys are shown only once and cannot be retrieved later</li>
                <li>Store your keys securely and never share them publicly</li>
                <li>Tokens expire after 24 hours for security</li>
                <li>Use HTTPS in production environments</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}