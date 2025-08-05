(function() {
  'use strict';

  // 이미 로드된 경우 중복 실행 방지
  if (window.EduTalkWidget) return;

  // 위젯 설정
  const WIDGET_CONFIG = {
    chatUrl: 'http://localhost:5743/chats?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudHkiOiJhc2Rma3F3bGUiLCJ0eXBlIjoidGVhY2hlciIsInN1YiI6InN0dWRlbnQtaWQiLCJuYW1lIjoiMTIzNCIsImV4cCI6MjYxODQzMjg1MCwiaWF0IjoxNzU0NDMyODUwfQ.O7Zpc8tLqXy-2OA5pyC5944jSuNXlttmScYJZzAVLtwR4yk8sbc00koQI3r1Hn8q1n1V2jEe0Z9uzxZAvmJbkHbceaWDLE4-5EyGNnba5QkiIRFJnrXeMK0Nks4wHxbIbNVfte6e2nqcc-Lmoig_R-Ilmb7ewTSwniT1I39EVaDfxUUV_EYwhgoL8pVGUAiFqh5bqqd18G3Bd3g90OIHQOqfFgMyVPW1VGj40CKtCO2FIQIcJ8zTIfxB1T_8B2NVl61j2Q2sMvYJXEoVmkl6oAVkshA5qTy19lje4ai5kTT-hg5hZfRfPfgLxHij74ohNhwaFG9jQUXa9kD5ZJHRLw',
    position: 'bottom-right'
  };

  // 위젯 스타일
  const widgetStyles = `
    #edutalk-widget-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    }
    
    #edutalk-widget-button {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #007bff;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }
    
    #edutalk-widget-button:hover {
      background: #0056b3;
      transform: scale(1.1);
    }
    
    #edutalk-widget-button svg {
      width: 24px;
      height: 24px;
      fill: white;
    }
    
    #edutalk-widget-iframe {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 400px;
      height: 600px;
      border: none;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
      background: white;
      display: none;
      z-index: 9998;
    }
    
    @media (max-width: 480px) {
      #edutalk-widget-iframe {
        width: calc(100vw - 40px);
        height: calc(100vh - 120px);
        bottom: 90px;
        right: 20px;
      }
    }
  `;

  // 스타일 주입
  function injectStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = widgetStyles;
    document.head.appendChild(styleElement);
  }

  // 위젯 HTML 생성
  function createWidget() {
    const container = document.createElement('div');
    container.id = 'edutalk-widget-container';
    
    container.innerHTML = `
      <button id="edutalk-widget-button" title="채팅 시작">
        <svg viewBox="0 0 24 24">
          <path d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4C22,2.89 21.1,2 20,2M6,9H18V11H6V9M14,14H6V12H14V14M18,8H6V6H18V8Z"/>
        </svg>
      </button>
      <iframe id="edutalk-widget-iframe" src="${WIDGET_CONFIG.chatUrl}" title="EduTalk 채팅"></iframe>
    `;
    
    document.body.appendChild(container);
    return container;
  }

  // 이벤트 리스너 등록
  function attachEventListeners() {
    const button = document.getElementById('edutalk-widget-button');
    const iframe = document.getElementById('edutalk-widget-iframe');
    
    let isOpen = false;
    
    button.addEventListener('click', function() {
      if (isOpen) {
        iframe.style.display = 'none';
        button.innerHTML = `
          <svg viewBox="0 0 24 24">
            <path d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4C22,2.89 21.1,2 20,2M6,9H18V11H6V9M14,14H6V12H14V14M18,8H6V6H18V8Z"/>
          </svg>
        `;
        isOpen = false;
      } else {
        iframe.style.display = 'block';
        button.innerHTML = `
          <svg viewBox="0 0 24 24">
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
          </svg>
        `;
        isOpen = true;
      }
    });
    
    // ESC 키로 닫기
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && isOpen) {
        button.click();
      }
    });
  }

  // 위젯 초기화
  function initWidget() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        injectStyles();
        createWidget();
        attachEventListeners();
      });
    } else {
      injectStyles();
      createWidget();
      attachEventListeners();
    }
  }

  // 전역 객체 생성
  window.EduTalkWidget = {
    init: initWidget,
    open: function() {
      const button = document.getElementById('edutalk-widget-button');
      const iframe = document.getElementById('edutalk-widget-iframe');
      if (button && iframe && iframe.style.display === 'none') {
        button.click();
      }
    },
    close: function() {
      const button = document.getElementById('edutalk-widget-button');
      const iframe = document.getElementById('edutalk-widget-iframe');
      if (button && iframe && iframe.style.display !== 'none') {
        button.click();
      }
    }
  };

  // 자동 초기화
  initWidget();
})();