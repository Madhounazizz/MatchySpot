import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BRCSession, BRCChatMessage, BRCChatroom } from '@/types';
import { useUserStore } from './useUserStore';

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

interface BRCChatState {
  chatrooms: Record<string, BRCChatroom>;
  currentSession: BRCSession | null;
  isLoading: boolean;
  createSession: (brcId: string, isAnonymous: boolean, customNickname?: string) => Promise<string>;
  joinChatroom: (brcId: string) => BRCChatroom | null;
  sendMessage: (brcId: string, text: string) => Promise<void>;
  leaveRoom: () => Promise<void>;
  hasActiveSession: (brcId: string) => boolean;
  getCurrentChatroom: () => BRCChatroom | null;
  generateAnonymousName: () => string;
}

export const useBRCChatStore = create<BRCChatState>()(
  persist(
    (set, get) => ({

      chatrooms: {},
      currentSession: null,
      isLoading: false,
      
      createSession: async (brcId: string, isAnonymous: boolean, customNickname?: string): Promise<string> => {
        try {
          let user = useUserStore.getState().currentUser;
          
          // If no user, auto-login as customer
          if (!user) {
            console.log('No user found, auto-logging in as customer...');
            useUserStore.getState().login('customer');
            // Wait a bit for the login to complete
            await new Promise(resolve => setTimeout(resolve, 100));
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
          
          set((state) => {
            const updated = { ...state.chatrooms };
            
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
              ...updated[chatroomId].activeSessions.filter(s => s.userId !== user!.id),
              session,
            ];
            
            return {
              chatrooms: updated,
              currentSession: session,
            };
          });
          
          console.log('Session created successfully:', { accessCode, brcId, displayName });
          return accessCode;
        } catch (error) {
          console.error('Error creating session:', error);
          throw error;
        }
      },

      joinChatroom: (brcId: string) => {
        const chatroomId = `chatroom_${brcId}`;
        return get().chatrooms[chatroomId] || null;
      },

      sendMessage: async (brcId: string, text: string) => {
        const { currentSession } = get();
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

        set((state) => {
          const updated = { ...state.chatrooms };
          if (updated[chatroomId]) {
            updated[chatroomId].messages.push(message);
          }
          return { chatrooms: updated };
        });
      },

      leaveRoom: async () => {
        const { currentSession } = get();
        if (!currentSession) return;

        const chatroomId = `chatroom_${currentSession.brcId}`;
        
        set((state) => {
          const updated = { ...state.chatrooms };
          if (updated[chatroomId]) {
            updated[chatroomId].activeSessions = 
              updated[chatroomId].activeSessions.filter(s => s.id !== currentSession.id);
          }
          return {
            chatrooms: updated,
            currentSession: null,
          };
        });
      },

      hasActiveSession: (brcId: string): boolean => {
        const { currentSession } = get();
        return currentSession?.brcId === brcId && currentSession.isActive;
      },

      getCurrentChatroom: (): BRCChatroom | null => {
        const { currentSession, chatrooms } = get();
        if (!currentSession) return null;
        const chatroomId = `chatroom_${currentSession.brcId}`;
        return chatrooms[chatroomId] || null;
      },

      generateAnonymousName,
    }),
    {
      name: 'brc-chat-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);