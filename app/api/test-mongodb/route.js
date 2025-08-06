import { NextResponse } from 'next/server';
import { getDatabase, getChatCollection, initializeMongoDB } from '@/utils/mongodb';

export async function GET(req) {
  try {
    console.log('Testing MongoDB connection...');
    
    // Test database connection
    const db = await getDatabase();
    console.log('Database connection successful');
    
    // Test getting collection
    const testIdentity = 'test_identity';
    await initializeMongoDB(testIdentity);
    const collection = await getChatCollection(testIdentity);
    console.log('Collection retrieved successfully');
    
    // Test finding documents
    const count = await collection.countDocuments();
    console.log(`Document count: ${count}`);
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      details: {
        database: 'edutalk',
        collection: `chat_${testIdentity}`,
        documentCount: count,
        mongoUri: process.env.MONGODB_URI ? 'Set' : 'Not set',
        useMock: process.env.USE_MOCK_MONGODB === 'true'
      }
    });
  } catch (error) {
    console.error('MongoDB test failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      mongoUri: process.env.MONGODB_URI ? 'Set' : 'Not set',
      useMock: process.env.USE_MOCK_MONGODB === 'true'
    }, { status: 500 });
  }
}