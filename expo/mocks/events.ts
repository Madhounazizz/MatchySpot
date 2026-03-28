import { Event } from '@/types';
import { users } from './users';

export const events: Event[] = [
  {
    id: '1',
    title: 'Wine & Cheese Night',
    description: 'Join us for an evening of wine tasting paired with artisanal cheeses from around the world.',
    date: '2025-07-15',
    time: '19:00',
    brcId: '1',
    brcName: 'Coastal Breeze',
    brcImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    attendees: users.slice(0, 3),
    maxAttendees: 12,
    price: 45,
  },
  {
    id: '2',
    title: 'Craft Cocktail Workshop',
    description: 'Learn how to make three signature cocktails with our expert mixologist. All materials included.',
    date: '2025-07-18',
    time: '20:00',
    brcId: '3',
    brcName: 'Neon Lounge',
    brcImage: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    attendees: users.slice(1, 4),
    maxAttendees: 8,
    price: 65,
  },
  {
    id: '3',
    title: 'Matcha Tasting Experience',
    description: 'Sample different grades of matcha and learn about its health benefits and preparation techniques.',
    date: '2025-07-20',
    time: '10:00',
    brcId: '5',
    brcName: 'Matcha Moment',
    brcImage: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    attendees: users.slice(2, 5),
    maxAttendees: 10,
    price: 30,
  },
  {
    id: '4',
    title: 'Farm-to-Table Dinner',
    description: 'A special dinner featuring locally sourced ingredients and a talk from the farmers who grew them.',
    date: '2025-07-25',
    time: '18:30',
    brcId: '4',
    brcName: 'Rustic Table',
    brcImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    attendees: users.slice(0, 2),
    maxAttendees: 20,
    price: 75,
  },
];

export const upcomingEvents = events.slice(0, 3);