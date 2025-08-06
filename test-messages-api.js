// API를 통한 메시지 조회 테스트
const fetch = require('node-fetch');

const TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudHkiOiJhc2Rma3F3bGUiLCJ0eXBlIjoic3R1ZGVudCIsInN1YiI6InN0dWRlbnQtaWQiLCJuYW1lIjoicXdlciIsImV4cCI6MTc1NDUyNDM0MSwiaWF0IjoxNzU0NDM3OTQxfQ.CcPEeMnSHMKon4zNKocd3UyII3A88UWytyp6e2Swj5zbr_WGJcRN6JcPo34fkko--j-GFRAZ_2V65XSoGICK27nNpEcoOhB5CZEJVy1_XiCL7UvRskeLT5CLbzHAwRfeGSICYmCZDhybwLjDvTCk4MHvLjVn-RNCl9bVlSCfDwUgeoopKH0vH9_BG7Kez65-cODym2E6G9KJWqeJH4zhX_OhkoQr4UCWP05V2RmrKRapdY2hlnv6pwI201nWdwKJhEEV3QL9ud8cnzTThxP0Gskd36Wn5EY9GiB2jxAZxjB61XbYM9MFlCQtQr9m2IYMJ8cDXDZQue_PBDUTUFNsdw';
const CHAT_ROOM_ID = 'e657c32a-84a0-491c-8308-545a53d95e73';

async function testMessagesAPI() {
  try {
    const response = await fetch(`http://localhost:3000/api/chat/messages?chatRoomId=${CHAT_ROOM_ID}`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ API 호출 성공');
      console.log('총 메시지 수:', data.messages.length);
      console.log('전체 메시지 수:', data.pagination.totalCount);
      
      if (data.messages.length > 0) {
        console.log('\n최근 5개 메시지:');
        const recentMessages = data.messages.slice(-5);
        recentMessages.forEach(msg => {
          console.log(`  [${msg.sequence}] ${msg.sender}: ${msg.message.substring(0, 30)}...`);
          console.log(`     Time: ${msg.timestamp}`);
        });
      }
    } else {
      console.log('❌ API 호출 실패:', data.error);
    }
  } catch (error) {
    console.error('❌ 에러:', error);
  }
}

testMessagesAPI();