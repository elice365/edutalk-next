import { MongoClient } from 'mongodb';
import { 
  ChatError, 
  withMongoDB, 
  withRetry, 
  validateChatParams, 
  logError 
} from './errorHandler.js';

/**
 * MongoDB Connection Manager for EduTalk Chat Messages
 * 
 * Database Structure:
 * - Database: edutalk
 * - Collections: chat_{identity} (one collection per organization/identity)
 * - Document Structure (one document per chat room):
 *   {
 *     _id: "chat-room-uid",
 *     identity: "organization-identity",
 *     chatRoomId: "chat-room-uid",
 *     participants: {
 *       instructorId: "instructor-id",
 *       instructorName: "instructor-name",
 *       studentId: "student-id", 
 *       studentName: "student-name"
 *     },
 *     messages: [
 *       {
 *         sequence: number,
 *         uid: "message-uid",
 *         type: "text" | "file" | "system",
 *         senderId: "user-id",
 *         senderName: "display-name",
 *         message: "content",
 *         read: boolean,
 *         createdAt: Date,
 *         deleted: boolean,
 *         updatedAt: Date,
 *         metadata: { fileType?, fileSize?, fileName? }
 *       }
 *     ],
 *     createdAt: Date,
 *     updatedAt: Date,
 *     lastMessage: {
 *       sequence: number,
 *       content: "last-message-content",
 *       senderId: "sender-id",
 *       timestamp: Date
 *     }
 *   }
 */

let client;
let clientPromise;

// MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_FALLBACK_URI;
const USE_MOCK = process.env.USE_MOCK_MONGODB === 'true';

if (!MONGODB_URI && !USE_MOCK) {
  console.warn('MongoDB URI not found, using mock mode');
}

if (!USE_MOCK && MONGODB_URI) {
  // Serverless-compatible MongoDB configuration (Vercel deployment ready)
  const mongoOptions = {
    maxPoolSize: 5, // 연결 풀 크기 감소
    serverSelectionTimeoutMS: 10000, // 타임아웃 증가
    socketTimeoutMS: 30000, // 소켓 타임아웃 감소
    connectTimeoutMS: 10000, // 연결 타임아웃 설정
    // Wire version 호환성을 위한 설정
    retryWrites: false, // 재시도 비활성화
    retryReads: false,
    // Disable client-side encryption for serverless compatibility
    monitorCommands: false,
    // Optimize for serverless environments
    maxIdleTimeMS: 20000, // 유휴 시간 감소
    // Disable compression for better performance in serverless
    compressors: [],
    // Disable auto encryption (not supported in serverless)
    autoEncryption: undefined,
    // 추가 호환성 설정
    directConnection: true, // 직접 연결 사용
    heartbeatFrequencyMS: 30000, // 하트비트 빈도 조정
  };

  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable to preserve the connection across module reloads
    if (!global._mongoClientPromise) {
      client = new MongoClient(MONGODB_URI, mongoOptions);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode (Vercel), create new connection
    client = new MongoClient(MONGODB_URI, mongoOptions);
    clientPromise = client.connect();
  }
}

/**
 * Get MongoDB database instance
 * @returns {Promise<Db>} MongoDB database instance
 */
export async function getDatabase() {
  if (USE_MOCK) {
    // Return mock database for development
    return {
      collection: (name) => ({
        findOne: async () => null,
        find: () => ({ toArray: async () => [] }),
        insertOne: async () => ({ insertedId: 'mock-id' }),
        updateOne: async () => ({ modifiedCount: 1 }),
        deleteOne: async () => ({ deletedCount: 1 }),
        createIndex: async () => true
      })
    };
  }

  try {
    const client = await clientPromise;
    return client.db('edutalk');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw new Error('Database connection failed');
  }
}

/**
 * Get chat collection for specific identity
 * @param {string} identity - Organization/identity identifier
 * @returns {Promise<Collection>} MongoDB collection for chat rooms
 */
export async function getChatCollection(identity) {
  const db = await getDatabase();
  const collectionName = `chat_${identity}`;
  return db.collection(collectionName);
}

/**
 * Initialize MongoDB collections and indexes for specific identity
 * @param {string} identity - Organization/identity identifier
 */
export async function initializeMongoDB(identity) {
  if (USE_MOCK) {
    console.log(`Mock MongoDB initialized for identity: ${identity}`);
    return true;
  }

  try {
    const collection = await getChatCollection(identity);
    
    // Create indexes for optimal query performance
    await collection.createIndex({ chatRoomId: 1 });
    await collection.createIndex({ identity: 1 });
    await collection.createIndex({ 'participants.instructorId': 1 });
    await collection.createIndex({ 'participants.studentId': 1 });
    await collection.createIndex({ 'lastMessage.timestamp': -1 });
    await collection.createIndex({ 'messages.uid': 1 });
    await collection.createIndex({ updatedAt: -1 });
    
    console.log(`MongoDB initialized for identity: ${identity}`);
    return true;
  } catch (error) {
    console.error(`Failed to initialize MongoDB for identity ${identity}:`, error);
    throw error;
  }
}

