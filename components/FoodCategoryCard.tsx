import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, shadows } from '@/constants/colors';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

interface FoodCategory {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

interface FoodCategoryCardProps {
  category: FoodCategory;
  onPress: (categoryId: string) => void;
}

export default function FoodCategoryCard({ category, onPress }: FoodCategoryCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(category.id)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[category.color, category.color + '80']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <Text style={styles.emoji}>{category.emoji}</Text>
          <Text style={styles.name}>{category.name}</Text>
          <Text style={styles.description}>{category.description}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    height: 140,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    ...shadows.card,
  },
  gradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 4,
    textAlign: 'center',
  },
  description: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 16,
  },
});