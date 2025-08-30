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
    <TouchableOpacity style={styles.menuItemCard} activeOpacity={0.9} testID={`menu-item-${item.id}`}>
      <View style={styles.cardImageContainer}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={[styles.availabilityBadge, { 
          backgroundColor: item.isAvailable !== false ? colors.success : colors.error 
        }]}>
          <Text style={styles.availabilityText}>
            {item.isAvailable !== false ? 'Available' : 'Out'}
          </Text>
        </View>
      </View>
      
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <View style={styles.itemTitleSection}>
            <Text style={styles.itemName}>{item.name}</Text>
            <View style={styles.ratingPriceRow}>
              <View style={styles.ratingContainer}>
                <Star size={12} color={colors.warning} fill={colors.warning} />
                <Text style={styles.itemRating}>{item.rating}</Text>
              </View>
              <Text style={styles.itemPrice}>${item.price}</Text>
            </View>
          </View>
          
          <View style={styles.itemActions}>
            <TouchableOpacity
              style={[styles.actionButton, { 
                backgroundColor: item.isAvailable !== false ? colors.success + '15' : colors.textLight + '15' 
              }]}
              onPress={() => toggleItemVisibility(item.id)}
            >
              {item.isAvailable !== false ? (
                <Eye size={14} color={colors.success} strokeWidth={2} />
              ) : (
                <EyeOff size={14} color={colors.textLight} strokeWidth={2} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary + '15' }]}
              onPress={() => {
                setEditingItem(item);
                setShowAddModal(true);
              }}
            >
              <Edit3 size={14} color={colors.primary} strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.error + '15' }]}
              onPress={() => deleteItem(item.id)}
            >
              <Trash2 size={14} color={colors.error} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.itemDescription} numberOfLines={1}>
          {item.description}
        </Text>
        
        <View style={styles.itemFooter}>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) + '15' }]}>
            <Text style={[styles.categoryText, { color: getCategoryColor(item.category) }]}>
              {item.category}
            </Text>
          </View>
          
          {(item.isVegetarian || item.isVegan || item.isGlutenFree) && (
            <View style={styles.dietaryTags}>
              {item.isVegetarian && (
                <View style={[styles.dietaryTag, { backgroundColor: colors.success + '15' }]}>
                  <Text style={[styles.dietaryTagText, { color: colors.success }]}>V</Text>
                </View>
              )}
              {item.isVegan && (
                <View style={[styles.dietaryTag, { backgroundColor: colors.primary + '15' }]}>
                  <Text style={[styles.dietaryTagText, { color: colors.primary }]}>VG</Text>
                </View>
              )}
              {item.isGlutenFree && (
                <View style={[styles.dietaryTag, { backgroundColor: colors.warning + '15' }]}>
                  <Text style={[styles.dietaryTagText, { color: colors.warning }]}>GF</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
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
    backgroundColor: colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.white,
    ...shadows.small,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  categoriesContainer: {
    backgroundColor: colors.white,
    paddingBottom: 4,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.backgroundLight,
  },
  categoryPillActive: {
    backgroundColor: colors.primary,
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: '600',
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
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 14,
    ...shadows.small,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
    fontWeight: '500',
  },
  menuItemCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    ...shadows.small,
    elevation: 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
  },
  cardImageContainer: {
    position: 'relative',
    width: 64,
    height: 64,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.backgroundLight,
  },
  availabilityBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  availabilityText: {
    fontSize: 8,
    fontWeight: '600',
    color: colors.white,
  },
  itemContent: {
    flex: 1,
    padding: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  itemTitleSection: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  ratingPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 3,
  },
  actionButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemDescription: {
    fontSize: 11,
    color: colors.textLight,
    lineHeight: 14,
    marginBottom: 6,
    fontWeight: '500',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  itemRating: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.warning,
  },
  categoryBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  dietaryTags: {
    flexDirection: 'row',
    gap: 4,
  },
  dietaryTag: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dietaryTagText: {
    fontSize: 8,
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