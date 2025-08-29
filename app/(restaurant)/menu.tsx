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
    <TouchableOpacity style={styles.menuItemCard} activeOpacity={0.95} testID={`menu-item-${item.id}`}>
      <View style={styles.cardImageContainer}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.imageOverlay}>
          <View style={[styles.availabilityBadge, { 
            backgroundColor: item.isAvailable !== false ? colors.success : colors.error 
          }]}>
            <Text style={styles.availabilityText}>
              {item.isAvailable !== false ? 'Available' : 'Unavailable'}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <View style={styles.itemTitleSection}>
            <Text style={styles.itemName}>{item.name}</Text>
            <View style={styles.ratingPriceRow}>
              <View style={styles.ratingContainer}>
                <Star size={16} color={colors.warning} fill={colors.warning} />
                <Text style={styles.itemRating}>{item.rating}</Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.itemPrice}>${item.price}</Text>
              </View>
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
                <Eye size={18} color={colors.success} strokeWidth={2.5} />
              ) : (
                <EyeOff size={18} color={colors.textLight} strokeWidth={2.5} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary + '15' }]}
              onPress={() => {
                setEditingItem(item);
                setShowAddModal(true);
              }}
            >
              <Edit3 size={18} color={colors.primary} strokeWidth={2.5} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.error + '15' }]}
              onPress={() => deleteItem(item.id)}
            >
              <Trash2 size={18} color={colors.error} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.itemDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.itemFooter}>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) + '12' }]}>
            <Text style={[styles.categoryText, { color: getCategoryColor(item.category) }]}>
              {item.category}
            </Text>
          </View>
          
          {(item.isVegetarian || item.isVegan || item.isGlutenFree) && (
            <View style={styles.dietaryTags}>
              {item.isVegetarian && (
                <View style={[styles.dietaryTag, { backgroundColor: colors.success + '12' }]}>
                  <Text style={[styles.dietaryTagText, { color: colors.success }]}>V</Text>
                </View>
              )}
              {item.isVegan && (
                <View style={[styles.dietaryTag, { backgroundColor: colors.primary + '12' }]}>
                  <Text style={[styles.dietaryTagText, { color: colors.primary }]}>VG</Text>
                </View>
              )}
              {item.isGlutenFree && (
                <View style={[styles.dietaryTag, { backgroundColor: colors.warning + '12' }]}>
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
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 32,
    backgroundColor: colors.white,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    ...shadows.large,
    elevation: 12,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -1.5,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 20,
    gap: 10,
    ...shadows.card,
    elevation: 8,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 16,
  },
  searchContainer: {
    paddingHorizontal: 28,
    paddingVertical: 24,
    backgroundColor: colors.white,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 18,
    gap: 16,
    ...shadows.card,
    elevation: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    color: colors.text,
    fontWeight: '600',
  },
  categoriesContainer: {
    backgroundColor: colors.white,
    paddingBottom: 8,
  },
  categoriesContent: {
    paddingHorizontal: 28,
    paddingVertical: 20,
    gap: 12,
  },
  categoryPill: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: colors.white,
    borderWidth: 0,
    ...shadows.card,
    elevation: 6,
  },
  categoryPillActive: {
    backgroundColor: colors.primary,
    ...shadows.large,
    elevation: 8,
  },
  categoryPillText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textLight,
  },
  categoryPillTextActive: {
    color: colors.white,
    fontWeight: '800',
  },
  menuList: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 28,
    paddingVertical: 24,
    gap: 32,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: -0.8,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
    fontWeight: '700',
  },
  menuItemCard: {
    backgroundColor: colors.white,
    marginHorizontal: 28,
    marginBottom: 32,
    borderRadius: 36,
    ...shadows.large,
    elevation: 18,
    overflow: 'hidden',
    borderWidth: 0,
    transform: [{ scale: 1 }],
    position: 'relative',
  },
  cardImageContainer: {
    position: 'relative',
    height: 220,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.backgroundLight,
  },
  imageOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  availabilityBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    ...shadows.medium,
    elevation: 6,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemContent: {
    padding: 32,
  },
  itemHeader: {
    marginBottom: 16,
  },
  itemTitleSection: {
    marginBottom: 16,
  },
  itemName: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 16,
    letterSpacing: -0.7,
    lineHeight: 32,
  },
  ratingPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.large,
    elevation: 10,
    transform: [{ scale: 1 }],
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  itemDescription: {
    fontSize: 16,
    color: colors.textLight,
    lineHeight: 24,
    marginBottom: 20,
    fontWeight: '500',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    backgroundColor: colors.success + '15',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.success + '25',
    ...shadows.small,
    elevation: 4,
  },
  itemPrice: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.success,
    letterSpacing: -0.5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.warning + '15',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.warning + '25',
    ...shadows.small,
    elevation: 4,
  },
  itemRating: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.warning,
  },
  categoryBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'transparent',
    ...shadows.small,
    elevation: 3,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'capitalize',
    letterSpacing: 0.3,
  },
  dietaryTags: {
    flexDirection: 'row',
    gap: 8,
  },
  dietaryTag: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    ...shadows.small,
    elevation: 3,
  },
  dietaryTagText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.2,
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