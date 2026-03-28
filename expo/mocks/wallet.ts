import { Transaction } from '@/types';

export const transactions: Transaction[] = [
  {
    id: '1',
    type: 'earn',
    amount: 150,
    description: 'Visit to Coastal Breeze',
    date: '2025-07-05',
    brcId: '1',
    brcName: 'Coastal Breeze',
  },
  {
    id: '2',
    type: 'earn',
    amount: 75,
    description: 'Review posted',
    date: '2025-07-05',
    brcId: '1',
    brcName: 'Coastal Breeze',
  },
  {
    id: '3',
    type: 'earn',
    amount: 100,
    description: 'Visit to Urban Grind',
    date: '2025-07-02',
    brcId: '2',
    brcName: 'Urban Grind',
  },
  {
    id: '4',
    type: 'spend',
    amount: 200,
    description: 'Discount coupon',
    date: '2025-06-28',
  },
  {
    id: '5',
    type: 'earn',
    amount: 125,
    description: 'Visit to Neon Lounge',
    date: '2025-06-25',
    brcId: '3',
    brcName: 'Neon Lounge',
  },
  {
    id: '6',
    type: 'earn',
    amount: 50,
    description: 'Successful match',
    date: '2025-06-22',
  },
];

export const walletSummary = {
  balance: 300,
  totalEarned: 500,
  totalSpent: 200,
  availableRewards: [
    {
      id: '1',
      name: 'Free Coffee',
      points: 200,
      brcId: '2',
      brcName: 'Urban Grind',
    },
    {
      id: '2',
      name: '20% Off Dinner',
      points: 350,
      brcId: '1',
      brcName: 'Coastal Breeze',
    },
    {
      id: '3',
      name: 'Free Cocktail',
      points: 250,
      brcId: '3',
      brcName: 'Neon Lounge',
    },
  ],
};