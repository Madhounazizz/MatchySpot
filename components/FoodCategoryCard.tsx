import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, shadows } from '@/constants/colors';

const { width } = Dimensions.get('window');
const cardWidth = (width - 56) / 2;

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
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={[category.color, category.color + 'CC', category.color + '80']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.overlay} />
        <View style={styles.content}>
          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>{category.emoji}</Text>
          </View>
          <Text style={styles.name}>{category.name}</Text>
          <Text style={styles.description}>{category.description}</Text>
        </View>
        <View style={styles.decorativeCircle} />
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    height: 150,
    marginBottom: 16,
    borderRadius: 24,
    overflow: 'hidden',
    ...shadows.medium,
  },
  gradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  content: {
    alignItems: 'center',
    zIndex: 2,
  },
  emojiContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  emoji: {
    fontSize: 24,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 4,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  description: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.95,
    textAlign: 'center',
    lineHeight: 16,
    fontWeight: '500',
  },
  decorativeCircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -20,
    right: -20,
    zIndex: 1,
  },
});