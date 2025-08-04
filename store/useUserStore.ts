import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

interface UserState {
  currentUser: User | null;
  isLoggedIn: boolean;
  favorites: string[];
  setCurrentUser: (user: User) => void;
  login: () => void;
  logout: () => void;
  toggleFavorite: (brcId: string) => void;
  isFavorite: (brcId: string) => boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentUser: {
        id: '1',
        name: 'Alex Morgan',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        bio: 'Food enthusiast and coffee addict. Always looking for new restaurants to try!',
        interests: ['Fine Dining', 'Coffee', 'Wine Tasting'],
      },
      isLoggedIn: true,
      favorites: [],
      setCurrentUser: (user) => set({ currentUser: user }),
      login: () => set({ 
        isLoggedIn: true,
        currentUser: {
          id: '1',
          name: 'Alex Morgan',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          bio: 'Food enthusiast and coffee addict. Always looking for new restaurants to try!',
          interests: ['Fine Dining', 'Coffee', 'Wine Tasting'],
        }
      }),
      logout: () => set({ isLoggedIn: false, currentUser: null, favorites: [] }),
      toggleFavorite: (brcId) => {
        const { favorites } = get();
        if (favorites.includes(brcId)) {
          set({ favorites: favorites.filter((id) => id !== brcId) });
        } else {
          set({ favorites: [...favorites, brcId] });
        }
      },
      isFavorite: (brcId) => {
        return get().favorites.includes(brcId);
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);