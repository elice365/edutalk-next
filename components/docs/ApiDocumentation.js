'use client';

import { memo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const ApiDocumentation = memo(() => {
  const [expandedSection, setExpandedSection] = useState('auth');
  const [copiedCode, setCopiedCode] = useState(null);

  const copyCode = useCallback((code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  }, []);

  const sections = [
    {
      id: 'auth',
      title: '🔐 사용자 인증',
      endpoints: [
        {
          method: 'POST',
          path: '/api/login',
          description: '사용자 인증 및 JWT 토큰 받기',
          auth: false,
          body: [
            { name: 'email', type: 'string', required: true, description: '사용자 이메일 주소' },
            { name: 'password', type: 'string', required: true, description: '사용자 비밀번호' },
          ],
          response: {
            success: true,
            token: 'jwt-token-here',
            contractor: { uid: 'uuid', identy: 'identity', email: 'user@example.com' }
          }
        },
        {
          method: 'POST',
          path: '/api/register',
          description: '새 계약자 계정 등록',
          auth: false,
          body: [
            { name: 'email', type: 'string', required: true, description: '이메일 주소' },
            { name: 'password', type: 'string', required: true, description: '비밀번호 (최소 8자)' },
            { name: 'identy', type: 'string', required: true, description: '고유 계약자 식별자' },
            { name: 'origin', type: 'string', required: false, description: '등록 출처' },
          ],
          response: {
            success: true,
            message: 'Registration successful',
            contractor: { uid: 'uuid', identy: 'identity', email: 'user@example.com' },
            emailSent: true
          }
        },
        {
          method: 'POST',
          path: '/api/reset',
          description: '비밀번호 재설정 요청 또는 토큰으로 재설정',
          auth: false,
          body: [
            { name: 'email', type: 'string', required: true, description: '재설정할 이메일' },
            { name: 'token', type: 'string', required: false, description: '재설정 토큰 (비밀번호 변경용)' },
            { name: 'newPassword', type: 'string', required: false, description: '새 비밀번호 (토큰과 함께)' },
          ]
        },
        {
          method: 'GET',
          path: '/api/verify',
          description: '이메일 주소 인증',
          auth: false,
          params: [
            { name: 'email', type: 'string', required: true, description: '인증할 이메일' },
            { name: 'token', type: 'string', required: true, description: '인증 토큰' },
          ]
        },
      ]
    },
    {
      id: 'chat',
      title: '💬 채팅 작업',
      endpoints: [
        {
          method: 'POST',
          path: '/api/chat',
          description: '채팅 작업 (전송, 목록, 삭제)',
          auth: true,
          body: [
            { name: 'type', type: 'string', required: true, description: '작업 유형: send, file, delete, list' },
            { name: 'id', type: 'string', required: false, description: '채팅 또는 메시지 ID' },
            { name: 'message', type: 'string', required: false, description: '메시지 내용 (전솨용)' },
            { name: 'file', type: 'string', required: false, description: '파일 데이터 (파일 업로드용)' },
          ],
          response: {
            success: true,
            chat: { uid: 'chat-id', lastChat: 'message', updateTime: '2024-01-01T00:00:00Z' }
          }
        },
      ]
    },
    {
      id: 'admin',
      title: '👨‍🏫 관리자 작업',
      endpoints: [
        {
          method: 'POST',
          path: '/api/edit/chat',
          description: '채팅방 관리 (강사 전용)',
          auth: true,
          body: [
            { name: 'type', type: 'string', required: true, description: '작업 유형: create, delete, bulk-create' },
            { name: 'id', type: 'string', required: false, description: '학생/채팅 ID' },
            { name: 'name', type: 'string', required: false, description: '학생 이름' },
            { name: 'studentID', type: 'array', required: false, description: '학생 ID 배열 (대량)' },
            { name: 'studentName', type: 'array', required: false, description: '학생 이름 배열 (대량)' },
          ]
        },
        {
          method: 'POST',
          path: '/api/edit/notice',
          description: '공지사항 관리 (강사 전용)',
          auth: true,
          body: [
            { name: 'type', type: 'string', required: true, description: '작업 유형: create, update, delete, list' },
            { name: 'id', type: 'string', required: false, description: '공지 ID (수정/삭제용)' },
            { name: 'title', type: 'string', required: false, description: '공지 제목' },
            { name: 'context', type: 'string', required: false, description: '공지 내용' },
            { name: 'displayOrder', type: 'number', required: false, description: '표시 우선순위' },
            { name: 'expirationTime', type: 'string', required: false, description: '만료 날짜' },
          ]
        },
      ]
    },
    {
      id: 'public',
      title: '📢 공개 엔드포인트',
      endpoints: [
        {
          method: 'GET',
          path: '/api/notice',
          description: '공개 공지사항 조회',
          auth: false,
          params: [
            { name: 'identy', type: 'string', required: true, description: '계약자 식별자' },
          ],
          response: {
            success: true,
            notices: [
              { uid: 'notice-id', title: 'Notice', context: 'Content', createTime: '2024-01-01T00:00:00Z' }
            ]
          }
        },
      ]
    },
  ];

  const toggleSection = useCallback((sectionId) => {
    setExpandedSection(prev => prev === sectionId ? null : sectionId);
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">API 문서</h2>
        <p className="mt-2 text-gray-600">
          Edutalk API 모든 엔드포인트에 대한 완전한 참조 가이드
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="font-semibold text-blue-900">인증 방법</h3>
        </div>
        <p className="text-sm text-blue-700 mb-3">
          인증이 필요한 모든 엔드포인트는 Authorization 헤더에 JWT 토큰이 필요합니다:
        </p>
        <code className="block p-3 bg-white rounded-lg text-sm font-mono border shadow-sm">
          Authorization: Bearer &lt;당신의-jwt-토큰&gt;
        </code>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-6 py-4 text-left bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-200 flex items-center justify-between"
            >
              <h3 className="text-lg font-semibold text-gray-800">{section.title}</h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-medium">
                  {section.endpoints.length}개 엔드포인트
                </span>
                <svg
                  className={`w-5 h-5 transform transition-transform duration-200 text-gray-500 ${expandedSection === section.id ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {expandedSection === section.id && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="border-t border-gray-200"
              >
                {section.endpoints.map((endpoint, index) => (
                  <div key={index} className="p-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className={`
                          px-3 py-1 text-sm font-mono rounded font-medium
                          ${endpoint.method === 'GET' ? 'bg-green-100 text-green-700' :
                            endpoint.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                            endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-700' :
                            endpoint.method === 'DELETE' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'}
                        `}>
                          {endpoint.method}
                        </span>
                        <code className="text-sm font-mono text-gray-700">{endpoint.path}</code>
                      </div>
                      {endpoint.auth && (
                        <span className="px-3 py-1 text-xs bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 rounded-full font-medium border border-orange-200">
                          🔐 인증 필요
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 mb-4">{endpoint.description}</p>

                    {endpoint.params && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">쿼리 매개변수</h4>
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 space-y-3 border border-gray-200">
                          {endpoint.params.map((param, i) => (
                            <div key={i} className="text-sm bg-white rounded-lg p-3 shadow-sm">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-mono text-blue-600 font-medium">{param.name}</span>
                                <span className="text-gray-500 text-xs bg-gray-100 px-2 py-0.5 rounded">({param.type})</span>
                                {param.required && <span className="text-red-500 text-xs bg-red-50 px-2 py-0.5 rounded font-medium">*</span>}
                              </div>
                              <p className="text-gray-600 text-xs">{param.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {endpoint.body && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">요청 본문</h4>
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 space-y-3 border border-gray-200">
                          {endpoint.body.map((field, i) => (
                            <div key={i} className="text-sm bg-white rounded-lg p-3 shadow-sm">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-mono text-blue-600 font-medium">{field.name}</span>
                                <span className="text-gray-500 text-xs bg-gray-100 px-2 py-0.5 rounded">({field.type})</span>
                                {field.required && <span className="text-red-500 text-xs bg-red-50 px-2 py-0.5 rounded font-medium">*</span>}
                              </div>
                              <p className="text-gray-600 text-xs">{field.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {endpoint.response && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-sm text-gray-700">응답 예제</h4>
                          <button
                            onClick={() => copyCode(JSON.stringify(endpoint.response, null, 2), `${section.id}-${index}`)}
                            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                          >
                            {copiedCode === `${section.id}-${index}` ? '✓ 복사됨' : '📋 복사'}
                          </button>
                        </div>
                        <pre className="bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto shadow-inner border border-gray-700">
                          {JSON.stringify(endpoint.response, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900">빠른 시작 예제</h3>
        </div>
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-3 flex items-center space-x-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
              <span>회원가입 및 로그인</span>
            </h4>
            <pre className="bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto shadow-inner border border-gray-700">
{`// 회원가입
fetch('/api/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securePassword',
    identy: 'unique-contractor-id'
  })
});

// 로그인
const response = await fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securePassword'
  })
});
const { token } = await response.json();`}</pre>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-3 flex items-center space-x-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
              <span>인증된 요청 보내기</span>
            </h4>
            <pre className="bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto shadow-inner border border-gray-700">
{`fetch('/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${token}\`
  },
  body: JSON.stringify({
    type: 'send',
    id: 'chat-id',
    message: '안녕하세요!'
  })
});`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
});

ApiDocumentation.displayName = 'ApiDocumentation';

export default ApiDocumentation;