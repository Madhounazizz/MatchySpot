export type VerificationStatus = 'none' | 'pending' | 'approved' | 'rejected';

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
  verificationStatus: VerificationStatus;
  verificationDate?: string;
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
  userType?: 'customer' | 'restaurant';
  restaurantId?: string;
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

export type Reservation = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAvatar?: string;
  date: string;
  time: string;
  partySize: number;
  status: 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no-show';
  specialRequests?: string;
  tableNumber?: string;
  createdAt: string;
  updatedAt: string;
  brcId: string;
  estimatedDuration: number;
};

export type Staff = {
  id: string;
  name: string;
  avatar: string;
  role: 'manager' | 'waiter' | 'host' | 'chef' | 'bartender';
  email: string;
  phone: string;
  isActive: boolean;
  shift: {
    start: string;
    end: string;
    days: string[];
  };
  joinedDate: string;
};

export type Table = {
  id: string;
  number: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  location: string;
  reservationId?: string;
};

export type RestaurantStats = {
  todayReservations: number;
  todayRevenue: number;
  occupancyRate: number;
  averageRating: number;
  totalReviews: number;
  pendingReservations: number;
};

export type MenuAnalytics = {
  totalItems: number;
  availableItems: number;
  popularItems: string[];
  categoryBreakdown: Record<string, number>;
  averagePrice: number;
  topRatedItems: string[];
};

export type BusinessHours = {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
};

export type RestaurantProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  description: string;
  cuisine: string[];
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  businessHours: BusinessHours[];
  features: string[];
  images: string[];
};

export type BRCSession = {
  id: string;
  brcId: string;
  userId: string;
  accessCode: string;
  joinedAt: string;
  isActive: boolean;
  displayName: string;
  isAnonymous: boolean;
  avatar?: string;
};

export type BRCChatMessage = {
  id: string;
  sessionId: string;
  brcId: string;
  text: string;
  timestamp: string;
  displayName: string;
  isAnonymous: boolean;
  avatar?: string;
};

export type BRCChatroom = {
  id: string;
  brcId: string;
  name: string;
  activeSessions: BRCSession[];
  messages: BRCChatMessage[];
};