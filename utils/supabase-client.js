import { createClient } from '@supabase/supabase-js';

/**
 * Client-only Supabase utilities
 * This file contains only client-safe Supabase operations
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase configuration missing, realtime features will be disabled');
}

let supabase = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey, {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });
}

/**
 * Simple client error class for Supabase operations
 */
export class RealtimeError extends Error {
  constructor(message, code = 'REALTIME_ERROR') {
    super(message);
    this.name = 'RealtimeError';
    this.code = code;
  }
}

/**
 * Realtime Chat Manager - Client-only version
 */
export const realtimeChat = {
  /**
   * Broadcast a new message to all participants in a chat room
   */
  async broadcastMessage(chatRoomId, message) {
    if (!chatRoomId) {
      throw new RealtimeError('Chat room ID is required for broadcasting');
    }

    if (!message || !message.uid) {
      throw new RealtimeError('Message with UID is required for broadcasting');
    }

    if (!supabase) {
      console.log('Mock: Broadcasting message to chat room:', chatRoomId, message.uid);
      return { success: true, mock: true };
    }

    try {
      const channel = supabase.channel(`chat_${chatRoomId}`);
      
      const payload = {
        ...message,
        chatRoomId,
        timestamp: message.timestamp || new Date().toISOString(),
      };
      
      await channel.send({
        type: 'broadcast',
        event: 'new_message',
        payload,
      });

      console.log(`Message broadcasted to chat room ${chatRoomId}:`, message.uid);
      return { success: true, messageId: message.uid };
    } catch (error) {
      console.error('Failed to broadcast message:', error);
      return { success: false, error: 'Realtime service unavailable' };
    }
  },

  /**
   * Broadcast message deletion to all participants
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
    }
  },

  /**
   * Broadcast typing indicator
   */
  async broadcastTyping(chatRoomId, typingData) {
    if (!supabase) {
      console.log('Mock: Broadcasting typing to chat room:', chatRoomId, typingData);
      return;
    }

    try {
      const channel = supabase.channel(`chat_${chatRoomId}`);
      
      await channel.send({
        type: 'broadcast',
        event: 'user_typing',
        payload: {
          ...typingData,
          chatRoomId,
          timestamp: new Date().toISOString(),
        },
      });

      console.log(`Typing indicator broadcasted to chat room ${chatRoomId}`);
    } catch (error) {
      console.error('Failed to broadcast typing indicator:', error);
    }
  },

  /**
   * Subscribe to chat room events
   */
  subscribeToChatRoom(chatRoomId, callbacks = {}) {
    if (!supabase) {
      console.log('Mock: Subscribing to chat room:', chatRoomId);
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
      const channel = supabase.channel(`chat_${chatRoomId}`)
        .on('broadcast', { event: 'new_message' }, (payload) => {
          console.log('Received new message:', payload);
          onMessage(payload.payload);
        })
        .on('broadcast', { event: 'message_deleted' }, (payload) => {
          console.log('Received message deletion:', payload);
          onMessageDeleted(payload.payload);
        })
        .on('broadcast', { event: 'user_typing' }, (payload) => {
          console.log('Received typing indicator:', payload);
          onTyping(payload.payload);
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log(`Successfully subscribed to chat room: ${chatRoomId}`);
          } else if (status === 'CHANNEL_ERROR') {
            console.error(`Failed to subscribe to chat room: ${chatRoomId}`);
            onError(new RealtimeError('Channel subscription failed'));
          }
        });

      return {
        unsubscribe: async () => {
          await supabase.removeChannel(channel);
          console.log(`Unsubscribed from chat room: ${chatRoomId}`);
        }
      };
    } catch (error) {
      console.error('Failed to subscribe to chat room:', error);
      onError(error);
      return {
        unsubscribe: () => {}
      };
    }
  },

  /**
   * Get Supabase client instance
   */
  getClient() {
    return supabase;
  },

  /**
   * Check if realtime is available
   */
  isAvailable() {
    return !!supabase;
  }
};

/**
 * Initialize Supabase Realtime connection
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