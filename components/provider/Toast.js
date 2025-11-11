'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import Toast from '@/components/ui/Toast';

/**
 * Toast context for managing toast notifications
 */
const ToastContext = createContext(null);

/**
 * Hook to access toast functionality
 * @returns {Object} Toast methods
 * @returns {Function} return.showToast - Show a toast notification
 * @returns {Function} return.success - Show success toast
 * @returns {Function} return.error - Show error toast
 * @returns {Function} return.warning - Show warning toast
 * @returns {Function} return.info - Show info toast
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

/**
 * Toast Provider component
 * Manages toast notifications globally
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  /**
   * Show a toast notification
   * @param {string} message - Toast message
   * @param {string} type - Toast type (success, error, warning, info)
   * @param {number} duration - Auto-dismiss duration in ms (0 = no auto-dismiss)
   */
  const showToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  /**
   * Close a specific toast
   * @param {number} id - Toast ID to close
   */
  const closeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Convenience methods for different toast types
  const success = useCallback((message, duration) => {
    showToast(message, 'success', duration);
  }, [showToast]);

  const error = useCallback((message, duration) => {
    showToast(message, 'error', duration);
  }, [showToast]);

  const warning = useCallback((message, duration) => {
    showToast(message, 'warning', duration);
  }, [showToast]);

  const info = useCallback((message, duration) => {
    showToast(message, 'info', duration);
  }, [showToast]);

  const value = {
    showToast,
    success,
    error,
    warning,
    info
  };

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Toast container - fixed position at top-right */}
      <div
        className="fixed top-4 right-4 z-[9999] max-w-md w-full pointer-events-none"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="flex flex-col pointer-events-auto">
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              id={toast.id}
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={closeToast}
            />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}
