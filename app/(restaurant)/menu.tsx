import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Filter,
  Star,
  DollarSign,
  Eye,
  EyeOff,
} from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import { menuItems, MenuItem } from '@/mocks/menu';


type MenuCategory = 'all' | 'appetizer' | 'main' | 'dessert' | 'drink';

export default function MenuManagement() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [menuData, setMenuData] = useState<MenuItem[]>(menuItems);

  const categories: { key: MenuCategory; label: string }[] = [
    { key: 'all', label: 'All Items' },
    { key: 'appetizer', label: 'Appetizers' },
    { key: 'main', label: 'Main Courses' },
    { key: 'dessert', label: 'Desserts' },
    { key: 'drink', label: 'Drinks' },
  ];

  const filteredItems = menuData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItemVisibility = (itemId: string) => {
    setMenuData(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, isAvailable: !item.isAvailable }
        : item
    ));
  };

  const deleteItem = (itemId: string) => {
    Alert.alert(
      'Delete Menu Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setMenuData(prev => prev.filter(item => item.id !== itemId));
          },
        },
      ]
    );
  };

  const MenuItemCard = ({ item }: { item: MenuItem }) => (
    <View style={styles.menuItemCard}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemName}>{item.name}</Text>
          <View style={styles.itemActions}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary + '15' }]}
              onPress={() => toggleItemVisibility(item.id)}
            >
              {item.isAvailable !== false ? (
                <Eye size={16} color={colors.primary} />
              ) : (
                <EyeOff size={16} color={colors.textLight} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.warning + '15' }]}
              onPress={() => {
                setEditingItem(item);
                setShowAddModal(true);
              }}
            >
              <Edit3 size={16} color={colors.warning} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.error + '15' }]}
              onPress={() => deleteItem(item.id)}
            >
              <Trash2 size={16} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.itemDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.itemFooter}>
          <View style={styles.priceContainer}>
            <DollarSign size={16} color={colors.success} />
            <Text style={styles.itemPrice}>${item.price}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Star size={14} color={colors.accent} fill={colors.accent} />
            <Text style={styles.itemRating}>{item.rating}</Text>
          </View>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) + '15' }]}>
            <Text style={[styles.categoryText, { color: getCategoryColor(item.category) }]}>
              {item.category}
            </Text>
          </View>
        </View>
        {(item.isVegetarian || item.isVegan || item.isGlutenFree) && (
          <View style={styles.dietaryTags}>
            {item.isVegetarian && (
              <View style={[styles.dietaryTag, { backgroundColor: colors.success + '15' }]}>
                <Text style={[styles.dietaryTagText, { color: colors.success }]}>Vegetarian</Text>
              </View>
            )}
            {item.isVegan && (
              <View style={[styles.dietaryTag, { backgroundColor: colors.primary + '15' }]}>
                <Text style={[styles.dietaryTagText, { color: colors.primary }]}>Vegan</Text>
              </View>
            )}
            {item.isGlutenFree && (
              <View style={[styles.dietaryTag, { backgroundColor: colors.warning + '15' }]}>
                <Text style={[styles.dietaryTagText, { color: colors.warning }]}>Gluten-Free</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Menu Management</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setEditingItem(null);
            setShowAddModal(true);
          }}
        >
          <Plus size={20} color={colors.white} />
          <Text style={styles.addButtonText}>Add Item</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search menu items..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textLight}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.key}
            style={[
              styles.categoryPill,
              selectedCategory === category.key && styles.categoryPillActive,
            ]}
            onPress={() => setSelectedCategory(category.key)}
          >
            <Text
              style={[
                styles.categoryPillText,
                selectedCategory === category.key && styles.categoryPillTextActive,
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{menuData.length}</Text>
            <Text style={styles.statLabel}>Total Items</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{menuData.filter(item => item.isAvailable !== false).length}</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{filteredItems.length}</Text>
            <Text style={styles.statLabel}>Showing</Text>
          </View>
        </View>

        {filteredItems.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}

        {filteredItems.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No menu items found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your search or category filter
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function getCategoryColor(category: string): string {
  switch (category) {
    case 'appetizer':
      return colors.primary;
    case 'main':
      return colors.success;
    case 'dessert':
      return colors.accent;
    case 'drink':
      return colors.warning;
    default:
      return colors.textLight;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: colors.white,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    ...shadows.large,
    elevation: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 8,
    ...shadows.small,
    elevation: 3,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: colors.white,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    ...shadows.small,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  categoriesContainer: {
    backgroundColor: colors.white,
    paddingBottom: 8,
  },
  categoriesContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 10,
  },
  categoryPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: colors.white,
    borderWidth: 0,
    ...shadows.small,
    elevation: 2,
  },
  categoryPillActive: {
    backgroundColor: colors.primary,
    ...shadows.card,
    elevation: 4,
  },
  categoryPillText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textLight,
  },
  categoryPillTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  menuList: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  menuItemCard: {
    backgroundColor: colors.white,
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 24,
    ...shadows.card,
    elevation: 6,
    overflow: 'hidden',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  itemImage: {
    width: '100%',
    height: 160,
    backgroundColor: colors.backgroundLight,
  },
  itemContent: {
    padding: 24,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    flex: 1,
    marginRight: 16,
    letterSpacing: -0.3,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemDescription: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
    marginBottom: 12,
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  itemPrice: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.success,
    letterSpacing: -0.3,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  itemRating: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  dietaryTags: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  dietaryTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  dietaryTagText: {
    fontSize: 10,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textLight,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
});