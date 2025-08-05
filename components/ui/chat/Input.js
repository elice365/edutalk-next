import { useRef, useCallback } from 'react';
import { chat } from '@/styles/chat';

export default function ChatInput({ 
  message, 
  setMessage, 
  onSendMessage, 
  onAttachment,
  onTyping, 
  disabled = false,
}) {
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handleMessageChange = useCallback((e) => {
    setMessage(e.target.value);
    
    if (onTyping && e.target.value.length > 0) {
      // 타이핑 이벤트를 디바운스: 1초마다 최대 1번 전송
      if (!typingTimeoutRef.current) {
        console.log('💬 타이핑 이벤트 전송 중...');
        onTyping();
        
        // 1초 후 다시 전송 가능하도록 설정
        typingTimeoutRef.current = setTimeout(() => {
          typingTimeoutRef.current = null;
        }, 1000);
      }
    }
  }, [setMessage, onTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;
    onSendMessage(message);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={chat.input.container}>
      <form onSubmit={handleSubmit} className={chat.input.wrapper}>
        <div className={chat.input.text.container}>
          <textarea
            ref={inputRef}
            value={message}
            onChange={handleMessageChange}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요..."
            rows={1}
            disabled={disabled}
            className={chat.input.text.field}
            style={{
              minHeight: '44px',
              maxHeight: '120px',
              fontSize: '16px', // iOS Safari 확대 방지
              lineHeight: '1.5',
              resize: 'none'
            }}
          />
          {onAttachment && (
            <button
              type="button"
              onClick={onAttachment}
              className={chat.input.attach.button}
              aria-label="파일 첨부"
            >
              <svg className={chat.input.attach.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
          )}
        </div>
        
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className={`${chat.input.send.button} ${(!message.trim() || disabled) ? chat.input.send.buttonDisabled : ''}`}
          aria-label="메시지 전송"
        >
          <svg className={chat.input.send.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
}