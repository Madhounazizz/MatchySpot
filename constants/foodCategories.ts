export const foodCategories = [
  {
    id: 'chinese',
    name: 'Chinese',
    emoji: '🥢',
    color: '#FF6B6B',
    description: 'Authentic Chinese cuisine'
  },
  {
    id: 'french',
    name: 'French',
    emoji: '🥐',
    color: '#4ECDC4',
    description: 'Classic French dishes'
  },
  {
    id: 'italian',
    name: 'Italian',
    emoji: '🍝',
    color: '#45B7D1',
    description: 'Traditional Italian flavors'
  },
  {
    id: 'tunisian',
    name: 'Tunisian',
    emoji: '🌶️',
    color: '#96CEB4',
    description: 'Spicy Tunisian specialties'
  },
  {
    id: 'mediterranean',
    name: 'Mediterranean',
    emoji: '🫒',
    color: '#FECA57',
    description: 'Fresh Mediterranean cuisine'
  },
  {
    id: 'japanese',
    name: 'Japanese',
    emoji: '🍣',
    color: '#FF9FF3',
    description: 'Authentic Japanese dishes'
  }
];

export const cuisineTypes = [
  'chinese',
  'french',
  'italian',
  'tunisian',
  'mediterranean',
  'japanese',
  'american',
  'mexican',
  'indian',
  'thai'
] as const;

export type CuisineType = typeof cuisineTypes[number];