/**
 * Store a new message in MongoDB
 * @param {Object} messageData - Message data to store
 * @param {string} identity - Organization/identity identifier
 * @returns {Promise<Object>} Stored message data
 */
export async function storeMessage(messageData, identity) {
  // Validate input parameters
  try {
    validateChatParams({
      chatRoomId: messageData.chatRoomId,
      userId: messageData.senderId,
      message: messageData.message
    });
  } catch (error) {
    logError('VALIDATION_ERROR', error, { messageData, identity });
    throw error;
  }

  if (USE_MOCK) {
    console.log(`Mock: Storing message in identity ${identity}:`, messageData);
    return {
      ...messageData,
      sequence: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  return await withMongoDB(async () => {
    return await withRetry(async () => {
      const collection = await getChatCollection(identity);
      const chatRoomId = messageData.chatRoomId;
      
      // Find the chat room document
      const chatRoom = await collection.findOne({ _id: chatRoomId });
      
      if (!chatRoom) {
        throw new ChatError(
          `Chat room not found`,
          'CHAT_ROOM_NOT_FOUND',
          404,
          { chatRoomId, identity }
        );
      }
      
      // Get next sequence number for this chat room
      const nextSequence = (chatRoom.messages?.length || 0) + 1;
      
      const newMessage = {
        sequence: nextSequence,
        uid: messageData.uid,
        type: messageData.type || 'text',
        senderId: messageData.senderId,
        senderName: messageData.senderName,
        message: messageData.message,
        read: messageData.read || false,
        createdAt: new Date(),
        deleted: false,
        updatedAt: new Date(),
        metadata: messageData.metadata || {}
      };
      
      // Update chat room document with new message and last message info
      const updateResult = await collection.updateOne(
        { _id: chatRoomId },
        {
          $push: { messages: newMessage },
          $set: {
            updatedAt: new Date(),
            lastMessage: {
              sequence: nextSequence,
              content: messageData.message,
              senderId: messageData.senderId,
              timestamp: new Date()
            }
          }
        }
      );
      
      if (updateResult.modifiedCount === 0) {
        throw new ChatError(
          'Failed to store message',
          'MESSAGE_STORE_FAILED',
          500,
          { chatRoomId, messageUID: messageData.uid }
        );
      }
      
      console.log(`Message stored successfully: ${messageData.uid} in chat ${chatRoomId}`);
      return newMessage;
      
    }, 3, 1000); // Retry up to 3 times with 1s base delay
  }, []); // No fallback for message storage - critical operation
}

/**
 * Get messages for a chat room
 * @param {string} chatRoomId - Chat room UID
 * @param {string} identity - Organization/identity identifier
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Object with messages array and metadata
 */
export async function getChatMessages(chatRoomId, identity, options = {}) {
  // Validate input parameters
  if (!chatRoomId || !identity) {
    throw new ChatError(
      'Chat room ID and identity are required',
      'VALIDATION_ERROR',
      400,
      { chatRoomId, identity }
    );
  }

  if (USE_MOCK) {
    console.log(`Mock: Getting messages for chatRoomId ${chatRoomId} in identity ${identity}`);
    return {
      messages: [],
      totalCount: 0,
      hasMore: false,
      chatRoom: null
    };
  }

  return await withMongoDB(async () => {
    const collection = await getChatCollection(identity);
    
    const {
      limit = 50,
      skip = 0,
      includeDeleted = false
    } = options;
    
    // Validate pagination parameters
    if (limit < 1 || limit > 100) {
      throw new ChatError(
        'Limit must be between 1 and 100',
        'VALIDATION_ERROR',
        400,
        { limit }
      );
    }
    
    if (skip < 0) {
      throw new ChatError(
        'Skip must be non-negative',
        'VALIDATION_ERROR',
        400,
        { skip }
      );
    }
    
    // Find the chat room document
    const chatRoom = await collection.findOne({ _id: chatRoomId });
    
    if (!chatRoom) {
      console.warn(`Chat room not found: ${chatRoomId} in identity ${identity}`);
      return {
        messages: [],
        totalCount: 0,
        hasMore: false,
        chatRoom: null
      };
    }
    
    // Filter and paginate messages
    let messages = chatRoom.messages || [];
    
    if (!includeDeleted) {
      messages = messages.filter(msg => !msg.deleted);
    }
    
    // Sort by createdAt ascending (oldest first)
    messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    
    const totalCount = messages.length;
    const paginatedMessages = messages.slice(skip, skip + limit);
    
    // Format dates for consistency
    const formattedMessages = paginatedMessages.map(msg => ({
      ...msg,
      createdAt: msg.createdAt.toISOString(),
      updatedAt: msg.updatedAt.toISOString()
    }));
    
    console.log(`Retrieved ${formattedMessages.length} messages for chat room ${chatRoomId}`);
    
    return {
      messages: formattedMessages,
      totalCount,
      hasMore: (skip + paginatedMessages.length) < totalCount,
      chatRoom: {
        _id: chatRoom._id,
        identity: chatRoom.identity,
        participants: chatRoom.participants,
        lastMessage: chatRoom.lastMessage,
        createdAt: chatRoom.createdAt?.toISOString(),
        updatedAt: chatRoom.updatedAt?.toISOString()
      }
    };
  }, {
    messages: [],
    totalCount: 0,
    hasMore: false,
    chatRoom: null
  }); // Fallback value for graceful degradation
}

/**
 * Create or get chat room document
 * @param {string} chatRoomId - Chat room UID (from PostgreSQL)
 * @param {string} identity - Organization/identity identifier
 * @param {Object} participants - Chat participants info
 * @returns {Promise<Object>} Chat room document
 */
export async function createChatRoom(chatRoomId, identity, participants) {
  if (USE_MOCK) {
    console.log(`Mock: Creating chat room ${chatRoomId} in identity ${identity}:`, participants);
    return {
      _id: chatRoomId,
      identity,
      participants,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  try {
    const collection = await getChatCollection(identity);
    
    // Check if chat room already exists
    const existingRoom = await collection.findOne({ _id: chatRoomId });
    
    if (existingRoom) {
      return existingRoom;
    }
    
    // Create new chat room document
    const chatRoomDoc = {
      _id: chatRoomId,
      identity,
      chatRoomId,
      participants: {
        instructorId: participants.instructorId,
        instructorName: participants.instructorName,
        studentId: participants.studentId,
        studentName: participants.studentName
      },
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      lastMessage: null
    };
    
    await collection.insertOne(chatRoomDoc);
    
    console.log(`Created chat room ${chatRoomId} in MongoDB for identity ${identity}`);
    return chatRoomDoc;
  } catch (error) {
    console.error('Failed to create chat room:', error);
    throw error;
  }
}

/**
 * Mark message as deleted (soft delete)
 * @param {string} messageUid - Message UID
 * @param {string} identity - Organization/identity identifier
 * @returns {Promise<boolean>} Success status
 */
export async function deleteMessage(messageUid, identity) {
  if (USE_MOCK) {
    console.log(`Mock: Deleting message ${messageUid} in identity ${identity}`);
    return true;
  }

  try {
    const collection = await getChatCollection(identity);
    
    // Update the specific message in the messages array
    const result = await collection.updateOne(
      { 'messages.uid': messageUid },
      { 
        $set: { 
          'messages.$.deleted': true,
          'messages.$.updatedAt': new Date(),
          updatedAt: new Date()
        } 
      }
    );
    
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Failed to delete message:', error);
    throw error;
  }
}

/**
 * Mark messages as read
 * @param {string} chatRoomId - Chat room UID
 * @param {string} identity - Organization/identity identifier
 * @param {string} userId - User ID marking as read
 * @returns {Promise<number>} Number of messages marked as read
 */
export async function markMessagesAsRead(chatRoomId, identity, userId) {
  if (USE_MOCK) {
    console.log(`Mock: Marking messages as read in chatRoom ${chatRoomId} for user ${userId}`);
    return 0;
  }

  try {
    const collection = await getChatCollection(identity);
    
    // Get the chat room first
    const chatRoom = await collection.findOne({ _id: chatRoomId });
    
    if (!chatRoom || !chatRoom.messages) {
      return 0;
    }
    
    // Count and update unread messages from other users
    let markedCount = 0;
    const updatedMessages = chatRoom.messages.map(msg => {
      if (msg.senderId !== userId && !msg.read && !msg.deleted) {
        markedCount++;
        return {
          ...msg,
          read: true,
          updatedAt: new Date()
        };
      }
      return msg;
    });
    
    if (markedCount > 0) {
      // Update the entire messages array
      await collection.updateOne(
        { _id: chatRoomId },
        { 
          $set: { 
            messages: updatedMessages,
            updatedAt: new Date()
          } 
        }
      );
    }
    
    return markedCount;
  } catch (error) {
    console.error('Failed to mark messages as read:', error);
    throw error;
  }
}

/**
 * Generate unique message UID
 * @returns {string} Unique message identifier
 */
export function generateMessageUID() {
  // Use timestamp + random string for uniqueness
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `msg_${timestamp}_${random}`;
}

/**
 * Health check for MongoDB connection
 * @returns {Promise<boolean>} Connection status
 */
export async function checkMongoDBHealth() {
  if (USE_MOCK) {
    return true;
  }

  try {
    const db = await getDatabase();
    await db.admin().ping();
    return true;
  } catch (error) {
    console.error('MongoDB health check failed:', error);
    return false;
  }
}

// Close connection on process termination
process.on('SIGINT', async () => {
  if (client) {
    await client.close();
  }
  process.exit(0);
});

export default {
  getDatabase,
  getChatCollection,
  initializeMongoDB,
  createChatRoom,
  storeMessage,
  getChatMessages,
  deleteMessage,
  markMessagesAsRead,
  generateMessageUID,
  checkMongoDBHealth
};