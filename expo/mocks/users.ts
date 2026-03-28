import { User } from '@/types';

export const users: User[] = [
  {
    id: '1',
    name: 'Mouayed Morgan',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    bio: 'Food enthusiast and coffee addict. Always looking for new restaurants to try!',
    interests: ['Fine Dining', 'Coffee', 'Wine Tasting'],
    matchPercentage: 92,
    isOnline: true,
  },
  {
    id: '2',
    name: 'Jordan Taylor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    bio: 'Craft beer enthusiast and amateur chef. Let\'s grab a drink!',
    interests: ['Craft Beer', 'Live Music', 'Food Trucks'],
    matchPercentage: 85,
    lastActive: '5m ago',
  },
  {
    id: '3',
    name: 'Riley Johnson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    bio: 'Cocktail connoisseur and social butterfly. Always up for trying new bars!',
    interests: ['Cocktails', 'Rooftop Bars', 'Networking'],
    matchPercentage: 78,
    lastActive: '2h ago',
  },
  {
    id: '4',
    name: 'Casey Kim',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    bio: 'Vegan foodie and tea lover. Looking for plant-based dining companions.',
    interests: ['Vegan', 'Tea Houses', 'Sustainable Dining'],
    matchPercentage: 65,
    isOnline: true,
  },
  {
    id: '5',
    name: 'Morgan Lee',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    bio: 'Brunch enthusiast and mimosa expert. Weekend meetups only!',
    interests: ['Brunch', 'Bakeries', 'Champagne'],
    matchPercentage: 73,
    lastActive: '1d ago',
  },
];

export const suggestedUsers = users.slice(0, 3);
export const nearbyUsers = users.slice(2, 5);