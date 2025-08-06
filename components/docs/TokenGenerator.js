'use client';

import { useState, useCallback, memo, useMemo, useContext, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '@/components/provider/Auth';
import QRCode from 'qrcode';

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
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const qrCanvasRef = useRef(null);

  const handlePayloadChange = useCallback((field, value) => {
    setPayload(prev => ({ ...prev, [field]: value }));
  }, []);

  // QR 코드 생성 함수
  const generateQRCode = useCallback(async (tokenValue) => {
    if (!tokenValue) return;
    
    setIsGeneratingQR(true);
    try {
      // 토큰을 URL 형태로 생성
      const tokenUrl = `${window.location.origin}/chat?token=${tokenValue}`;
      
      // QR 코드 생성 옵션
      const qrOptions = {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        quality: 0.92,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 256
      };
      
      const dataUrl = await QRCode.toDataURL(tokenUrl, qrOptions);
      setQrCodeDataUrl(dataUrl);
    } catch (error) {
      console.error('QR 코드 생성 실패:', error);
      alert('QR 코드 생성에 실패했습니다.');
    } finally {
      setIsGeneratingQR(false);
    }
  }, []);

  const generateToken = useCallback(async () => {
    if (!payload.identy || !payload.sub || !payload.name) {
      alert('모든 필수 필드를 입력해주세요');
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
      
      // 토큰 생성 후 자동으로 QR 코드 생성
      await generateQRCode(data.token);
    } catch (error) {
      console.error('Error generating token:', error);
      alert('토큰 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsGenerating(false);
    }
  }, [payload, expirationHours, generateQRCode]);

  const copyToClipboard = useCallback(async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }, []);

  // QR 코드 다운로드 함수
  const downloadQRCode = useCallback(() => {
    if (!qrCodeDataUrl) return;
    
    const link = document.createElement('a');
    link.download = `edutalk-token-qr-${Date.now()}.png`;
    link.href = qrCodeDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [qrCodeDataUrl]);

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
        <h2 className="text-2xl font-bold text-gray-900">JWT 토큰 생성기</h2>
        <p className="mt-2 text-gray-600">
          개인키를 사용하여 채팅 인증을 위한 JWT 토큰을 생성합니다
        </p>
        <div className="mt-2 text-sm text-blue-600">
          현재 로그인: <strong>{user.email}</strong> (Identity: {user.identity || user.identy})
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800">토큰 페이로드</h3>
          
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
              사용자 유형 *
            </label>
            <select
              value={payload.type}
              onChange={(e) => handlePayloadChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="student">학생</option>
              <option value="teacher">강사</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              사용자 ID (sub) *
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
              사용자 이름 *
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
              만료 시간 (시간)
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
              <h3 className="font-semibold text-green-900">생성된 JWT 토큰</h3>
              <button
                onClick={() => copyToClipboard(token, 'token')}
                className="px-3 py-1 text-sm bg-white border border-green-300 rounded hover:bg-green-100 transition-colors"
              >
                {copiedField === 'token' ? '✓ 복사됨' : '📋 토큰 복사'}
              </button>
            </div>
            <div className="bg-white p-3 rounded border border-green-200">
              <p className="text-xs font-mono break-all">{token}</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-blue-900">토큰이 포함된 채팅 URL</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => copyToClipboard(chatUrl, 'url')}
                  className="px-3 py-1 text-sm bg-white border border-blue-300 rounded hover:bg-blue-100 transition-colors"
                >
                  {copiedField === 'url' ? '✓ 복사됨' : '📋 URL 복사'}
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

          {/* QR 코드 섹션 */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-purple-900 flex items-center">
                📱 모바일 앱용 QR 코드
              </h3>
              <div className="flex space-x-2">
                {qrCodeDataUrl && (
                  <button
                    onClick={downloadQRCode}
                    className="px-3 py-1 text-sm bg-white border border-purple-300 rounded hover:bg-purple-100 transition-colors"
                  >
                    💾 QR 코드 다운로드
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-shrink-0">
                {isGeneratingQR ? (
                  <div className="w-64 h-64 bg-white border-2 border-dashed border-purple-300 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                      <p className="text-sm text-purple-600">QR 코드 생성 중...</p>
                    </div>
                  </div>
                ) : qrCodeDataUrl ? (
                  <div className="bg-white p-4 rounded-lg border-2 border-purple-200 shadow-sm">
                    <img 
                      src={qrCodeDataUrl} 
                      alt="토큰 QR 코드" 
                      className="w-56 h-56 mx-auto"
                    />
                  </div>
                ) : (
                  <div className="w-64 h-64 bg-white border-2 border-dashed border-purple-300 rounded-lg flex items-center justify-center">
                    <div className="text-center text-purple-600">
                      <div className="text-4xl mb-2">📱</div>
                      <p className="text-sm">토큰 생성 후<br />QR 코드가 표시됩니다</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="bg-white p-4 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-purple-900 mb-3">📲 사용 방법</h4>
                  <ol className="text-sm text-purple-800 space-y-2">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">1</span>
                      <span>React Native Expo 채팅 앱을 휴대폰에 설치합니다</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">2</span>
                      <span>앱에서 QR 코드 스캔 기능을 실행합니다</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">3</span>
                      <span>이 QR 코드를 스캔하면 자동으로 로그인됩니다</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">4</span>
                      <span>실시간 채팅을 이용할 수 있습니다</span>
                    </li>
                  </ol>
                  
                  <div className="mt-4 p-3 bg-purple-100 rounded-lg">
                    <p className="text-xs text-purple-700">
                      💡 <strong>팁:</strong> QR 코드에는 토큰이 포함된 채팅 URL이 인코딩되어 있습니다. 
                      보안을 위해 토큰의 만료 시간을 적절히 설정하세요.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">디코드된 페이로드</h3>
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