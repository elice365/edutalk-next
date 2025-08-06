// MongoDB 연결 테스트 스크립트
const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://admin:koreait2025!!@svc.sel5.cloudtype.app:31222/';

async function testConnection() {
  console.log('Testing MongoDB connection...');
  console.log('URI:', MONGODB_URI);
  
  const client = new MongoClient(MONGODB_URI, {
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 30000,
    connectTimeoutMS: 10000,
    retryWrites: false,
    retryReads: false,
    authSource: 'admin',
    tls: false,  // TLS 비활성화
    directConnection: true,
  });

  try {
    await client.connect();
    console.log('✅ Connected successfully to MongoDB');
    
    const db = client.db('edutalk');
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    // 테스트 컬렉션에 문서 삽입
    const testCollection = db.collection('chat_test');
    const result = await testCollection.insertOne({
      test: true,
      timestamp: new Date(),
      message: 'Test message'
    });
    console.log('✅ Test document inserted:', result.insertedId);
    
    // 삽입한 문서 조회
    const doc = await testCollection.findOne({ _id: result.insertedId });
    console.log('✅ Retrieved document:', doc);
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      codeName: error.codeName
    });
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

testConnection();