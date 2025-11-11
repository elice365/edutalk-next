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
            { name: 'message', type: 'string', required: false, description: '메시지 내용 (전송용)' },
            { name: 'file', type: 'string', required: false, description: '파일 데이터 (파일 업로드용)' },
          ],
          response: {
            success: true,
            chat: { uid: 'chat-id', lastChat: 'message', updateTime: '2024-01-01T00:00:00Z' },
            messageInfo: { uid: 'msg-id', content: 'message', timestamp: '2024-01-01T00:00:00Z' }
          }
        },
        {
          method: 'GET',
          path: '/api/chat/messages',
          description: '채팅방 메시지 히스토리 조회',
          auth: true,
          params: [
            { name: 'chatRoomId', type: 'string', required: true, description: '조회할 채팅방 ID' },
            { name: 'limit', type: 'number', required: false, description: '가져올 메시지 수 (기본: 50)' },
            { name: 'offset', type: 'number', required: false, description: '건너뛸 메시지 수 (페이징용)' },
          ],
          response: {
            success: true,
            messages: [
              {
                messageUid: 'msg_123456',
                senderId: 'user_123',
                senderName: '홍길동',
                content: '안녕하세요',
                timestamp: '2024-01-01T00:00:00Z',
                read: true,
                sequence: 1
              }
            ],
            total: 10
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
    {
      id: 'profile',
      title: '👤 프로필 관리',
      endpoints: [
        {
          method: 'GET',
          path: '/api/profile/avatar',
          description: '사용자 아바타 조회',
          auth: true,
          response: {
            success: true,
            avatar: 'https://example.com/avatar.jpg',
            name: '홍길동',
            email: 'user@example.com'
          }
        },
        {
          method: 'POST',
          path: '/api/profile/avatar',
          description: '아바타 업로드 또는 URL 설정',
          auth: true,
          contentType: 'multipart/form-data 또는 application/json',
          body: [
            { name: 'avatar', type: 'File', required: false, description: '이미지 파일 (multipart/form-data, max 2MB)' },
            { name: 'avatarUrl', type: 'string', required: false, description: '외부 이미지 URL (JSON)' },
          ],
          response: {
            success: true,
            message: 'Avatar updated successfully',
            avatar: 'data:image/jpeg;base64,...',
            name: '홍길동',
            email: 'user@example.com'
          }
        },
        {
          method: 'DELETE',
          path: '/api/profile/avatar',
          description: '아바타 제거',
          auth: true,
          response: {
            success: true,
            message: 'Avatar removed successfully'
          }
        },
      ]
    },
    {
      id: 'system',
      title: '🔧 시스템 모니터링',
      endpoints: [
        {
          method: 'GET',
          path: '/api/health',
          description: '시스템 상태 및 데이터베이스 연결 확인',
          auth: false,
          response: {
            status: 'healthy',
            mongodb: { status: 'connected', responseTime: 45 },
            supabase: { status: 'connected', responseTime: 23 },
            timestamp: '2024-01-01T00:00:00Z'
          }
        },
      ]
    },
  ];

  const toggleSection = useCallback((sectionId) => {
    setExpandedSection(prev => prev === sectionId ? null : sectionId);
  }, []);

  return (
    <div className="space-y-3 sm:space-y-6">
      <div className="text-center px-2">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">API 문서</h2>
        <p className="text-xs sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Edutalk API 모든 엔드포인트에 대한 완전한 참조 가이드
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-sm mx-2 sm:mx-0">
        <div className="flex items-start sm:items-center space-x-2 mb-2 sm:mb-3">
          <div className="w-4 h-4 sm:w-6 sm:h-6 bg-blue-100 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
            <svg className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xs sm:text-base font-semibold text-blue-900 flex-1">인증 방법</h3>
        </div>
        <p className="text-xs sm:text-sm text-blue-700 mb-2 sm:mb-3 leading-relaxed pl-0 sm:pl-0">
          인증이 필요한 모든 엔드포인트는 Authorization 헤더에 JWT 토큰이 필요합니다:
        </p>
        <div className="bg-white rounded-md sm:rounded-lg border shadow-sm overflow-hidden">
          <code className="block p-2 sm:p-3 text-xs sm:text-sm font-mono text-gray-800 break-all leading-relaxed">
            Authorization: Bearer &lt;당신의-jwt-토큰&gt;
          </code>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4 mx-2 sm:mx-0">
        {sections.map((section) => (
          <div key={section.id} className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-3 sm:px-6 py-2.5 sm:py-4 text-left bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-200 flex items-center justify-between"
            >
              <h3 className="text-sm sm:text-lg font-semibold text-gray-800 pr-2 flex-1 min-w-0">{section.title}</h3>
              <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                <span className="text-xs bg-primary-100 text-primary-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium whitespace-nowrap">
                  {section.endpoints.length}개
                </span>
                <svg
                  className={`w-3.5 h-3.5 sm:w-5 sm:h-5 transform transition-transform duration-200 text-gray-500 flex-shrink-0 ${expandedSection === section.id ? 'rotate-180' : ''}`}
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
                  <div key={index} className="p-3 sm:p-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors">
                    <div className="flex flex-col space-y-2 mb-3 sm:mb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-1.5 sm:space-y-0 sm:space-x-3">
                        <span className={`
                          px-2 sm:px-3 py-1 text-xs sm:text-sm font-mono rounded font-medium inline-block w-fit flex-shrink-0
                          ${endpoint.method === 'GET' ? 'bg-green-100 text-green-700' :
                            endpoint.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                            endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-700' :
                            endpoint.method === 'DELETE' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'}
                        `}>
                          {endpoint.method}
                        </span>
                        <code className="text-xs sm:text-sm font-mono text-gray-700 break-all bg-gray-50 px-2 py-1 rounded">{endpoint.path}</code>
                      </div>
                      {endpoint.auth && (
                        <div className="flex justify-start">
                          <span className="px-2 sm:px-3 py-1 text-xs bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 rounded-full font-medium border border-orange-200 inline-flex items-center">
                            🔐 인증 필요
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">{endpoint.description}</p>

                    {endpoint.params && (
                      <div className="mb-3 sm:mb-4">
                        <h4 className="font-semibold text-xs sm:text-sm text-gray-700 mb-2">쿼리 매개변수</h4>
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-md sm:rounded-lg p-2 sm:p-4 space-y-2 sm:space-y-3 border border-gray-200">
                          {endpoint.params.map((param, i) => (
                            <div key={i} className="text-xs sm:text-sm bg-white rounded-md sm:rounded-lg p-2 sm:p-3 shadow-sm">
                              <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                                <span className="font-mono text-blue-600 font-medium text-xs sm:text-sm">{param.name}</span>
                                <span className="text-gray-500 text-xs bg-gray-100 px-1.5 sm:px-2 py-0.5 rounded">({param.type})</span>
                                {param.required && <span className="text-red-500 text-xs bg-red-50 px-1.5 sm:px-2 py-0.5 rounded font-medium">*</span>}
                              </div>
                              <p className="text-gray-600 text-xs leading-relaxed">{param.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {endpoint.body && (
                      <div className="mb-3 sm:mb-4">
                        <h4 className="font-semibold text-xs sm:text-sm text-gray-700 mb-2">요청 본문</h4>
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-md sm:rounded-lg p-2 sm:p-4 space-y-2 sm:space-y-3 border border-gray-200">
                          {endpoint.body.map((field, i) => (
                            <div key={i} className="text-xs sm:text-sm bg-white rounded-md sm:rounded-lg p-2 sm:p-3 shadow-sm">
                              <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                                <span className="font-mono text-blue-600 font-medium text-xs sm:text-sm">{field.name}</span>
                                <span className="text-gray-500 text-xs bg-gray-100 px-1.5 sm:px-2 py-0.5 rounded">({field.type})</span>
                                {field.required && <span className="text-red-500 text-xs bg-red-50 px-1.5 sm:px-2 py-0.5 rounded font-medium">*</span>}
                              </div>
                              <p className="text-gray-600 text-xs leading-relaxed">{field.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {endpoint.response && (
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-2 sm:space-y-0">
                          <h4 className="font-semibold text-xs sm:text-sm text-gray-700">응답 예제</h4>
                          <button
                            onClick={() => copyCode(JSON.stringify(endpoint.response, null, 2), `${section.id}-${index}`)}
                            className="px-2 sm:px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md sm:rounded-lg transition-colors font-medium w-fit"
                          >
                            {copiedCode === `${section.id}-${index}` ? '✓ 복사됨' : '📋 복사'}
                          </button>
                        </div>
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-md sm:rounded-lg shadow-inner border border-gray-700 overflow-hidden">
                          <pre className="text-gray-100 p-2 sm:p-4 text-xs overflow-x-auto leading-relaxed">
                            {JSON.stringify(endpoint.response, null, 2)}
                          </pre>
                        </div>
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
              <span>채팅 메시지 전송</span>
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

          <div>
            <h4 className="font-medium text-gray-700 mb-3 flex items-center space-x-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
              <span>공지사항 조회</span>
            </h4>
            <pre className="bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto shadow-inner border border-gray-700">
{`fetch('/api/notice?identy=contractor-id', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
});`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
});

ApiDocumentation.displayName = 'ApiDocumentation';

export default ApiDocumentation;