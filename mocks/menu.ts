export type MenuItem = {
  id: string;
  brcId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'appetizer' | 'main' | 'dessert' | 'drink';
  rating: number;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isAvailable?: boolean;
};

export const menuItems: MenuItem[] = [
  {
    id: '1',
    brcId: '1',
    name: 'Grilled Atlantic Salmon',
    description: 'Fresh Atlantic salmon with lemon herb butter, served with seasonal vegetables and wild rice',
    price: 28,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 'main',
    rating: 4.8,
  },
  {
    id: '2',
    brcId: '1',
    name: 'Seafood Platter',
    description: 'A selection of fresh oysters, shrimp, and crab legs with cocktail sauce and mignonette',
    price: 45,
    image: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 'appetizer',
    rating: 4.9,
  },
  {
    id: '3',
    brcId: '1',
    name: 'Key Lime Pie',
    description: 'Traditional Florida key lime pie with graham cracker crust and whipped cream',
    price: 12,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 'dessert',
    rating: 4.7,
  },
  {
    id: '4',
    brcId: '2',
    name: 'Artisan Avocado Toast',
    description: 'Multigrain sourdough topped with smashed avocado, cherry tomatoes, and everything seasoning',
    price: 14,
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 'main',
    rating: 4.6,
    isVegetarian: true,
    isVegan: true,
  },
  {
    id: '5',
    brcId: '2',
    name: 'Cold Brew Coffee',
    description: 'Smooth cold brew made from our signature blend, served over ice',
    price: 5,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 'drink',
    rating: 4.8,
    isVegan: true,
  },
  {
    id: '6',
    brcId: '2',
    name: 'Blueberry Scone',
    description: 'Freshly baked scone with wild blueberries and a light glaze',
    price: 4,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 'dessert',
    rating: 4.5,
    isVegetarian: true,
  },
  {
    id: '7',
    brcId: '3',
    name: 'Craft Old Fashioned',
    description: 'Premium bourbon with house-made simple syrup, bitters, and orange peel',
    price: 16,
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 'drink',
    rating: 4.9,
  },
  {
    id: '8',
    brcId: '3',
    name: 'Truffle Mac & Cheese',
    description: 'Creamy mac and cheese with truffle oil and crispy breadcrumbs',
    price: 18,
    image: 'https://images.unsplash.com/photo-1543826173-1ad0e8b5b2e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 'main',
    rating: 4.7,
    isVegetarian: true,
  },
  {
    id: '9',
    brcId: '4',
    name: 'Farm Fresh Salad',
    description: 'Mixed greens with seasonal vegetables, goat cheese, and balsamic vinaigrette',
    price: 16,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 'main',
    rating: 4.6,
    isVegetarian: true,
    isGlutenFree: true,
  },
  {
    id: '10',
    brcId: '5',
    name: 'Matcha Latte',
    description: 'Premium ceremonial grade matcha with steamed oat milk',
    price: 6,
    image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 'drink',
    rating: 4.8,
    isVegan: true,
  },
];