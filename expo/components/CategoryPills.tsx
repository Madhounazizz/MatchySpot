import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';

type Category = {
  id: string;
  name: string;
  icon?: React.ReactNode;
};

type CategoryPillsProps = {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  containerStyle?: object;
};

export default function CategoryPills({
  categories,
  selectedCategory,
  onSelectCategory,
  containerStyle,
}: CategoryPillsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.container, containerStyle]}
    >
      {categories.map((category) => {
        const isSelected = category.id === selectedCategory;
        
        return (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.pill,
              isSelected && styles.selectedPill,
            ]}
            onPress={() => onSelectCategory(category.id)}
            activeOpacity={0.7}
          >
            {category.icon && <View style={styles.iconContainer}>{category.icon}</View>}
            <Text
              style={[
                styles.pillText,
                isSelected && styles.selectedPillText,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedPill: {
    backgroundColor: colors.primary,
  },
  iconContainer: {
    marginRight: 6,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textLight,
  },
  selectedPillText: {
    color: colors.white,
  },
});