import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BRCSession, BRCChatMessage, BRCChatroom } from '@/types';
import { useUserStore } from './useUserStore';

const STORAGE_KEY = 'brc_chat_data';

const generateAccessCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const generateAnonymousName = (): string => {
  const adjectives = ['Cool', 'Happy', 'Swift', 'Bright', 'Clever', 'Witty', 'Bold', 'Calm'];
  const nouns = ['Fox', 'Eagle', 'Wolf', 'Bear', 'Lion', 'Tiger', 'Hawk', 'Owl'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj}${noun}${Math.floor(Math.random() * 99) + 1}`;
};

export const [BRCChatProvider, useBRCChat] = createContextHook(() => {
  const [chatrooms, setChatrooms] = useState<Record<string, BRCChatroom>>({});
  const [currentSession, setCurrentSession] = useState<BRCSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadChatData();
  }, []);

  const loadChatData = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setChatrooms(data.chatrooms || {});
        setCurrentSession(data.currentSession || null);
      }
    } catch (error) {
      console.error('Failed to load chat data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveChatData = async (newChatrooms: Record<string, BRCChatroom>, newSession: BRCSession | null) => {
    try {
      const data = {
        chatrooms: newChatrooms,
        currentSession: newSession,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save chat data:', error);
    }
  };

  const createSession = useCallback(async (brcId: string, isAnonymous: boolean, customNickname?: string): Promise<string> => {
    try {
      // Get current user from store
      const userStore = useUserStore.getState();
      let user = userStore.currentUser;
      
      // If no user, auto-login as customer
      if (!user) {
        console.log('No user found, auto-logging in as customer...');
        userStore.login('customer');
        user = useUserStore.getState().currentUser;
      }
      
      if (!user) {
        throw new Error('Failed to create user session');
      }

      const accessCode = generateAccessCode();
      const displayName = isAnonymous 
        ? (customNickname || generateAnonymousName())
        : user.name;
      
      const session: BRCSession = {
        id: `session_${Date.now()}`,
        brcId,
        userId: user.id,
        accessCode,
        joinedAt: new Date().toISOString(),
        isActive: true,
        displayName,
        isAnonymous,
        avatar: isAnonymous ? undefined : user.avatar,
      };

      const chatroomId = `chatroom_${brcId}`;
      
      setChatrooms(prev => {
        const updated = { ...prev };
        
        if (!updated[chatroomId]) {
          updated[chatroomId] = {
            id: chatroomId,
            brcId,
            name: `Chatroom`,
            activeSessions: [],
            messages: [],
          };
        }

        updated[chatroomId].activeSessions = [
          ...updated[chatroomId].activeSessions.filter(s => s.userId !== user.id),
          session,
        ];
        
        saveChatData(updated, session);
        return updated;
      });
      
      setCurrentSession(session);
      console.log('Session created successfully:', { accessCode, brcId, displayName });
      return accessCode;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }, []);

  const joinChatroom = useCallback((brcId: string) => {
    const chatroomId = `chatroom_${brcId}`;
    return chatrooms[chatroomId] || null;
  }, [chatrooms]);

  const sendMessage = useCallback(async (brcId: string, text: string) => {
    if (!currentSession || currentSession.brcId !== brcId) {
      throw new Error('No active session for this BRC');
    }

    const chatroomId = `chatroom_${brcId}`;
    const message: BRCChatMessage = {
      id: `msg_${Date.now()}`,
      sessionId: currentSession.id,
      brcId,
      text,
      timestamp: new Date().toISOString(),
      displayName: currentSession.displayName,
      isAnonymous: currentSession.isAnonymous,
      avatar: currentSession.avatar,
    };

    setChatrooms(prev => {
      const updated = { ...prev };
      if (updated[chatroomId]) {
        updated[chatroomId].messages.push(message);
        saveChatData(updated, currentSession);
      }
      return updated;
    });
  }, [currentSession]);

  const leaveRoom = useCallback(async () => {
    if (!currentSession) return;

    const chatroomId = `chatroom_${currentSession.brcId}`;
    
    setChatrooms(prev => {
      const updated = { ...prev };
      if (updated[chatroomId]) {
        updated[chatroomId].activeSessions = 
          updated[chatroomId].activeSessions.filter(s => s.id !== currentSession.id);
      }
      saveChatData(updated, null);
      return updated;
    });
    
    setCurrentSession(null);
  }, [currentSession]);

  const hasActiveSession = useCallback((brcId: string): boolean => {
    return currentSession?.brcId === brcId && currentSession.isActive;
  }, [currentSession]);

  const getCurrentChatroom = useCallback((): BRCChatroom | null => {
    if (!currentSession) return null;
    const chatroomId = `chatroom_${currentSession.brcId}`;
    return chatrooms[chatroomId] || null;
  }, [currentSession, chatrooms]);

  return useMemo(() => ({
    chatrooms,
    currentSession,
    isLoading,
    createSession,
    joinChatroom,
    sendMessage,
    leaveRoom,
    hasActiveSession,
    getCurrentChatroom,
    generateAnonymousName,
  }), [chatrooms, currentSession, isLoading, createSession, joinChatroom, sendMessage, leaveRoom, hasActiveSession, getCurrentChatroom]);
});