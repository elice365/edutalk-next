'use client';

import { useState, useCallback, memo, useMemo, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '@/components/provider/Auth';

const TokenGenerator = memo(() => {
  const { user } = useContext(AuthContext);
  
  const [payload, setPayload] = useState({
    identy: '',
    type: 'student',
    sub: '',
    name: '',
  });

  // 로그인된 사용자 정보로 자동 설정
  useEffect(() => {
    if (user) {
      setPayload(prev => ({
        ...prev,
        identy: user.identity || user.identy || '',
        sub: user.id || user.uid || '',
        name: user.name || user.email || '',
        type: user.userType || user.type || 'student'
      }));
    }
  }, [user]);
  const [privateKey, setPrivateKey] = useState('');
  const [token, setToken] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [expirationHours, setExpirationHours] = useState(24);

  const handlePayloadChange = useCallback((field, value) => {
    setPayload(prev => ({ ...prev, [field]: value }));
  }, []);

  const generateToken = useCallback(async () => {
    if (!payload.identy || !payload.sub || !payload.name) {
      alert('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/docs/generate-token', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          payload: {
            ...payload,
            exp: Math.floor(Date.now() / 1000) + (expirationHours * 60 * 60),
          },
          useCurrentUserKey: true
        }),
      });
      
      if (!response.ok) throw new Error('Failed to generate token');
      
      const data = await response.json();
      setToken(data.token);
    } catch (error) {
      console.error('Error generating token:', error);
      alert('Failed to generate token. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [payload, expirationHours]);

  const copyToClipboard = useCallback(async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }, []);

  const goToChat = useCallback(() => {
    if (token) {
      window.open(`/chat?token=${token}`, '_blank');
    }
  }, [token]);

  const chatUrl = useMemo(() => {
    if (!token) return '';
    return `${window.location.origin}/chat?token=${token}`;
  }, [token]);

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">JWT Token Generator</h2>
          <p className="mt-2 text-gray-600">
            Generate JWT tokens for chat authentication using your private key
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">로그인이 필요합니다</h3>
              <p className="mt-1 text-sm text-yellow-700">
                JWT 토큰을 생성하려면 먼저 로그인해주세요. Identity는 현재 로그인된 사용자로 자동 설정됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">JWT Token Generator</h2>
        <p className="mt-2 text-gray-600">
          Generate JWT tokens for chat authentication using your private key
        </p>
        <div className="mt-2 text-sm text-blue-600">
          현재 로그인: <strong>{user.email}</strong> (Identity: {user.identity || user.identy})
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800">Token Payload</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Identity (identy) * <span className="text-sm text-blue-600">(현재 로그인된 사용자)</span>
            </label>
            <input
              type="text"
              value={payload.identy}
              readOnly
              placeholder="현재 로그인된 사용자의 Identity"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User Type *
            </label>
            <select
              value={payload.type}
              onChange={(e) => handlePayloadChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User ID (sub) *
            </label>
            <input
              type="text"
              value={payload.sub}
              onChange={(e) => handlePayloadChange('sub', e.target.value)}
              placeholder="user-unique-id"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User Name *
            </label>
            <input
              type="text"
              value={payload.name}
              onChange={(e) => handlePayloadChange('name', e.target.value)}
              placeholder="John Doe"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiration (hours)
            </label>
            <input
              type="number"
              value={expirationHours}
              onChange={(e) => setExpirationHours(parseInt(e.target.value) || 24)}
              min="1"
              max="720"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <svg className="h-5 w-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <h4 className="text-sm font-medium text-blue-900">자동 키 사용</h4>
            </div>
            <p className="text-sm text-blue-700">
              현재 로그인된 사용자의 Private Key를 자동으로 사용합니다.
            </p>
          </div>

          <button
            onClick={generateToken}
            disabled={isGenerating}
            className={`
              w-full px-4 py-3 rounded-md font-medium transition-all text-lg
              ${isGenerating
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700 shadow-lg hover:shadow-xl'
              }
              text-white
            `}
          >
            {isGenerating ? '토큰 생성 중...' : '🎫 JWT 토큰 생성'}
          </button>
        </div>
      </div>

      {token && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-green-900">Generated JWT Token</h3>
              <button
                onClick={() => copyToClipboard(token, 'token')}
                className="px-3 py-1 text-sm bg-white border border-green-300 rounded hover:bg-green-100 transition-colors"
              >
                {copiedField === 'token' ? '✓ Copied' : '📋 Copy Token'}
              </button>
            </div>
            <div className="bg-white p-3 rounded border border-green-200">
              <p className="text-xs font-mono break-all">{token}</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-blue-900">Chat URL with Token</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => copyToClipboard(chatUrl, 'url')}
                  className="px-3 py-1 text-sm bg-white border border-blue-300 rounded hover:bg-blue-100 transition-colors"
                >
                  {copiedField === 'url' ? '✓ Copied' : '📋 Copy URL'}
                </button>
                <button
                  onClick={goToChat}
                  className="px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
                >
                  💬 채팅으로 이동
                </button>
              </div>
            </div>
            <div className="bg-white p-3 rounded border border-blue-200">
              <p className="text-xs break-all">
                <a href={chatUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {chatUrl}
                </a>
              </p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Decoded Payload</h3>
            <pre className="bg-white p-3 rounded border border-gray-200 text-xs overflow-x-auto">
              {JSON.stringify({
                ...payload,
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + (expirationHours * 60 * 60),
              }, null, 2)}
            </pre>
          </div>
        </motion.div>
      )}
    </div>
  );
});

TokenGenerator.displayName = 'TokenGenerator';

export default TokenGenerator;