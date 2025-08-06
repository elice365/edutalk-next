// MongoDB 메시지 확인 스크립트
const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://admin:koreait2025!!@svc.sel5.cloudtype.app:31222/';
const CHAT_ROOM_ID = 'e657c32a-84a0-491c-8308-545a53d95e73';
const IDENTITY = 'asdfkqwle';

async function checkMessages() {
  console.log('Checking messages for chat room:', CHAT_ROOM_ID);
  console.log('Identity:', IDENTITY);
  
  const client = new MongoClient(MONGODB_URI, {
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 30000,
    connectTimeoutMS: 10000,
    retryWrites: false,
    retryReads: false,
    authSource: 'admin',
    tls: false,
    directConnection: true,
  });

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('edutalk');
    const collection = db.collection(`chat_${IDENTITY}`);
    
    // 채팅방 문서 찾기
    const chatRoom = await collection.findOne({ _id: CHAT_ROOM_ID });
    
    if (!chatRoom) {
      console.log('❌ Chat room not found');
      return;
    }
    
    console.log('✅ Chat room found');
    console.log('Participants:', chatRoom.participants);
    console.log('Total messages:', chatRoom.messages?.length || 0);
    console.log('Last message:', chatRoom.lastMessage);
    
    // 최근 5개 메시지 표시
    if (chatRoom.messages && chatRoom.messages.length > 0) {
      const recentMessages = chatRoom.messages.slice(-5);
      console.log('\n📨 Recent 5 messages:');
      recentMessages.forEach(msg => {
        console.log(`  [${msg.sequence}] ${msg.senderName}: ${msg.message.substring(0, 50)}...`);
        console.log(`     Time: ${msg.createdAt}, UID: ${msg.uid}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

checkMessages();