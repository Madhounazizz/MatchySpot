export type BRC = {
  id: string;
  name: string;
  type: 'bar' | 'restaurant' | 'cafe';
  rating: number;
  reviewCount: number;
  image: string;
  address: string;
  distance?: string;
  priceLevel: 1 | 2 | 3 | 4;
  description: string;
  tags: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
  openingHours: {
    open: string;
    close: string;
  };
  isFavorite?: boolean;
};

export type User = {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
  interests: string[];
  matchPercentage?: number;
  lastActive?: string;
  isOnline?: boolean;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  brcId: string;
  brcName: string;
  brcImage: string;
  attendees: User[];
  maxAttendees: number;
  price?: number;
};

export type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  brcSuggestion?: {
    id: string;
    name: string;
    image: string;
  };
};

export type Conversation = {
  id: string;
  participants: User[];
  lastMessage: Message;
  unreadCount: number;
};

export type Review = {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  brcId: string;
  rating: number;
  text: string;
  date: string;
  images?: string[];
  likes: number;
};

export type Transaction = {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  description: string;
  date: string;
  brcId?: string;
  brcName?: string;
};