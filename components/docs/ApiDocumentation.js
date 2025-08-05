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
      title: '🔐 Authentication',
      endpoints: [
        {
          method: 'POST',
          path: '/api/login',
          description: 'Authenticate user and receive JWT token',
          auth: false,
          body: [
            { name: 'email', type: 'string', required: true, description: 'User email address' },
            { name: 'password', type: 'string', required: true, description: 'User password' },
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
          description: 'Register new contractor account',
          auth: false,
          body: [
            { name: 'email', type: 'string', required: true, description: 'Email address' },
            { name: 'password', type: 'string', required: true, description: 'Password (min 8 chars)' },
            { name: 'identy', type: 'string', required: true, description: 'Unique contractor identity' },
            { name: 'origin', type: 'string', required: false, description: 'Registration source' },
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
          description: 'Request password reset or reset with token',
          auth: false,
          body: [
            { name: 'email', type: 'string', required: true, description: 'Email for reset' },
            { name: 'token', type: 'string', required: false, description: 'Reset token (for password change)' },
            { name: 'newPassword', type: 'string', required: false, description: 'New password (with token)' },
          ]
        },
        {
          method: 'GET',
          path: '/api/verify',
          description: 'Verify email address',
          auth: false,
          params: [
            { name: 'email', type: 'string', required: true, description: 'Email to verify' },
            { name: 'token', type: 'string', required: true, description: 'Verification token' },
          ]
        },
      ]
    },
    {
      id: 'chat',
      title: '💬 Chat Operations',
      endpoints: [
        {
          method: 'POST',
          path: '/api/chat',
          description: 'Chat operations (send, list, delete)',
          auth: true,
          body: [
            { name: 'type', type: 'string', required: true, description: 'Operation: send, file, delete, list' },
            { name: 'id', type: 'string', required: false, description: 'Chat or message ID' },
            { name: 'message', type: 'string', required: false, description: 'Message content (for send)' },
            { name: 'file', type: 'string', required: false, description: 'File data (for file upload)' },
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
      title: '👨‍🏫 Admin Operations',
      endpoints: [
        {
          method: 'POST',
          path: '/api/edit/chat',
          description: 'Manage chat rooms (teacher only)',
          auth: true,
          body: [
            { name: 'type', type: 'string', required: true, description: 'Operation: create, delete, bulk-create' },
            { name: 'id', type: 'string', required: false, description: 'Student/Chat ID' },
            { name: 'name', type: 'string', required: false, description: 'Student name' },
            { name: 'studentID', type: 'array', required: false, description: 'Array of student IDs (bulk)' },
            { name: 'studentName', type: 'array', required: false, description: 'Array of student names (bulk)' },
          ]
        },
        {
          method: 'POST',
          path: '/api/edit/notice',
          description: 'Manage notices (teacher only)',
          auth: true,
          body: [
            { name: 'type', type: 'string', required: true, description: 'Operation: create, update, delete, list' },
            { name: 'id', type: 'string', required: false, description: 'Notice ID (for update/delete)' },
            { name: 'title', type: 'string', required: false, description: 'Notice title' },
            { name: 'context', type: 'string', required: false, description: 'Notice content' },
            { name: 'displayOrder', type: 'number', required: false, description: 'Display priority' },
            { name: 'expirationTime', type: 'string', required: false, description: 'Expiration date' },
          ]
        },
      ]
    },
    {
      id: 'public',
      title: '📢 Public Endpoints',
      endpoints: [
        {
          method: 'GET',
          path: '/api/notice',
          description: 'Get public notices',
          auth: false,
          params: [
            { name: 'identy', type: 'string', required: true, description: 'Contractor identity' },
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
        <h2 className="text-2xl font-bold text-gray-900">API Documentation</h2>
        <p className="mt-2 text-gray-600">
          Complete reference for all Edutalk API endpoints
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Authentication</h3>
        <p className="text-sm text-blue-700">
          All authenticated endpoints require a JWT token in the Authorization header:
        </p>
        <code className="block mt-2 p-2 bg-white rounded text-xs">
          Authorization: Bearer &lt;your-jwt-token&gt;
        </code>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
            >
              <h3 className="text-lg font-semibold">{section.title}</h3>
              <svg
                className={`w-5 h-5 transform transition-transform ${expandedSection === section.id ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {expandedSection === section.id && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="border-t border-gray-200"
              >
                {section.endpoints.map((endpoint, index) => (
                  <div key={index} className="p-6 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center justify-between mb-3">
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
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">
                          🔐 Auth Required
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 mb-4">{endpoint.description}</p>

                    {endpoint.params && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Query Parameters</h4>
                        <div className="bg-gray-50 rounded p-3 space-y-2">
                          {endpoint.params.map((param, i) => (
                            <div key={i} className="text-sm">
                              <span className="font-mono text-blue-600">{param.name}</span>
                              <span className="text-gray-500 ml-2">({param.type})</span>
                              {param.required && <span className="text-red-500 ml-1">*</span>}
                              <p className="text-gray-600 text-xs mt-1">{param.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {endpoint.body && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Request Body</h4>
                        <div className="bg-gray-50 rounded p-3 space-y-2">
                          {endpoint.body.map((field, i) => (
                            <div key={i} className="text-sm">
                              <span className="font-mono text-blue-600">{field.name}</span>
                              <span className="text-gray-500 ml-2">({field.type})</span>
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                              <p className="text-gray-600 text-xs mt-1">{field.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {endpoint.response && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-sm text-gray-700">Example Response</h4>
                          <button
                            onClick={() => copyCode(JSON.stringify(endpoint.response, null, 2), `${section.id}-${index}`)}
                            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                          >
                            {copiedCode === `${section.id}-${index}` ? '✓ Copied' : '📋 Copy'}
                          </button>
                        </div>
                        <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
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

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Start Examples</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">1. Register & Login</h4>
            <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`// Register
fetch('/api/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securePassword',
    identy: 'unique-contractor-id'
  })
});

// Login
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
            <h4 className="font-medium text-gray-700 mb-2">2. Send Authenticated Request</h4>
            <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`fetch('/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${token}\`
  },
  body: JSON.stringify({
    type: 'send',
    id: 'chat-id',
    message: 'Hello!'
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