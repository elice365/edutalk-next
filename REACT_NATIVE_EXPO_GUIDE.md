# EduTalk React Native - QR/토큰 채팅 앱

## 1. 프로젝트 설정

```bash
npx create-expo-app edutalk-chat
cd edutalk-chat
npx expo install expo-camera expo-barcode-scanner expo-secure-store @supabase/supabase-js
```

## 2. QR 스캔 컴포넌트

```tsx
// components/QRScanner.tsx
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { View, Text, Button } from 'react-native';

export default function QRScanner({ onScan }: { onScan: (token: string) => void }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View>
        <Text>카메라 권한이 필요합니다</Text>
        <Button onPress={requestPermission} title="권한 허용" />
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    // QR에서 토큰 추출
    const token = data.includes('token=') ? data.split('token=')[1] : data;
    onScan(token);
  };

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      />
      {scanned && <Button title="다시 스캔" onPress={() => setScanned(false)} />}
    </View>
  );
}
```

## 3. 채팅 서비스

```tsx
// services/chatService.ts
import * as SecureStore from 'expo-secure-store';

interface Message {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
  isOwn: boolean;
}

class ChatService {
  private token: string | null = null;

  async setToken(token: string) {
    this.token = token;
    await SecureStore.setItemAsync('chat_token', token);
  }

  async getToken() {
    if (!this.token) {
      this.token = await SecureStore.getItemAsync('chat_token');
    }
    return this.token;
  }

  async getMessages(chatRoomId: string): Promise<Message[]> {
    const token = await this.getToken();
    if (!token) throw new Error('토큰이 없습니다');

    const response = await fetch(`https://edutalk-one.vercel.app/api/chat/messages?chatRoomId=${chatRoomId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('메시지 로드 실패');
    
    const data = await response.json();
    return data.messages.map((msg: any) => ({
      id: msg.uid,
      sender: msg.senderName,
      message: msg.message,
      timestamp: new Date(msg.timestamp),
      isOwn: msg.isOwn || false,
    }));
  }
}

export const chatService = new ChatService();
```

## 4. 실시간 채팅 훅

```tsx
// hooks/useChat.ts
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { chatService } from '../services/chatService';

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
);

