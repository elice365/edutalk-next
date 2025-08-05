import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef();
  const [mounted, setMounted] = useState(false);

  // 클라이언트 사이드에서만 마운트
  useEffect(() => {
    setMounted(true);
    
    // modal-root가 없으면 생성
    if (!document.getElementById('modal-root')) {
      const modalRoot = document.createElement('div');
      modalRoot.id = 'modal-root';
      document.body.appendChild(modalRoot);
    }
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen && mounted) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // 모달 열렸을 때 스크롤 방지
    } else {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset'; // 모달 닫혔을 때 스크롤 허용
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, mounted]);

  if (!isOpen || !mounted) return null;

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  return ReactDOM.createPortal(
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
    >
      <div 
        className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full mx-4 relative dark:bg-neutral-800 dark:text-white"
        onClick={(e) => e.stopPropagation()} // 모달 내용 클릭 시 닫히지 않도록 방지
        ref={modalRef}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
            aria-label="모달 닫기"
          >
            &times;
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;
