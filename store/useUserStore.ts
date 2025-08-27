import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

interface UserState {
  currentUser: User | null;
  isLoggedIn: boolean;
  favorites: string[];
  setCurrentUser: (user: User) => void;
  login: (userType?: 'customer' | 'restaurant') => void;
  logout: () => void;
  toggleFavorite: (brcId: string) => void;
  isFavorite: (brcId: string) => boolean;
  isRestaurantUser: () => boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isLoggedIn: false,
      favorites: [],
      setCurrentUser: (user) => set({ currentUser: user }),
      login: (userType = 'customer') => {
        const customerUser = {
          id: '1',
          name: 'Alex Morgan',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          bio: 'Food enthusiast and coffee addict. Always looking for new restaurants to try!',
          interests: ['Fine Dining', 'Coffee', 'Wine Tasting'],
          userType: 'customer' as const,
        };
        
        const restaurantUser = {
          id: 'rest_1',
          name: 'Bella Vista Restaurant',
          avatar: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          bio: 'Fine dining restaurant specializing in Italian cuisine with a modern twist.',
          interests: ['Italian Cuisine', 'Fine Dining', 'Wine Pairing'],
          userType: 'restaurant' as const,
          restaurantId: '1',
        };
        
        set({ 
          isLoggedIn: true,
          currentUser: userType === 'restaurant' ? restaurantUser : customerUser
        });
      },
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
      isRestaurantUser: () => {
        return get().currentUser?.userType === 'restaurant';
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);