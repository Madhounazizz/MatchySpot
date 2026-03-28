import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/colors';

interface FoodCategory {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

const foodCategories: FoodCategory[] = [
  {
    id: 'chinese',
    name: 'Chinese',
    emoji: '🥢',
    color: colors.chinese,
    description: 'Authentic Asian flavors'
  },
  {
    id: 'french',
    name: 'French',
    emoji: '🥐',
    color: colors.french,
    description: 'Classic European cuisine'
  },
  {
    id: 'italian',
    name: 'Italian',
    emoji: '🍝',
    color: colors.italian,
    description: 'Traditional pasta & pizza'
  },
  {
    id: 'tunisian',
    name: 'Tunisian',
    emoji: '🌶️',
    color: colors.tunisian,
    description: 'Spicy North African dishes'
  },
];

interface FoodCategoriesProps {
  onCategoryPress?: (category: FoodCategory) => void;
}

export default function FoodCategories({ onCategoryPress }: FoodCategoriesProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {foodCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryCard}
            onPress={() => onCategoryPress?.(category)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[category.color + '20', category.color + '10']}
              style={styles.gradient}
            >
              <View style={[styles.emojiContainer, { backgroundColor: category.color + '20' }]}>
                <Text style={styles.emoji}>{category.emoji}</Text>
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryDescription}>{category.description}</Text>
              <View style={[styles.colorIndicator, { backgroundColor: category.color }]} />
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  categoryCard: {
    width: 140,
    height: 120,
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  gradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  emojiContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emoji: {
    fontSize: 20,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 11,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 14,
  },
  colorIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
});

export { foodCategories };
export type { FoodCategory };