'use client';

import { useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';

const KeyGenerator = memo(() => {
  const [keyPair, setKeyPair] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasViewed, setHasViewed] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const generateKeys = useCallback(async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/docs/generate-keys', {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to generate keys');
      
      const data = await response.json();
      setKeyPair({
        ...data,
        createdAt: new Date().toISOString(),
        id: crypto.randomUUID(),
      });
      setHasViewed(false);
      setShowPrivateKey(false);
    } catch (error) {
      console.error('Error generating keys:', error);
      alert('Failed to generate keys. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const viewPrivateKey = useCallback(() => {
    if (!hasViewed) {
      setShowPrivateKey(true);
      setHasViewed(true);
      // Hide after 30 seconds for security
      setTimeout(() => {
        setShowPrivateKey(false);
      }, 30000);
    }
  }, [hasViewed]);

  const copyToClipboard = useCallback(async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }, []);

  const downloadKey = useCallback((key, type) => {
    const blob = new Blob([key], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `edutalk-${type}-key-${Date.now()}.pem`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">RSA Key Pair Generator</h2>
        <p className="mt-2 text-gray-600">
          Generate RS256 key pairs for JWT signing. Private keys are shown only once!
        </p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={generateKeys}
          disabled={isGenerating}
          className={`
            px-8 py-3 rounded-lg font-medium transition-all transform
            ${isGenerating
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700 hover:scale-105 active:scale-95'
            }
            text-white shadow-lg
          `}
        >
          {isGenerating ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </span>
          ) : (
            '🔐 Generate New Key Pair'
          )}
        </button>
      </div>

      {keyPair && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-green-900">Public Key</h3>
              <div className="space-x-2">
                <button
                  onClick={() => copyToClipboard(keyPair.publicKey, 'public')}
                  className="px-3 py-1 text-sm bg-white border border-green-300 rounded hover:bg-green-100 transition-colors"
                >
                  {copiedField === 'public' ? '✓ Copied' : '📋 Copy'}
                </button>
                <button
                  onClick={() => downloadKey(keyPair.publicKey, 'public')}
                  className="px-3 py-1 text-sm bg-white border border-green-300 rounded hover:bg-green-100 transition-colors"
                >
                  💾 Download
                </button>
              </div>
            </div>
            <pre className="bg-white p-3 rounded border border-green-200 text-xs overflow-x-auto">
              {keyPair.publicKey}
            </pre>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-red-900">Private Key</h3>
              {!hasViewed ? (
                <button
                  onClick={viewPrivateKey}
                  className="px-4 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  🔓 View Private Key (One Time Only)
                </button>
              ) : showPrivateKey ? (
                <div className="space-x-2">
                  <button
                    onClick={() => copyToClipboard(keyPair.privateKey, 'private')}
                    className="px-3 py-1 text-sm bg-white border border-red-300 rounded hover:bg-red-100 transition-colors"
                  >
                    {copiedField === 'private' ? '✓ Copied' : '📋 Copy'}
                  </button>
                  <button
                    onClick={() => downloadKey(keyPair.privateKey, 'private')}
                    className="px-3 py-1 text-sm bg-white border border-red-300 rounded hover:bg-red-100 transition-colors"
                  >
                    💾 Download
                  </button>
                  <span className="text-xs text-red-600">Auto-hide in 30s</span>
                </div>
              ) : (
                <span className="text-sm text-red-600 font-medium">
                  ⚠️ Key has been viewed and hidden
                </span>
              )}
            </div>
            {showPrivateKey ? (
              <pre className="bg-white p-3 rounded border border-red-200 text-xs overflow-x-auto">
                {keyPair.privateKey}
              </pre>
            ) : (
              <div className="bg-white p-8 rounded border border-red-200 text-center">
                <p className="text-gray-500">
                  {hasViewed
                    ? '🔒 Private key has been viewed and is now hidden for security'
                    : '🔐 Click "View Private Key" to reveal (one-time only)'}
                </p>
              </div>
            )}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="h-5 w-5 text-yellow-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-yellow-800">Security Warning</h4>
                <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                  <li>Private keys can only be viewed once for security</li>
                  <li>Save your private key immediately - it cannot be recovered</li>
                  <li>Never share your private key or commit it to version control</li>
                  <li>Generated at: {new Date(keyPair.createdAt).toLocaleString()}</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
});

KeyGenerator.displayName = 'KeyGenerator';

export default KeyGenerator;