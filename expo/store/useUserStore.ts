import { create } from 'zustand';
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

// Create the store with initial implementation
export const useUserStore = create<UserState>()(() => ({
  currentUser: null,
  isLoggedIn: false,
  favorites: [],
  setCurrentUser: (user: User) => {
    useUserStore.setState({ currentUser: user });
  },
  login: (userType: 'customer' | 'restaurant' = 'customer') => {
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
    
    useUserStore.setState({ 
      isLoggedIn: true,
      currentUser: userType === 'restaurant' ? restaurantUser : customerUser
    });
  },
  logout: () => {
    useUserStore.setState({ isLoggedIn: false, currentUser: null, favorites: [] });
  },
  toggleFavorite: (brcId: string) => {
    const { favorites } = useUserStore.getState();
    if (favorites.includes(brcId)) {
      useUserStore.setState({ favorites: favorites.filter((id: string) => id !== brcId) });
    } else {
      useUserStore.setState({ favorites: [...favorites, brcId] });
    }
  },
  isFavorite: (brcId: string): boolean => {
    return useUserStore.getState().favorites.includes(brcId);
  },
  isRestaurantUser: (): boolean => {
    return useUserStore.getState().currentUser?.userType === 'restaurant';
  },
}));

// Try to load persisted data in the background
setTimeout(() => {
  try {
    console.log('Attempting to load user data from AsyncStorage...');
    
    // Set a timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('AsyncStorage timeout')), 2000)
    );
    
    const loadData = async () => {
      try {
        const storedData = await Promise.race([
          AsyncStorage.getItem('user-storage'),
          timeoutPromise
        ]) as string | null;
        
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          if (parsedData.state) {
            console.log('Successfully loaded user data');
            useUserStore.setState(parsedData.state);
          }
        } else {
          console.log('No stored user data found, using default state');
          // Ensure we have a valid state by logging in as customer
          if (!useUserStore.getState().isLoggedIn) {
            useUserStore.getState().login('customer');
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        // Ensure we have a valid state by logging in as customer
        if (!useUserStore.getState().isLoggedIn) {
          useUserStore.getState().login('customer');
        }
      }
    };
    
    loadData();
  } catch (error) {
    console.error('Error in background user data loading:', error);
  }
}, 1000);

// Setup persistence for future state changes
// This won't block the initial render
setTimeout(() => {
  try {
    // Create a persisted version of the store
    const setupPersistence = async () => {
      // Save current state to AsyncStorage
      const currentState = useUserStore.getState();
      try {
        await AsyncStorage.setItem('user-storage', JSON.stringify({
          state: currentState
        }));
        console.log('Initial state persisted successfully');
      } catch (error) {
        console.error('Failed to persist initial state:', error);
      }
    };
    
    setupPersistence();
  } catch (error) {
    console.error('Error setting up persistence:', error);
  }
}, 2000);