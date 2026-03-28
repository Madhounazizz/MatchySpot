import { Conversation, Message } from '@/types';
import { users } from './users';
import { brcs } from './brcs';

const messages: Message[] = [
  {
    id: '1',
    senderId: '1',
    receiverId: '2',
    text: 'Hey! Want to grab coffee at Urban Grind tomorrow?',
    timestamp: '2025-07-08T14:30:00Z',
    isRead: true,
  },
  {
    id: '2',
    senderId: '2',
    receiverId: '1',
    text: 'Sounds great! How about 3pm?',
    timestamp: '2025-07-08T14:35:00Z',
    isRead: true,
  },
  {
    id: '3',
    senderId: '1',
    receiverId: '2',
    text: 'Perfect! See you there.',
    timestamp: '2025-07-08T14:40:00Z',
    isRead: true,
  },
  {
    id: '4',
    senderId: '1',
    receiverId: '3',
    text: 'Have you been to Neon Lounge yet?',
    timestamp: '2025-07-08T16:20:00Z',
    isRead: false,
  },
  {
    id: '5',
    senderId: '4',
    receiverId: '1',
    text: 'I heard Matcha Moment has a new tasting menu!',
    timestamp: '2025-07-08T10:15:00Z',
    isRead: true,
  },
  {
    id: '6',
    senderId: '1',
    receiverId: '4',
    text: 'Really? We should check it out sometime!',
    timestamp: '2025-07-08T10:30:00Z',
    isRead: true,
    brcSuggestion: {
      id: brcs[4].id,
      name: brcs[4].name,
      image: brcs[4].image,
    },
  },
  {
    id: '7',
    senderId: '5',
    receiverId: '1',
    text: 'Are you going to the Wine & Cheese Night event?',
    timestamp: '2025-07-07T19:45:00Z',
    isRead: true,
  },
];

export const conversations: Conversation[] = [
  {
    id: '1',
    participants: [users[0], users[1]],
    lastMessage: messages[2],
    unreadCount: 0,
  },
  {
    id: '2',
    participants: [users[0], users[2]],
    lastMessage: messages[3],
    unreadCount: 1,
  },
  {
    id: '3',
    participants: [users[0], users[3]],
    lastMessage: messages[5],
    unreadCount: 0,
  },
  {
    id: '4',
    participants: [users[0], users[4]],
    lastMessage: messages[6],
    unreadCount: 0,
  },
];

export const chatMessages: { [key: string]: Message[] } = {
  '1': [messages[0], messages[1], messages[2]],
  '2': [messages[3]],
  '3': [messages[4], messages[5]],
  '4': [messages[6]],
};