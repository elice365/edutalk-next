# EduTalk React Native Expo 개발 가이드

> Next.js 웹 애플리케이션을 React Native Expo 모바일 앱으로 포팅하기 위한 완전한 개발 가이드

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [현재 시스템 분석](#현재-시스템-분석)
3. [기술 스택 비교](#기술-스택-비교)
4. [프로젝트 초기 설정](#프로젝트-초기-설정)
5. [아키텍처 설계](#아키텍처-설계)
6. [컴포넌트 포팅 가이드](#컴포넌트-포팅-가이드)
7. [상태 관리 및 훅 포팅](#상태-관리-및-훅-포팅)
8. [API 통신 및 인증](#api-통신-및-인증)
9. [실시간 채팅 구현](#실시간-채팅-구현)
10. [네비게이션 구조](#네비게이션-구조)
11. [UI/UX 포팅](#uiux-포팅)
12. [성능 최적화](#성능-최적화)
13. [보안 고려사항](#보안-고려사항)
14. [테스팅 전략](#테스팅-전략)
15. [배포 및 운영](#배포-및-운영)

---

## 프로젝트 개요

### 현재 웹 애플리케이션 기능
- **실시간 1:1 채팅** (강사-학생)
- **JWT 기반 인증 시스템**
- **공지사항 관리**
- **관리자 패널**
- **반응형 웹 디자인**

### 모바일 앱 목표
- **네이티브 성능** 및 사용자 경험
- **푸시 알림** 지원
- **오프라인 기능**
- **크로스 플랫폼** 배포 (iOS/Android)

---

## 현재 시스템 분석

### 데이터베이스 스키마 (Prisma + PostgreSQL)

```prisma
// 사용자/계약자 정보
model Contractor {
  uid            String    @id @default(dbgenerated("gen_random_uuid()"))
  identy         String    @unique
  email          String    @unique
  password       String
  passwordSalt   String
  certified      Boolean   @default(false)
  name           String?
  type           String?
  // ... 기타 필드
}

// 채팅방 정보
model Chat {
  uid            String   @id @default(dbgenerated("gen_random_uuid()"))
  identy         String
  instructorID   String
  instructorName String
  studentID      String
  studentName    String
  lastChat       String?
  createTime     DateTime @default(now())
  updateTime     DateTime @default(now())
  // ... 기타 필드
}

// 공지사항
model Notice {
  uid            String    @id @default(dbgenerated("gen_random_uuid()"))
  title          String
  context        String
  identy         String
  instructor     String
  createTime     DateTime  @default(now())
  updateTime     DateTime  @default(now())
  // ... 기타 필드
}
```

### API 엔드포인트 구조

```
/api/
├── auth/
│   ├── login       - 로그인
│   ├── register    - 회원가입
│   ├── verify      - 이메일 인증
│   └── reset       - 비밀번호 재설정
├── chat/
│   ├── route       - 채팅 목록/메시지 전송
│   ├── messages    - 메시지 조회
│   └── mark-read   - 읽음 처리
├── notices         - 공지사항 CRUD
└── edit/           - 관리자 기능
    ├── chat        - 채팅 관리
    └── notice      - 공지사항 관리
```

### 현재 기술 스택

| 영역 | 기술 |
|------|------|
| **Frontend** | Next.js 15, React 19, TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Animation** | Framer Motion |
| **State Management** | React Context API |
| **Backend** | Next.js API Routes |
| **Database** | PostgreSQL + Prisma ORM |
| **Real-time** | Supabase |
| **Message Storage** | MongoDB |
| **Authentication** | JWT (RS256) |

---

## 기술 스택 비교

### Web vs React Native 기술 매핑

| 웹 기술 | React Native 대안 | 호환성 |
|---------|-------------------|--------|
| Next.js | Expo Router | 🔄 마이그레이션 필요 |
| Tailwind CSS | NativeWind / StyleSheet | 🔄 스타일 변환 필요 |
| Framer Motion | React Native Reanimated | 🔄 애니메이션 재작업 |
| Context API | Context API | ✅ 완전 호환 |
| Supabase | Supabase (동일) | ✅ 완전 호환 |
| JWT 인증 | JWT + SecureStore | 🔄 저장 방식 변경 |
| Axios | Axios (동일) | ✅ 완전 호환 |

---

## 프로젝트 초기 설정

### 1. Expo 프로젝트 생성

```bash
# Expo CLI 설치 (최신 버전)
npm install -g @expo/cli

# 새 프로젝트 생성
npx create-expo-app --template edutalk-mobile

cd edutalk-mobile

# TypeScript 설정
npx expo install --template typescript
```

### 2. 필수 의존성 설치

```bash
# 네비게이션
npx expo install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context

# Expo 모듈들
npx expo install expo-secure-store expo-notifications expo-image expo-router

# 상태 관리 및 네트워킹
npm install axios @supabase/supabase-js

# UI 및 애니메이션
npx expo install react-native-reanimated @expo/vector-icons
npm install nativewind tailwindcss

# 개발 도구
npm install -D @types/react @types/react-native
```

### 3. 기본 설정 파일

#### app.config.js
```javascript
export default {
  expo: {
    name: "EduTalk",
    slug: "edutalk-mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.edutalk.mobile"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      },
      package: "com.edutalk.mobile",
      permissions: [
        "NOTIFICATIONS",
        "VIBRATE",
        "SYSTEM_ALERT_WINDOW"
      ]
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },
    plugins: [
      "expo-router",
      "expo-secure-store",
      [
        "expo-notifications",
        {
          icon: "./assets/notification-icon.png",
          color: "#ffffff"
        }
      ]
    ]
  }
};
```

#### tailwind.config.js (NativeWind 사용 시)
```javascript
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

---

## 아키텍처 설계

### 프로젝트 구조

```
edutalk-mobile/
├── app/                    # Expo Router 기반 라우팅
│   ├── (auth)/            # 인증 관련 화면
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── find.tsx
│   ├── (tabs)/           # 메인 탭 네비게이션
│   │   ├── chat.tsx
│   │   ├── notices.tsx
│   │   └── profile.tsx
│   ├── chat/
│   │   └── [id].tsx      # 채팅방 상세
│   └── _layout.tsx       # 루트 레이아웃
├── components/            # 재사용 컴포넌트
│   ├── ui/               # 기본 UI 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── LoadingSpinner.tsx
│   ├── chat/             # 채팅 관련 컴포넌트
│   │   ├── ChatList.tsx
│   │   ├── MessageItem.tsx
│   │   ├── ChatHeader.tsx
│   │   └── MessageInput.tsx
│   ├── auth/             # 인증 관련 컴포넌트
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── AuthButton.tsx
│   └── layout/           # 레이아웃 컴포넌트
│       ├── SafeWrapper.tsx
│       └── KeyboardAvoidingWrapper.tsx
├── hooks/                # 커스텀 훅
│   ├── useAuth.ts
│   ├── useChat.ts
│   ├── useChatList.ts
│   ├── useNotifications.ts
│   └── useSupabaseRealtime.ts
├── services/             # API 서비스
│   ├── api.ts
│   ├── authService.ts
│   ├── chatService.ts
│   └── notificationService.ts
├── store/                # 상태 관리
│   ├── AuthContext.tsx
│   ├── ChatContext.tsx
│   └── NotificationContext.tsx
├── types/                # TypeScript 타입 정의
│   ├── auth.ts
│   ├── chat.ts
│   └── api.ts
├── constants/            # 상수 및 설정
│   ├── colors.ts
│   ├── api.ts
│   └── storage.ts
├── utils/                # 유틸리티 함수
│   ├── tokenUtils.ts
│   ├── dateUtils.ts
│   └── validation.ts
└── assets/               # 정적 자산
    ├── images/
    ├── icons/
    └── fonts/
```

---

## 컴포넌트 포팅 가이드

### 1. 기본 UI 컴포넌트

#### Button 컴포넌트
```typescript
// components/ui/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        (disabled || loading) && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#007AFF'} />
      ) : (
        <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: '#F2F2F7',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#000',
  },
  outlineText: {
    color: '#007AFF',
  },
});
```

#### Input 컴포넌트
```typescript
// components/ui/Input.tsx
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          error && styles.inputError,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor="#999"
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputFocused: {
    borderColor: '#007AFF',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
});
```

### 2. 채팅 컴포넌트 포팅

#### MessageItem 컴포넌트
```typescript
// components/chat/MessageItem.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

interface Message {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
  isOwn: boolean;
  avatar?: string;
  status?: 'sending' | 'delivered' | 'read';
}

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (message.isOwn) {
    // 내가 보낸 메시지
    return (
      <View style={styles.ownMessageContainer}>
        <View style={styles.ownMessageBubble}>
          <Text style={styles.ownMessageText}>{message.message}</Text>
        </View>
        <View style={styles.ownMessageInfo}>
          <Text style={styles.timestamp}>{formatTime(message.timestamp)}</Text>
          {message.status && (
            <View style={styles.statusContainer}>
              <Text style={styles.status}>
                {message.status === 'delivered' ? '✓' : message.status === 'read' ? '✓✓' : '⏱'}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  // 상대방 메시지
  return (
    <View style={styles.otherMessageContainer}>
      <Image
        source={{ uri: message.avatar || 'https://cdn-icons-png.flaticon.com/512/9187/9187604.png' }}
        style={styles.avatar}
        cachePolicy="memory-disk"
      />
      <View style={styles.otherMessageContent}>
        <Text style={styles.senderName}>{message.sender}</Text>
        <View style={styles.otherMessageBubble}>
          <Text style={styles.otherMessageText}>{message.message}</Text>
        </View>
        <Text style={styles.timestamp}>{formatTime(message.timestamp)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ownMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  ownMessageBubble: {
    backgroundColor: '#007AFF',
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: '70%',
  },
  ownMessageText: {
    color: '#fff',
    fontSize: 16,
  },
  ownMessageInfo: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginLeft: 8,
  },
  otherMessageContainer: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  otherMessageContent: {
    flex: 1,
  },
  senderName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  otherMessageBubble: {
    backgroundColor: '#F2F2F7',
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: '70%',
  },
  otherMessageText: {
    color: '#000',
    fontSize: 16,
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  statusContainer: {
    marginTop: 2,
  },
  status: {
    fontSize: 12,
    color: '#007AFF',
  },
});
```

---

## 상태 관리 및 훅 포팅

### 1. 인증 관련 훅

#### useAuth 훅
```typescript
// hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { authService } from '../services/authService';

interface User {
  id: string;
  name: string;
  email: string;
  identy: string;
  type: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // 토큰에서 사용자 정보 추출
  const getUserFromToken = useCallback((token: string): User | null => {
    try {
      const decoded: any = jwtDecode(token);
      return {
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        identy: decoded.identy,
        type: decoded.type,
        avatar: decoded.avatar,
      };
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  }, []);

  // 토큰 유효성 검사
  const isTokenValid = useCallback((token: string): boolean => {
    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }, []);

  // 토큰 로드
  const loadToken = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token && isTokenValid(token)) {
        const user = getUserFromToken(token);
        if (user) {
          setAuthState({
            user,
            token,
            isLoading: false,
            isAuthenticated: true,
          });
          return;
        }
      }
      // 토큰이 없거나 유효하지 않은 경우
      await SecureStore.deleteItemAsync('auth_token');
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Token load error:', error);
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, [isTokenValid, getUserFromToken]);

  // 로그인
  const login = useCallback(async (identy: string, password: string) => {
    try {
      const response = await authService.login(identy, password);
      const { token } = response;
      
      await SecureStore.setItemAsync('auth_token', token);
      const user = getUserFromToken(token);
      
      if (user) {
        setAuthState({
          user,
          token,
          isLoading: false,
          isAuthenticated: true,
        });
        return { success: true };
      }
      
      throw new Error('Invalid token received');
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || '로그인에 실패했습니다.' 
      };
    }
  }, [getUserFromToken]);

  // 로그아웃
  const logout = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync('auth_token');
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  // 회원가입
  const register = useCallback(async (userData: {
    identy: string;
    email: string;
    password: string;
    name: string;
    type: string;
  }) => {
    try {
      const response = await authService.register(userData);
      return { success: true, data: response };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || '회원가입에 실패했습니다.' 
      };
    }
  }, []);

  // 초기 로드
  useEffect(() => {
    loadToken();
  }, [loadToken]);

  return {
    ...authState,
    login,
    logout,
    register,
    refreshAuth: loadToken,
  };
};
```

### 2. 채팅 관련 훅 포팅

#### useChat 훅 (포팅 버전)
```typescript
// hooks/useChat.ts
import { useState, useCallback, useEffect } from 'react';
import { chatService } from '../services/chatService';
import { useSupabaseRealtime } from './useSupabaseRealtime';

interface Message {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
  isOwn: boolean;
  avatar?: string;
  status: 'sending' | 'delivered' | 'read';
}

interface ChatUser {
  uid: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline';
}

export const useChat = (user: any, selectedChatUser: ChatUser | null, token: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 메시지 로드
  const loadMessages = useCallback(async (chatRoomId: string) => {
    if (!chatRoomId || !token) return;
    
    try {
      setIsLoading(true);
      const response = await chatService.getMessages(chatRoomId, token);
      const formattedMessages = response.messages.map((msg: any) => ({
        id: msg.uid,
        sender: msg.senderName,
        message: msg.message,
        timestamp: new Date(msg.timestamp),
        isOwn: msg.senderId === user?.id,
        avatar: msg.avatar,
        status: 'delivered' as const,
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, [token, user?.id]);

  // 새 메시지 수신 처리
  const handleNewMessage = useCallback((message: any) => {
    if (message.senderId === user?.id) return; // 자신이 보낸 메시지는 제외

    const formattedMessage: Message = {
      id: message.uid,
      sender: message.senderName,
      message: message.message,
      timestamp: new Date(message.timestamp),
      isOwn: false,
      avatar: message.avatar,
      status: 'delivered',
    };

    setMessages(prev => [...prev, formattedMessage]);
  }, [user?.id]);

  // 실시간 연결
  const { isOpponentTyping, sendTypingEvent } = useSupabaseRealtime(
    user,
    selectedChatUser?.uid,
    handleNewMessage,
    () => {} // 타이핑 이벤트 핸들러
  );

  // 메시지 전송
  const sendMessage = useCallback(async () => {
    if (!newMessage.trim() || !selectedChatUser || isLoading) return;

    const tempId = `temp-${Date.now()}`;
    const tempMessage: Message = {
      id: tempId,
      sender: user?.name || '나',
      message: newMessage,
      timestamp: new Date(),
      isOwn: true,
      status: 'sending',
    };

    // UI에 임시 메시지 추가
    setMessages(prev => [...prev, tempMessage]);
    const messageText = newMessage;
    setNewMessage('');
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(
        selectedChatUser.uid,
        messageText,
        token
      );

      // 임시 메시지를 실제 메시지로 업데이트
      setMessages(prev => prev.map(msg => 
        msg.id === tempId 
          ? { ...msg, id: response.messageInfo.uid, status: 'delivered' as const }
          : msg
      ));
    } catch (error) {
      console.error('Failed to send message:', error);
      // 실패한 메시지 상태 업데이트
      setMessages(prev => prev.map(msg => 
        msg.id === tempId 
          ? { ...msg, status: 'sending' as const } // 재시도 가능하도록
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  }, [newMessage, selectedChatUser, user, token, isLoading]);

  // 채팅방 변경 시 메시지 로드
  useEffect(() => {
    if (selectedChatUser?.uid) {
      loadMessages(selectedChatUser.uid);
    }
  }, [selectedChatUser?.uid, loadMessages]);

  return {
    messages,
    newMessage,
    setNewMessage,
    sendMessage,
    isLoading,
    isOpponentTyping,
    sendTypingEvent,
  };
};
```

---

## API 통신 및 인증

### API 서비스 설정

```typescript
// services/api.ts
import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

class ApiService {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: Constants.expoConfig?.extra?.apiUrl || 'https://your-api-url.com',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // 요청 인터셉터 - 토큰 자동 추가
    this.instance.interceptors.request.use(async (config) => {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // 응답 인터셉터 - 인증 에러 처리
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // 토큰 만료 시 로그아웃 처리
          await SecureStore.deleteItemAsync('auth_token');
          // 로그인 페이지로 리다이렉트하는 로직 추가
        }
        return Promise.reject(error);
      }
    );
  }

  async get(url: string, config?: any) {
    const response = await this.instance.get(url, config);
    return response.data;
  }

  async post(url: string, data?: any, config?: any) {
    const response = await this.instance.post(url, data, config);
    return response.data;
  }

  async put(url: string, data?: any, config?: any) {
    const response = await this.instance.put(url, data, config);
    return response.data;
  }

  async delete(url: string, config?: any) {
    const response = await this.instance.delete(url, config);
    return response.data;
  }
}

export const apiService = new ApiService();
```

### 인증 서비스

```typescript
// services/authService.ts
import { apiService } from './api';

interface LoginData {
  identy: string;
  password: string;
}

interface RegisterData {
  identy: string;
  email: string;
  password: string;
  name: string;
  type: string;
}

class AuthService {
  async login(identy: string, password: string) {
    return apiService.post('/api/auth/login', { identy, password });
  }

  async register(data: RegisterData) {
    return apiService.post('/api/auth/register', data);
  }

  async verifyEmail(token: string) {
    return apiService.post('/api/auth/verify', { token });
  }

  async resetPassword(email: string) {
    return apiService.post('/api/auth/reset', { email });
  }

  async refreshToken() {
    return apiService.post('/api/auth/refresh');
  }
}

export const authService = new AuthService();
```

---

## 실시간 채팅 구현

### Supabase 실시간 연결

```typescript
// hooks/useSupabaseRealtime.ts
import { useEffect, useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabase = createClient(
  Constants.expoConfig?.extra?.supabaseUrl || '',
  Constants.expoConfig?.extra?.supabaseKey || ''
);

export const useSupabaseRealtime = (
  user: any,
  chatRoomId: string | undefined,
  onNewMessage: (message: any) => void,
  onTyping: (isTyping: boolean) => void
) => {
  const subscriptionRef = useRef<any>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isOpponentTyping, setIsOpponentTyping] = useState(false);

  useEffect(() => {
    if (!chatRoomId || !user?.id) return;

    // 채팅방 구독
    subscriptionRef.current = supabase
      .channel(`chat_${chatRoomId}`)
      .on('broadcast', { event: 'message' }, (payload) => {
        const message = payload.payload;
        if (message.senderId !== user.id) {
          onNewMessage(message);
        }
      })
      .on('broadcast', { event: 'typing' }, (payload) => {
        const typingData = payload.payload;
        if (typingData.userId !== user.id) {
          setIsOpponentTyping(true);
          onTyping(true);

          // 타이핑 타이머 리셋
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }

          typingTimeoutRef.current = setTimeout(() => {
            setIsOpponentTyping(false);
            onTyping(false);
          }, 2000);
        }
      })
      .subscribe();

    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [chatRoomId, user?.id, onNewMessage, onTyping]);

  // 타이핑 이벤트 전송
  const sendTypingEvent = async () => {
    if (!chatRoomId || !user?.id) return;

    try {
      await supabase
        .channel(`chat_${chatRoomId}`)
        .send({
          type: 'broadcast',
          event: 'typing',
          payload: {
            userId: user.id,
            userName: user.name,
          },
        });
    } catch (error) {
      console.error('Failed to send typing event:', error);
    }
  };

  return {
    isOpponentTyping,
    sendTypingEvent,
  };
};
```

---

## 네비게이션 구조

### Expo Router 설정

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { AuthProvider } from '../store/AuthContext';
import { useEffect } from 'react';
import { router } from 'expo-router';

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/(tabs)/chat');
      } else {
        router.replace('/(auth)/login');
      }
    }
  }, [isAuthenticated, isLoading]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="chat/[id]" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
```

### 탭 네비게이션

```typescript
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="chat"
        options={{
          title: '채팅',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notices"
        options={{
          title: '공지사항',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '프로필',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
```

---

## UI/UX 포팅

### 스타일링 시스템

#### NativeWind 사용 (권장)

```bash
npm install nativewind
npm install --save-dev tailwindcss
```

```typescript
// components/ui/Button.tsx (NativeWind 버전)
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { clsx } from 'clsx';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  className,
}) => {
  return (
    <TouchableOpacity
      className={clsx(
        'px-6 py-3 rounded-lg items-center justify-center min-h-[48px]',
        {
          'bg-blue-500': variant === 'primary',
          'bg-gray-100': variant === 'secondary',
          'bg-transparent border border-blue-500': variant === 'outline',
          'opacity-50': disabled || loading,
        },
        className
      )}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#007AFF'} />
      ) : (
        <Text
          className={clsx('text-base font-semibold', {
            'text-white': variant === 'primary',
            'text-black': variant === 'secondary',
            'text-blue-500': variant === 'outline',
          })}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
```

### 플랫폼별 UI 처리

```typescript
// components/layout/SafeWrapper.tsx
import React from 'react';
import { SafeAreaView, StatusBar, Platform } from 'react-native';

interface SafeWrapperProps {
  children: React.ReactNode;
  backgroundColor?: string;
}

export const SafeWrapper: React.FC<SafeWrapperProps> = ({
  children,
  backgroundColor = '#fff',
}) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
        backgroundColor={backgroundColor}
      />
      {children}
    </SafeAreaView>
  );
};
```

---

## 성능 최적화

### 1. 리스트 최적화

```typescript
// components/chat/MessageList.tsx
import React, { useMemo } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { MessageItem } from './MessageItem';

interface Message {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
  isOwn: boolean;
}

interface MessageListProps {
  messages: Message[];
  onEndReached?: () => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  onEndReached,
}) => {
  const renderMessage: ListRenderItem<Message> = useMemo(
    () =>
      ({ item }) =>
        <MessageItem message={item} />,
    []
  );

  // 메시지 키 추출 최적화
  const keyExtractor = useMemo(
    () => (item: Message) => item.id,
    []
  );

  // 아이템 레이아웃 최적화 (고정 높이인 경우)
  const getItemLayout = useMemo(
    () => (data: any, index: number) => ({
      length: 60, // 예상 높이
      offset: 60 * index,
      index,
    }),
    []
  );

  return (
    <FlatList
      data={messages}
      renderItem={renderMessage}
      keyExtractor={keyExtractor}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.1}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={15}
      getItemLayout={getItemLayout} // 고정 높이인 경우만 사용
      inverted // 채팅은 보통 역순으로 표시
    />
  );
};
```

### 2. 이미지 최적화

```typescript
// components/ui/OptimizedImage.tsx
import React from 'react';
import { Image, ImageProps } from 'expo-image';

interface OptimizedImageProps extends Partial<ImageProps> {
  source: { uri: string } | number;
  width: number;
  height: number;
  placeholder?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  source,
  width,
  height,
  placeholder = 'https://cdn-icons-png.flaticon.com/512/9187/9187604.png',
  ...props
}) => {
  return (
    <Image
      source={source}
      style={{ width, height, ...props.style }}
      placeholder={placeholder}
      contentFit="cover"
      transition={200}
      cachePolicy="memory-disk" // 메모리-디스크 캐싱
      {...props}
    />
  );
};
```

---

## 보안 고려사항

### 1. 보안 토큰 저장

```typescript
// utils/secureStorage.ts
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

export class SecureStorage {
  private static async encryptData(data: string): Promise<string> {
    // 추가 암호화 레이어 (선택사항)
    return data; // 실제로는 암호화 구현
  }

  private static async decryptData(encryptedData: string): Promise<string> {
    // 복호화
    return encryptedData; // 실제로는 복호화 구현
  }

  static async setItem(key: string, value: string): Promise<void> {
    try {
      const encryptedValue = await this.encryptData(value);
      await SecureStore.setItemAsync(key, encryptedValue);
    } catch (error) {
      console.error('SecureStorage setItem error:', error);
      throw error;
    }
  }

  static async getItem(key: string): Promise<string | null> {
    try {
      const encryptedValue = await SecureStore.getItemAsync(key);
      if (!encryptedValue) return null;
      return await this.decryptData(encryptedValue);
    } catch (error) {
      console.error('SecureStorage getItem error:', error);
      return null;
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('SecureStorage removeItem error:', error);
      throw error;
    }
  }
}
```

### 2. 네트워크 보안

```typescript
// services/secureApi.ts
import { apiService } from './api';
import * as Device from 'expo-device';
import * as Application from 'expo-application';

class SecureApiService {
  private deviceFingerprint: string = '';

  constructor() {
    this.generateDeviceFingerprint();
  }

  private async generateDeviceFingerprint() {
    const deviceInfo = {
      brand: Device.brand,
      modelName: Device.modelName,
      osName: Device.osName,
      osVersion: Device.osVersion,
      applicationId: Application.applicationId,
    };
    
    // 디바이스 고유 식별자 생성
    this.deviceFingerprint = btoa(JSON.stringify(deviceInfo));
  }

  async secureRequest(method: string, url: string, data?: any) {
    const headers = {
      'X-Device-Fingerprint': this.deviceFingerprint,
      'X-App-Version': Application.nativeApplicationVersion,
      'X-Request-Time': Date.now().toString(),
    };

    return apiService[method as keyof typeof apiService](url, data, { headers });
  }
}

export const secureApiService = new SecureApiService();
```

---

## 테스팅 전략

### 1. Unit Testing 설정

```bash
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native
```

```typescript
// __tests__/components/Button.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../../components/ui/Button';

describe('Button Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <Button title="Test Button" onPress={() => {}} />
    );
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={onPressMock} />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('shows loading indicator when loading', () => {
    const { getByTestId } = render(
      <Button title="Test Button" onPress={() => {}} loading={true} />
    );
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });
});
```

### 2. E2E Testing with Detox

```bash
npm install --save-dev detox
```

```javascript
// e2e/auth.test.js
describe('Authentication Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should login successfully', async () => {
    await element(by.id('login-input')).typeText('testuser');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();
    
    await expect(element(by.id('chat-screen'))).toBeVisible();
  });

  it('should navigate to chat room', async () => {
    // 로그인 후
    await element(by.id('chat-list-item-0')).tap();
    await expect(element(by.id('chat-room-screen'))).toBeVisible();
  });
});
```

---

## 배포 및 운영

### 1. EAS Build 설정

```json
// eas.json
{
  "cli": {
    "version": ">= 7.8.6"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./android-service-account.json",
        "track": "internal"
      },
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCDEF1234"
      }
    }
  }
}
```

### 2. 환경별 설정

```javascript
// app.config.js
const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

export default {
  expo: {
    name: IS_DEV ? 'EduTalk (Dev)' : IS_PREVIEW ? 'EduTalk (Preview)' : 'EduTalk',
    slug: 'edutalk-mobile',
    version: '1.0.0',
    extra: {
      apiUrl: IS_DEV 
        ? 'http://localhost:3000' 
        : IS_PREVIEW 
        ? 'https://staging-api.edutalk.com'
        : 'https://api.edutalk.com',
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      eas: {
        projectId: "your-project-id"
      }
    },
    android: {
      package: IS_DEV 
        ? 'com.edutalk.mobile.dev' 
        : IS_PREVIEW 
        ? 'com.edutalk.mobile.preview'
        : 'com.edutalk.mobile'
    },
    ios: {
      bundleIdentifier: IS_DEV 
        ? 'com.edutalk.mobile.dev' 
        : IS_PREVIEW 
        ? 'com.edutalk.mobile.preview'
        : 'com.edutalk.mobile'
    }
  }
};
```

### 3. 배포 명령어

```bash
# 개발 빌드
eas build --profile development --platform all

# 프리뷰 빌드
eas build --profile preview --platform all

# 프로덕션 빌드
eas build --profile production --platform all

# 스토어 배포
eas submit --profile production --platform all

# OTA 업데이트
eas update --branch production --message "Bug fixes and improvements"
```

---

## 📋 개발 단계별 체크리스트

### Phase 1: 프로젝트 초기 설정 (1-2주)
- [ ] Expo 프로젝트 생성 및 기본 설정
- [ ] 필수 라이브러리 설치 및 설정
- [ ] 프로젝트 구조 설계
- [ ] 기본 네비게이션 구조 구현
- [ ] 환경 설정 (개발/스테이징/프로덕션)

### Phase 2: 인증 시스템 (1-2주)
- [ ] 로그인/회원가입 UI 구현
- [ ] JWT 토큰 관리 시스템
- [ ] SecureStore를 이용한 보안 저장
- [ ] 자동 로그인 및 토큰 갱신
- [ ] 인증 상태 관리 (Context)

### Phase 3: 채팅 기능 구현 (2-3주)
- [ ] 채팅 목록 화면 구현
- [ ] 채팅방 화면 구현
- [ ] 메시지 송수신 기능
- [ ] 실시간 채팅 연결 (Supabase)
- [ ] 타이핑 인디케이터
- [ ] 메시지 상태 표시 (전송/전달/읽음)

### Phase 4: 추가 기능 (1-2주)
- [ ] 공지사항 기능
- [ ] 프로필 관리
- [ ] 푸시 알림 구현
- [ ] 이미지/파일 전송 (선택사항)
- [ ] 오프라인 지원

### Phase 5: 최적화 및 테스트 (1-2주)
- [ ] 성능 최적화
- [ ] Unit/Integration 테스트
- [ ] E2E 테스트 (Detox)
- [ ] 접근성 개선
- [ ] iOS/Android 플랫폼별 테스트

### Phase 6: 배포 준비 (1주)
- [ ] 앱 아이콘 및 스플래시 스크린
- [ ] 스토어 등록 정보 준비
- [ ] EAS Build 설정
- [ ] 프로덕션 환경 테스트
- [ ] 배포 및 모니터링 설정

---

## 🎯 예상 개발 기간

**총 예상 기간: 8-12주**

- **기본 구조 및 인증**: 3-4주
- **핵심 채팅 기능**: 3-4주
- **추가 기능 및 최적화**: 2-3주
- **테스트 및 배포**: 1-2주

---

## 📚 추가 리소스

### 공식 문서
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Supabase React Native](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)

### 추천 라이브러리
- **UI 라이브러리**: `react-native-elements`, `NativeBase`, `Tamagui`
- **상태 관리**: `Zustand`, `Redux Toolkit`
- **폼 관리**: `react-hook-form`
- **애니메이션**: `react-native-reanimated`, `lottie-react-native`
- **날짜 처리**: `date-fns`, `dayjs`

### 개발 도구
- **디버깅**: Flipper, React Native Debugger
- **코드 품질**: ESLint, Prettier, Husky
- **모니터링**: Sentry, Bugsnag
- **분석**: Firebase Analytics, Amplitude

---

이 가이드를 따라 단계별로 개발을 진행하면, 현재 Next.js 웹 애플리케이션의 모든 기능을 React Native Expo 모바일 앱으로 성공적으로 포팅할 수 있습니다. 각 단계에서 테스트를 철저히 수행하고, 사용자 피드백을 적극 반영하여 최고의 모바일 경험을 제공하시기 바랍니다.