export function useChat(chatRoomId: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 메시지 로드
  useEffect(() => {
    if (!chatRoomId) return;
    
    loadMessages();
  }, [chatRoomId]);

  const loadMessages = async () => {
    try {
      const msgs = await chatService.getMessages(chatRoomId);
      setMessages(msgs);
    } catch (error) {
      console.error('메시지 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 실시간 구독
  useEffect(() => {
    if (!chatRoomId) return;

    const channel = supabase
      .channel(`chat_${chatRoomId}`)
      .on('broadcast', { event: 'message' }, (payload) => {
        const newMessage = payload.payload;
        setMessages(prev => [...prev, newMessage]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatRoomId]);

  return { messages, loading, refresh: loadMessages };
}
```

## 5. 메인 채팅 화면

```tsx
// app/(tabs)/chat.tsx
import { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useChat } from '../../hooks/useChat';
import QRScanner from '../../components/QRScanner';
import { chatService } from '../../services/chatService';

export default function ChatScreen() {
  const [token, setToken] = useState<string | null>(null);
  const [chatRoomId, setChatRoomId] = useState('default-room');
  const { messages, loading } = useChat(token ? chatRoomId : '');

  const handleQRScan = async (scannedToken: string) => {
    await chatService.setToken(scannedToken);
    setToken(scannedToken);
  };

  if (!token) {
    return <QRScanner onScan={handleQRScan} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ padding: 16, fontSize: 18, fontWeight: 'bold' }}>
        채팅방
      </Text>
      
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{
            padding: 12,
            margin: 8,
            backgroundColor: item.isOwn ? '#007AFF' : '#f0f0f0',
            borderRadius: 8,
            alignSelf: item.isOwn ? 'flex-end' : 'flex-start',
            maxWidth: '80%',
          }}>
            <Text style={{ color: item.isOwn ? 'white' : 'black' }}>
              {item.message}
            </Text>
          </View>
        )}
        inverted
      />
    </View>
  );
}
```

## 6. 앱 설정

```typescript
// app.config.js
export default {
  expo: {
    name: "EduTalk Chat",
    slug: "edutalk-chat",
    version: "1.0.0",
    platforms: ["ios", "android"],
    plugins: [
      [
        "expo-camera",
        {
          cameraPermission: "QR 코드 스캔을 위해 카메라 권한이 필요합니다."
        }
      ]
    ]
  }
};
```

## 🚀 단계별 구현 가이드

### Step 1: 프로젝트 생성 및 설정

```bash
# 1. 새 Expo 프로젝트 생성
npx create-expo-app edutalk-chat --template blank-typescript
cd edutalk-chat

# 2. 필수 패키지 설치
npx expo install expo-camera expo-barcode-scanner expo-secure-store @supabase/supabase-js

# 3. 개발 서버 시작
npx expo start
```

### Step 2: 프로젝트 구조 생성

터미널에서 다음 명령어로 폴더 구조를 생성하세요:

```bash
mkdir -p components services hooks
touch components/QRScanner.tsx
touch services/chatService.ts  
touch hooks/useChat.ts
```

### Step 3: QR 스캐너 컴포넌트 생성

`components/QRScanner.tsx` 파일에 다음 코드를 복사하세요:

```tsx
// components/QRScanner.tsx
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

interface QRScannerProps {
  onScan: (token: string) => void;
}

export default function QRScanner({ onScan }: QRScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>카메라 로딩 중...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>QR 코드 스캔을 위해 카메라 권한이 필요합니다</Text>
        <Button onPress={requestPermission} title="카메라 권한 허용" />
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    
    // QR 코드에서 토큰 추출
    let token = data;
    if (data.includes('token=')) {
      token = data.split('token=')[1].split('&')[0]; // URL 파라미터에서 토큰만 추출
    }
    
    Alert.alert(
      '토큰 스캔 완료',
      `토큰: ${token.substring(0, 20)}...`,
      [
        { text: '취소', onPress: () => setScanned(false) },
        { text: '확인', onPress: () => onScan(token) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QR 코드를 스캔하세요</Text>
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        />
      </View>
      {scanned && (
        <Button 
          title="다시 스캔하기" 
          onPress={() => setScanned(false)} 
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  cameraContainer: {
    width: 300,
    height: 300,
    overflow: 'hidden',
    borderRadius: 10,
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
});
```

### Step 4: 채팅 서비스 생성

`services/chatService.ts` 파일에 다음 코드를 복사하세요:

```tsx
// services/chatService.ts
import * as SecureStore from 'expo-secure-store';

export interface Message {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
  isOwn: boolean;
  senderName?: string;
  avatar?: string;
}

class ChatService {
  private token: string | null = null;
  private readonly API_BASE_URL = 'https://edutalk-one.vercel.app';

  // 토큰 저장
  async setToken(token: string): Promise<void> {
    try {
      this.token = token;
      await SecureStore.setItemAsync('chat_token', token);
      console.log('토큰 저장 완료');
    } catch (error) {
      console.error('토큰 저장 실패:', error);
      throw error;
    }
  }

  // 토큰 가져오기
  async getToken(): Promise<string | null> {
    try {
      if (!this.token) {
        this.token = await SecureStore.getItemAsync('chat_token');
      }
      return this.token;
    } catch (error) {
      console.error('토큰 가져오기 실패:', error);
      return null;
    }
  }

  // 토큰 삭제
  async clearToken(): Promise<void> {
    try {
      this.token = null;
      await SecureStore.deleteItemAsync('chat_token');
      console.log('토큰 삭제 완료');
    } catch (error) {
      console.error('토큰 삭제 실패:', error);
    }
  }

  // 메시지 가져오기
  async getMessages(chatRoomId: string): Promise<Message[]> {
    const token = await this.getToken();
    if (!token) {
      throw new Error('인증 토큰이 없습니다. QR 코드를 다시 스캔해주세요.');
    }

    try {
      console.log(`메시지 로드 시작: ${chatRoomId}`);
      
      const response = await fetch(
        `${this.API_BASE_URL}/api/chat/messages?chatRoomId=${chatRoomId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          await this.clearToken();
          throw new Error('토큰이 만료되었습니다. QR 코드를 다시 스캔해주세요.');
        }
        throw new Error(`HTTP ${response.status}: 메시지 로드 실패`);
      }

      const data = await response.json();
      
      if (!data.success || !data.messages) {
        throw new Error('메시지 데이터 형식이 올바르지 않습니다.');
      }

      const messages: Message[] = data.messages.map((msg: any) => ({
        id: msg.uid || msg.id || Math.random().toString(),
        sender: msg.senderName || msg.sender || '알 수 없음',
        message: msg.message || '',
        timestamp: new Date(msg.timestamp || msg.createTime || Date.now()),
        isOwn: msg.isOwn || false,
        senderName: msg.senderName,
        avatar: msg.avatar || 'https://via.placeholder.com/40',
      }));

      console.log(`메시지 ${messages.length}개 로드 완료`);
      return messages;

    } catch (error) {
      console.error('메시지 로드 실패:', error);
      throw error;
    }
  }

  // 메시지 전송 (선택사항)
  async sendMessage(chatRoomId: string, message: string): Promise<any> {
    const token = await this.getToken();
    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    try {
      const response = await fetch(`${this.API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'send',
          id: chatRoomId,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error(`메시지 전송 실패: HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      throw error;
    }
  }
}

export const chatService = new ChatService();
```

### Step 5: 실시간 채팅 훅 생성

`hooks/useChat.ts` 파일에 다음 코드를 복사하세요:

```tsx
// hooks/useChat.ts
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { chatService, Message } from '../services/chatService';

// Supabase 설정 (실제 값으로 교체하세요)
const supabase = createClient(
  'YOUR_SUPABASE_URL', // 실제 Supabase URL
  'YOUR_SUPABASE_ANON_KEY' // 실제 Supabase Anon Key
);

export function useChat(chatRoomId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 메시지 로드
  const loadMessages = useCallback(async () => {
    if (!chatRoomId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('메시지 로드 시작...');
      
      const msgs = await chatService.getMessages(chatRoomId);
      setMessages(msgs);
      console.log(`${msgs.length}개 메시지 로드 완료`);
      
    } catch (err: any) {
      console.error('메시지 로드 실패:', err);
      setError(err.message || '메시지를 불러올 수 없습니다.');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [chatRoomId]);

  // 초기 메시지 로드
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // 실시간 구독 설정
  useEffect(() => {
    if (!chatRoomId) return;

    console.log(`실시간 구독 시작: chat_${chatRoomId}`);

    const channel = supabase
      .channel(`chat_${chatRoomId}`)
      .on('broadcast', { event: 'message' }, (payload) => {
        console.log('새 메시지 수신:', payload);
        const newMessage = payload.payload as Message;
        
        // 중복 메시지 방지
        setMessages(prev => {
          const exists = prev.some(msg => msg.id === newMessage.id);
          if (exists) return prev;
          return [...prev, newMessage];
        });
      })
      .on('broadcast', { event: 'typing' }, (payload) => {
        console.log('타이핑 이벤트:', payload);
        // 타이핑 인디케이터 처리 (선택사항)
      })
      .subscribe((status) => {
        console.log('구독 상태:', status);
      });

    return () => {
      console.log('실시간 구독 해제');
      supabase.removeChannel(channel);
    };
  }, [chatRoomId]);

  // 메시지 전송
  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    try {
      await chatService.sendMessage(chatRoomId, message);
      // 메시지 전송 후 새로고침
      setTimeout(() => loadMessages(), 500);
    } catch (err: any) {
      console.error('메시지 전송 실패:', err);
      setError(err.message || '메시지 전송에 실패했습니다.');
    }
  }, [chatRoomId, loadMessages]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    refresh: loadMessages,
  };
}
```

### Step 6: 메인 앱 화면 수정

`App.tsx` 파일을 다음과 같이 수정하세요:

```tsx
// App.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import QRScanner from './components/QRScanner';
import { useChat } from './hooks/useChat';
import { chatService, Message } from './services/chatService';

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [chatRoomId] = useState('default-room'); // 실제로는 동적으로 설정
  const [newMessage, setNewMessage] = useState('');
  
  const { messages, loading, error, sendMessage, refresh } = useChat(
    token ? chatRoomId : ''
  );

  // 앱 시작 시 저장된 토큰 확인
  useEffect(() => {
    checkExistingToken();
  }, []);

  const checkExistingToken = async () => {
    try {
      const existingToken = await chatService.getToken();
      if (existingToken) {
        setToken(existingToken);
      }
    } catch (error) {
      console.log('저장된 토큰 없음');
    }
  };

  const handleQRScan = async (scannedToken: string) => {
    try {
      await chatService.setToken(scannedToken);
      setToken(scannedToken);
      Alert.alert('성공', '토큰이 설정되었습니다!');
    } catch (error) {
      Alert.alert('오류', '토큰 설정에 실패했습니다.');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    const messageText = newMessage;
    setNewMessage('');
    
    try {
      await sendMessage(messageText);
    } catch (error) {
      Alert.alert('오류', '메시지 전송에 실패했습니다.');
      setNewMessage(messageText); // 실패 시 메시지 복원
    }
  };

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃 하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '확인',
          onPress: async () => {
            await chatService.clearToken();
            setToken(null);
          },
        },
      ]
    );
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.isOwn ? styles.ownMessage : styles.otherMessage,
      ]}
    >
      {!item.isOwn && (
        <Text style={styles.senderName}>{item.sender}</Text>
      )}
      <Text
        style={[
          styles.messageText,
          item.isOwn ? styles.ownMessageText : styles.otherMessageText,
        ]}
      >
        {item.message}
      </Text>
      <Text style={styles.timestamp}>
        {item.timestamp.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </View>
  );

  // 토큰이 없으면 QR 스캐너 표시
  if (!token) {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <QRScanner onScan={handleQRScan} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="auto" />
      
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>채팅방</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>
      </View>

      {/* 에러 표시 */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={refresh} style={styles.retryButton}>
            <Text style={styles.retryText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 로딩 */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>메시지 불러오는 중...</Text>
        </View>
      )}

      {/* 메시지 리스트 */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        style={styles.messagesList}
        inverted
        showsVerticalScrollIndicator={false}
      />

      {/* 메시지 입력 */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="메시지를 입력하세요..."
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          onPress={handleSendMessage}
          style={[
            styles.sendButton,
            !newMessage.trim() && styles.sendButtonDisabled,
          ]}
          disabled={!newMessage.trim()}
        >
          <Text style={styles.sendButtonText}>전송</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingTop: 50, // 상태바 공간
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 14,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    margin: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
    flex: 1,
  },
  retryButton: {
    marginLeft: 8,
    padding: 4,
  },
  retryText: {
    color: '#007AFF',
    fontSize: 14,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#666',
  },
  messagesList: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginVertical: 4,
    padding: 12,
    borderRadius: 12,
    maxWidth: '80%',
  },
  ownMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  senderName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
  },
  ownMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#000',
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
```

### Step 7: app.config.js 설정

프로젝트 루트의 `app.config.js` 파일을 다음과 같이 수정하세요:

```javascript
// app.config.js
export default {
  expo: {
    name: "EduTalk Chat",
    slug: "edutalk-chat",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    platforms: ["ios", "android"],
    plugins: [
      [
        "expo-camera",
        {
          cameraPermission: "QR 코드 스캔을 위해 카메라 권한이 필요합니다."
        }
      ]
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    }
  }
};
```

### Step 8: Supabase 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. Settings > API에서 URL과 anon key 복사  
3. `hooks/useChat.ts`에서 다음 부분을 실제 값으로 교체:

```tsx
const supabase = createClient(
  'https://your-project.supabase.co', // 실제 URL
  'your-anon-key' // 실제 anon key
);
```

### Step 9: 테스트 실행

```bash
# 개발 서버 시작
npx expo start

# iOS 시뮬레이터에서 실행
npx expo start --ios

# Android 에뮬레이터에서 실행  
npx expo start --android
```

## ✅ 완료 체크리스트

- [ ] Expo 프로젝트 생성 완료
- [ ] 필수 패키지 설치 완료
- [ ] QRScanner.tsx 컴포넌트 생성
- [ ] chatService.ts 서비스 생성
- [ ] useChat.ts 훅 생성
- [ ] App.tsx 메인 화면 수정
- [ ] app.config.js 설정 완료
- [ ] Supabase 프로젝트 생성 및 설정
- [ ] 카메라 권한 테스트
- [ ] QR 코드 스캔 테스트
- [ ] API 연동 테스트
- [ ] 실시간 메시지 수신 테스트

## 🔧 트러블슈팅

### 자주 발생하는 문제들:

1. **카메라 권한 오류**: 
   - 물리 기기에서 테스트하세요 (시뮬레이터는 카메라 미지원)

2. **API 연결 실패**:
   - 네트워크 연결 확인
   - 토큰 유효성 확인
   - API 서버 상태 확인

3. **Supabase 연결 실패**:
   - URL과 key가 정확한지 확인
   - Supabase 프로젝트가 활성화되어 있는지 확인

4. **빌드 오류**:
   - `npx expo install --fix` 실행
   - `npm cache clean --force` 후 재설치

이제 단계별로 따라하면 QR/토큰 기반 실시간 채팅 앱을 완성할 수 있습니다!