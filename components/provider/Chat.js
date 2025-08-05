"use client";
import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [selectedChatUser, setSelectedChatUser] = useState(null);

  return (
    <ChatContext.Provider value={{ selectedChatUser, setSelectedChatUser }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
