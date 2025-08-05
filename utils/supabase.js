import { createClient } from '@supabase/supabase-js';
import { 
  ChatError, 
  withSupabase, 
  withRetry, 
  logError 
} from './errorHandler.js';

/**
 * Supabase Realtime Integration for EduTalk Chat
 * 
 * Provides real-time message broadcasting and reception
 * Used for instant message delivery across chat participants
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Supabase 환경 변수 확인:', {
  url: supabaseUrl ? '✅ 설정됨' : '❌ 누락',
  key: supabaseKey ? '✅ 설정됨' : '❌ 누락',
  urlValue: supabaseUrl,
  keyPreview: supabaseKey ? `${supabaseKey.substring(0, 20)}...` : null
});

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase configuration missing, realtime features will be disabled');
}

let supabase = null;

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
    console.log('✅ Supabase 클라이언트 초기화 성공');
  } catch (error) {
    console.error('❌ Supabase 클라이언트 초기화 실패:', error);
  }
} else {
  console.error('❌ Supabase 환경 변수가 누락되어 클라이언트를 초기화할 수 없습니다');
}

/**
 * Realtime Chat Manager
 * Handles message broadcasting and reception via Supabase Realtime
 */
export const realtimeChat = {
  /**
   * Broadcast a new message to all participants in a chat room
   * @param {string} chatRoomId - Chat room identifier
   * @param {Object} message - Message data to broadcast
   */
  async broadcastMessage(chatRoomId, message) {
    console.log('📡 메시지 브로드캐스트 시도:', { chatRoomId, messageId: message?.uid });
    
    // Validate input parameters
    if (!chatRoomId) {
      const error = new ChatError(
        'Chat room ID is required for broadcasting',
        'VALIDATION_ERROR',
        400,
        { chatRoomId }
      );
      console.error('❌ 브로드캐스트 실패 - 채팅방 ID 누락:', error);
      throw error;
    }

    if (!message || !message.uid) {
      const error = new ChatError(
        'Message with UID is required for broadcasting',
        'VALIDATION_ERROR',
        400,
        { message }
      );
      console.error('❌ 브로드캐스트 실패 - 메시지 UID 누락:', error);
      throw error;
    }

    if (!supabase) {
      console.warn('⚠️ Supabase 클라이언트가 없습니다. Mock 브로드캐스트:', chatRoomId, message.uid);
      return { success: true, mock: true };
    }

    return await withSupabase(async () => {
      return await withRetry(async () => {
        const channelName = `chat_${chatRoomId}`;
        console.log('📡 브로드캐스트 채널 생성:', channelName);
        
        const channel = supabase.channel(channelName);
        
        const payload = {
          ...message,
          chatRoomId,
          timestamp: message.timestamp || new Date().toISOString(),
        };
        
        console.log('📤 브로드캐스트 전송 중:', payload);
        
        const result = await channel.send({
          type: 'broadcast',
          event: 'new_message',
          payload,
        });

        console.log('📤 브로드캐스트 결과:', result);
        console.log(`✅ 메시지 브로드캐스트 완료 - 채팅방: ${chatRoomId}, 메시지: ${message.uid}`);
        
        return { success: true, messageId: message.uid, result };
      }, 2, 500); // Retry up to 2 times with 500ms base delay
    }, { success: false, error: 'Realtime service unavailable' }); // Fallback for graceful degradation
  },

  /**
   * Broadcast message deletion to all participants
   * @param {string} chatRoomId - Chat room identifier
   * @param {string} messageId - Message ID that was deleted
   */
  async broadcastMessageDeletion(chatRoomId, messageId) {
    if (!supabase) {
      console.log('Mock: Broadcasting message deletion to chat room:', chatRoomId, messageId);
      return;
    }

    try {
      const channel = supabase.channel(`chat_${chatRoomId}`);
      
      await channel.send({
        type: 'broadcast',
        event: 'message_deleted',
        payload: {
          messageId,
          chatRoomId,
          timestamp: new Date().toISOString(),
        },
      });

      console.log(`Message deletion broadcasted to chat room ${chatRoomId}:`, messageId);
    } catch (error) {
      console.error('Failed to broadcast message deletion:', error);
      throw error;
    }
  },

  /**
   * Broadcast typing indicator
   * @param {string} chatRoomId - Chat room identifier
   * @param {Object} typingData - Typing user data
   */
  async broadcastTyping(chatRoomId, typingData) {
    console.log('⌨️ 타이핑 브로드캐스트 시도:', { chatRoomId, typingData });
    
    if (!supabase) {
      console.log('Mock: Broadcasting typing to chat room:', chatRoomId, typingData);
      return;
    }

    return await withSupabase(async () => {
      return await withRetry(async () => {
        // 구독하는 채널과 동일한 이름 사용 - 중요!
        const channelName = `chat_${chatRoomId}`;
        console.log('⌨️ 타이핑 브로드캐스트 채널:', channelName);
        
        // 동일한 채널 이름으로 채널 생성 (메시지와 동일한 방식)
        const channel = supabase.channel(channelName);
        
        const payload = {
          ...typingData,
          chatRoomId,
          timestamp: new Date().toISOString(),
        };
        
        console.log('⌨️ 타이핑 브로드캐스트 전송:', payload);
        
        // 메시지와 동일하게 전송
        const result = await channel.send({
          type: 'broadcast',
          event: 'user_typing',
          payload,
        });

        console.log('⌨️ 타이핑 브로드캐스트 결과:', result);
        console.log(`✅ 타이핑 브로드캐스트 완료 - 채팅방: ${chatRoomId}`);
        
        return { success: true, result };
      }, 2, 500);
    }, { success: false, error: 'Realtime service unavailable' });
  },

  /**
   * Subscribe to chat room events
   * @param {string} chatRoomId - Chat room identifier
   * @param {Object} callbacks - Event callback functions
   * @returns {Object} Subscription object with unsubscribe method
   */
  subscribeToChatRoom(chatRoomId, callbacks = {}) {
    console.log('🔔 채팅방 구독 시도:', chatRoomId);
    
    if (!supabase) {
      console.warn('⚠️ Supabase 클라이언트가 없습니다. Mock 모드로 실행됩니다.');
      return {
        unsubscribe: () => console.log('Mock: Unsubscribed from chat room:', chatRoomId)
      };
    }

    const {
      onMessage = () => {},
      onMessageDeleted = () => {},
      onTyping = () => {},
      onError = () => {}
    } = callbacks;

    try {
      const channelName = `chat_${chatRoomId}`;
      console.log('📡 채널 생성 중:', channelName);
      
      const channel = supabase.channel(channelName)
        .on('broadcast', { event: 'new_message' }, (payload) => {
          console.log('📨 새 메시지 수신:', payload);
          onMessage(payload.payload);
        })
        .on('broadcast', { event: 'message_deleted' }, (payload) => {
          console.log('🗑️ 메시지 삭제 수신:', payload);
          onMessageDeleted(payload.payload);
        })
        .on('broadcast', { event: 'user_typing' }, (payload) => {
          console.log('⌨️ 타이핑 이벤트 수신:', payload);
          onTyping(payload.payload);
        })
        .subscribe((status) => {
          console.log('🔄 구독 상태 변경:', status, 'for channel:', channelName);
          if (status === 'SUBSCRIBED') {
            console.log(`✅ 채팅방 구독 성공: ${chatRoomId}`);
          } else if (status === 'CHANNEL_ERROR') {
            console.error(`❌ 채팅방 구독 실패: ${chatRoomId}`);
            onError(new Error('Channel subscription failed'));
          } else if (status === 'TIMED_OUT') {
            console.error(`⏰ 채팅방 구독 타임아웃: ${chatRoomId}`);
            onError(new Error('Channel subscription timed out'));
          } else if (status === 'CLOSED') {
            console.log(`🔒 채팅방 연결 종료: ${chatRoomId}`);
          }
        });

      return {
        unsubscribe: async () => {
          console.log('🔌 채팅방 구독 해제 중:', chatRoomId);
          await supabase.removeChannel(channel);
          console.log(`✅ 채팅방 구독 해제 완료: ${chatRoomId}`);
        }
      };
    } catch (error) {
      console.error('❌ 채팅방 구독 중 오류 발생:', error);
      onError(error);
      return {
        unsubscribe: () => {}
      };
    }
  },

  /**
   * Get Supabase client instance
   * @returns {Object|null} Supabase client or null if not configured
   */
  getClient() {
    return supabase;
  },

  /**
   * Check if realtime is available
   * @returns {boolean} True if realtime is configured and available
   */
  isAvailable() {
    return !!supabase;
  }
};

/**
 * Initialize Supabase Realtime connection
 * Should be called once when the application starts
 */
export async function initializeRealtime() {
  if (!supabase) {
    console.log('Supabase not configured, skipping realtime initialization');
    return false;
  }

  try {
    // Test connection
    const { error } = await supabase.from('test').select('*').limit(1);
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = table not found (expected)
      throw error;
    }

    console.log('Supabase realtime initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize Supabase realtime:', error);
    return false;
  }
}

export default supabase;