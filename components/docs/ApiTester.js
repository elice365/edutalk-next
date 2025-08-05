'use client';

import { useState, useCallback, memo, useMemo } from 'react';
import { motion } from 'framer-motion';

const ApiTester = memo(() => {
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [customUrl, setCustomUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json"\n}');
  const [body, setBody] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [responseTime, setResponseTime] = useState(null);

  const endpoints = useMemo(() => [
    {
      name: '채팅 - 메시지 전송',
      path: '/api/chat',
      method: 'POST',
      requiresAuth: true,
      description: '채팅으로 메시지 전송',
      exampleBody: JSON.stringify({ type: 'send', id: 'chat-id', message: 'Hello!' }, null, 2),
    },
    {
      name: '채팅 - 목록',
      path: '/api/chat',
      method: 'POST',
      requiresAuth: true,
      description: '사용자 채팅 목록 조회',
      exampleBody: JSON.stringify({ type: 'list' }, null, 2),
    },
    {
      name: '채팅 생성 (관리자)',
      path: '/api/edit/chat',
      method: 'POST',
      requiresAuth: true,
      description: '새 채팅방 생성 (강사 전용)',
      exampleBody: JSON.stringify({ type: 'create', id: 'student-id', name: 'Student Name' }, null, 2),
    },
    {
      name: '공지 생성 (관리자)',
      path: '/api/edit/notice',
      method: 'POST',
      requiresAuth: true,
      description: '공지 생성 (강사 전용)',
      exampleBody: JSON.stringify({ type: 'create', title: 'Notice Title', context: 'Notice content' }, null, 2),
    },
    {
      name: '공지 조회',
      path: '/api/notices?identy=contractor-id',
      method: 'GET',
      requiresAuth: false,
      description: '계약자용 공개 공지 조회',
    },
  ], []);

  const selectEndpoint = useCallback((endpoint) => {
    setSelectedEndpoint(endpoint);
    setCustomUrl(endpoint.path);
    setMethod(endpoint.method);
    if (endpoint.exampleBody) {
      setBody(endpoint.exampleBody);
    } else {
      setBody('');
    }
  }, []);

  const sendRequest = useCallback(async () => {
    setIsLoading(true);
    setResponse(null);
    setResponseTime(null);

    const startTime = performance.now();

    try {
      const parsedHeaders = JSON.parse(headers);
      if (authToken) {
        parsedHeaders['Authorization'] = `Bearer ${authToken}`;
      }

      const options = {
        method,
        headers: parsedHeaders,
      };

      if (method !== 'GET' && body) {
        options.body = body;
      }

      const res = await fetch(customUrl, options);
      const endTime = performance.now();
      setResponseTime(endTime - startTime);

      const contentType = res.headers.get('content-type');
      let data;
      if (contentType?.includes('application/json')) {
        data = await res.json();
      } else {
        data = await res.text();
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        data,
      });
    } catch (error) {
      setResponse({
        error: true,
        message: error.message || 'Request failed',
      });
    } finally {
      setIsLoading(false);
    }
  }, [customUrl, method, headers, body, authToken]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">API 테스터</h2>
        <p className="mt-2 text-gray-600">
          사용자 지정 요청 및 인증으로 API 엔드포인트를 테스트합니다
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <h3 className="font-semibold text-gray-800 mb-3">빠른 선택</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {endpoints.map((endpoint, index) => (
              <button
                key={index}
                onClick={() => selectEndpoint(endpoint)}
                className={`
                  w-full text-left p-3 rounded-lg border transition-all
                  ${selectedEndpoint === endpoint
                    ? 'bg-primary-50 border-primary-300'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{endpoint.name}</span>
                  <span className={`
                    px-2 py-1 text-xs font-mono rounded
                    ${endpoint.method === 'GET' ? 'bg-green-100 text-green-700' :
                      endpoint.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                      endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-700' :
                      endpoint.method === 'DELETE' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'}
                  `}>
                    {endpoint.method}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{endpoint.description}</p>
                {endpoint.requiresAuth && (
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded">
                    🔐 인증 필요
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL
              </label>
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="/api/endpoint"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                메소드
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              인증 토큰 (선택사항)
            </label>
            <input
              type="text"
              value={authToken}
              onChange={(e) => setAuthToken(e.target.value)}
              placeholder="JWT 토큰 (Bearer 접두어 없이)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              헤더 (JSON)
            </label>
            <textarea
              value={headers}
              onChange={(e) => setHeaders(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-xs"
            />
          </div>

          {method !== 'GET' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                요청 본문 (JSON)
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-xs"
              />
            </div>
          )}

          <button
            onClick={sendRequest}
            disabled={isLoading}
            className={`
              w-full px-4 py-2 rounded-md font-medium transition-all
              ${isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700'
              }
              text-white
            `}
          >
            {isLoading ? '전송 중...' : '🚀 요청 전송'}
          </button>

          {response && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              {responseTime && (
                <div className="text-sm text-gray-600">
                  응답 시간: <span className="font-mono">{responseTime.toFixed(2)}ms</span>
                </div>
              )}
              
              {!response.error ? (
                <>
                  <div className={`
                    p-3 rounded-lg
                    ${response.status >= 200 && response.status < 300 ? 'bg-green-50 border border-green-200' :
                      response.status >= 400 && response.status < 500 ? 'bg-yellow-50 border border-yellow-200' :
                      'bg-red-50 border border-red-200'}
                  `}>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">상태</span>
                      <span className="font-mono">{response.status} {response.statusText}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <h4 className="font-semibold mb-2">응답 헤더</h4>
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(response.headers, null, 2)}
                    </pre>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <h4 className="font-semibold mb-2">응답 본문</h4>
                    <pre className="text-xs overflow-x-auto">
                      {typeof response.data === 'object'
                        ? JSON.stringify(response.data, null, 2)
                        : response.data}
                    </pre>
                  </div>
                </>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <h4 className="font-semibold text-red-900">오류</h4>
                  <p className="text-red-700 mt-1">{response.message}</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
});

ApiTester.displayName = 'ApiTester';

export default ApiTester;