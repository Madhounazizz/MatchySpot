export const foodCategories = [
  {
    id: 'chinese',
    name: 'Chinese',
    emoji: '🥢',
    color: '#E74C3C',
    description: 'Authentic Chinese flavors'
  },
  {
    id: 'french',
    name: 'French',
    emoji: '🥐',
    color: '#3498DB',
    description: 'Elegant French cuisine'
  },
  {
    id: 'italian',
    name: 'Italian',
    emoji: '🍝',
    color: '#27AE60',
    description: 'Traditional Italian pasta'
  },
  {
    id: 'tunisian',
    name: 'Tunisian',
    emoji: '🌶️',
    color: '#F39C12',
    description: 'Spicy North African'
  },
  {
    id: 'mediterranean',
    name: 'Mediterranean',
    emoji: '🫒',
    color: '#9B59B6',
    description: 'Fresh Mediterranean'
  },
  {
    id: 'japanese',
    name: 'Japanese',
    emoji: '🍣',
    color: '#E67E22',
    description: 'Authentic Sushi & More'
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
  'thai',
  'korean',
  'vietnamese'
] as const;

export type CuisineType = typeof cuisineTypes[number];