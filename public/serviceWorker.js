  // public/serviceWorker.js
  console.log('EduTalk Service Worker loaded');

  // 기본 Service Worker 설치
  self.addEventListener('install', () => {
    console.log('Service Worker installed');
    self.skipWaiting();
  });

  // Service Worker 활성화
  self.addEventListener('activate', () => {
    console.log('Service Worker activated');
  });

  // 네트워크 요청 처리 (기본적으로 패스스루)
  self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request));
  });
