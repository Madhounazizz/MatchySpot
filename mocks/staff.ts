import { Staff } from '@/types';

export const mockStaff: Staff[] = [
  {
    id: '1',
    name: 'James Wilson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    role: 'manager',
    email: 'james.wilson@matchyspot.com',
    phone: '+1 (555) 111-2222',
    isActive: true,
    shift: {
      start: '09:00',
      end: '18:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    joinedDate: '2023-03-15'
  },
  {
    id: '2',
    name: 'Maria Garcia',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    role: 'host',
    email: 'maria.garcia@matchyspot.com',
    phone: '+1 (555) 333-4444',
    isActive: true,
    shift: {
      start: '17:00',
      end: '23:00',
      days: ['Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    joinedDate: '2023-08-22'
  },
  {
    id: '3',
    name: 'Alex Thompson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    role: 'waiter',
    email: 'alex.thompson@matchyspot.com',
    phone: '+1 (555) 555-6666',
    isActive: true,
    shift: {
      start: '16:00',
      end: '22:00',
      days: ['Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    joinedDate: '2023-11-10'
  },
  {
    id: '4',
    name: 'Chef Roberto',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    role: 'chef',
    email: 'roberto.chef@matchyspot.com',
    phone: '+1 (555) 777-8888',
    isActive: true,
    shift: {
      start: '14:00',
      end: '23:00',
      days: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    joinedDate: '2022-12-05'
  },
  {
    id: '5',
    name: 'Sophie Chen',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    role: 'waiter',
    email: 'sophie.chen@matchyspot.com',
    phone: '+1 (555) 999-0000',
    isActive: false,
    shift: {
      start: '18:00',
      end: '24:00',
      days: ['Friday', 'Saturday', 'Sunday']
    },
    joinedDate: '2024-01-15'
  },
  {
    id: '6',
    name: 'Marcus Johnson',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    role: 'bartender',
    email: 'marcus.johnson@matchyspot.com',
    phone: '+1 (555) 222-3333',
    isActive: true,
    shift: {
      start: '19:00',
      end: '02:00',
      days: ['Thursday', 'Friday', 'Saturday']
    },
    joinedDate: '2023-06-18'
  }
];