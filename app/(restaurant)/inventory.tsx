import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import {
  Package,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Search,
  Plus,
  Filter,
  Edit3,
  Trash2,
  ShoppingCart,
} from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

type InventoryStatus = 'in-stock' | 'low-stock' | 'out-of-stock' | 'overstocked';
type InventoryCategory = 'all' | 'proteins' | 'vegetables' | 'dairy' | 'grains' | 'beverages' | 'spices';

type InventoryItem = {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  costPerUnit: number;
  supplier: string;
  lastRestocked: string;
  expiryDate?: string;
  status: InventoryStatus;
};

const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Atlantic Salmon',
    category: 'proteins',
    currentStock: 15,
    minStock: 10,
    maxStock: 50,
    unit: 'lbs',
    costPerUnit: 18.50,
    supplier: 'Ocean Fresh Seafood',
    lastRestocked: '2025-01-18',
    expiryDate: '2025-01-22',
    status: 'in-stock',
  },
  {
    id: '2',
    name: 'Organic Tomatoes',
    category: 'vegetables',
    currentStock: 5,
    minStock: 15,
    maxStock: 40,
    unit: 'lbs',
    costPerUnit: 3.25,
    supplier: 'Farm Fresh Produce',
    lastRestocked: '2025-01-19',
    expiryDate: '2025-01-25',
    status: 'low-stock',
  },
  {
    id: '3',
    name: 'Wagyu Beef',
    category: 'proteins',
    currentStock: 0,
    minStock: 5,
    maxStock: 20,
    unit: 'lbs',
    costPerUnit: 85.00,
    supplier: 'Premium Meats Co',
    lastRestocked: '2025-01-15',
    status: 'out-of-stock',
  },
  {
    id: '4',
    name: 'Parmesan Cheese',
    category: 'dairy',
    currentStock: 8,
    minStock: 3,
    maxStock: 15,
    unit: 'lbs',
    costPerUnit: 12.75,
    supplier: 'Artisan Dairy',
    lastRestocked: '2025-01-17',
    expiryDate: '2025-02-15',
    status: 'in-stock',
  },
  {
    id: '5',
    name: 'Truffle Oil',
    category: 'spices',
    currentStock: 25,
    minStock: 5,
    maxStock: 15,
    unit: 'bottles',
    costPerUnit: 45.00,
    supplier: 'Gourmet Ingredients',
    lastRestocked: '2025-01-10',
    status: 'overstocked',
  },
  {
    id: '6',
    name: 'Fresh Basil',
    category: 'vegetables',
    currentStock: 2,
    minStock: 5,
    maxStock: 20,
    unit: 'bunches',
    costPerUnit: 2.50,
    supplier: 'Herb Garden Co',
    lastRestocked: '2025-01-19',
    expiryDate: '2025-01-23',
    status: 'low-stock',
  },
];

export default function InventoryScreen() {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<InventoryCategory>('all');

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [inventory, searchQuery, selectedCategory]);

  const getStatusColor = (status: InventoryStatus): string => {
    switch (status) {
      case 'in-stock':
        return colors.success;
      case 'low-stock':
        return colors.warning;
      case 'out-of-stock':
        return colors.error;
      case 'overstocked':
        return colors.primary;
      default:
        return colors.textLight;
    }
  };

  const getStatusIcon = (status: InventoryStatus) => {
    switch (status) {
      case 'in-stock':
        return Package;
      case 'low-stock':
        return TrendingDown;
      case 'out-of-stock':
        return AlertTriangle;
      case 'overstocked':
        return TrendingUp;
      default:
        return Package;
    }
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'proteins':
        return colors.error;
      case 'vegetables':
        return colors.success;
      case 'dairy':
        return colors.warning;
      case 'grains':
        return colors.secondary;
      case 'beverages':
        return colors.primary;
      case 'spices':
        return colors.accent;
      default:
        return colors.textLight;
    }
  };

  const handleRestock = (item: InventoryItem) => {
    Alert.alert(
      'Restock Item',
      `Restock ${item.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restock',
          onPress: () => {
            const restockAmount = item.maxStock - item.currentStock;
            setInventory(prev => prev.map(inv => 
              inv.id === item.id 
                ? { 
                    ...inv, 
                    currentStock: item.maxStock,
                    status: 'in-stock' as InventoryStatus,
                    lastRestocked: new Date().toISOString().split('T')[0]
                  }
                : inv
            ));
            Alert.alert('Success', `Restocked ${restockAmount} ${item.unit} of ${item.name}`);
          },
        },
      ]
    );
  };

  const categories = [
    { key: 'all' as InventoryCategory, label: 'All Items' },
    { key: 'proteins' as InventoryCategory, label: 'Proteins' },
    { key: 'vegetables' as InventoryCategory, label: 'Vegetables' },
    { key: 'dairy' as InventoryCategory, label: 'Dairy' },
    { key: 'grains' as InventoryCategory, label: 'Grains' },
    { key: 'beverages' as InventoryCategory, label: 'Beverages' },
    { key: 'spices' as InventoryCategory, label: 'Spices' },
  ];

  const getInventoryStats = () => {
    return {
      total: inventory.length,
      inStock: inventory.filter(item => item.status === 'in-stock').length,
      lowStock: inventory.filter(item => item.status === 'low-stock').length,
      outOfStock: inventory.filter(item => item.status === 'out-of-stock').length,
      overstocked: inventory.filter(item => item.status === 'overstocked').length,
    };
  };

  const stats = getInventoryStats();

  const CategoryPill = ({ category }: { category: { key: InventoryCategory; label: string } }) => (
    <TouchableOpacity
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
  );

  const InventoryCard = ({ item }: { item: InventoryItem }) => {
    const StatusIcon = getStatusIcon(item.status);
    const statusColor = getStatusColor(item.status);
    const categoryColor = getCategoryColor(item.category);
    const stockPercentage = (item.currentStock / item.maxStock) * 100;

    return (
      <TouchableOpacity 
        style={[
          styles.inventoryCard,
          { borderLeftColor: statusColor }
        ]} 
        activeOpacity={0.95}
        testID={`inventory-${item.id}`}
      >
        <View style={styles.cardHeader}>
          <View style={styles.itemLeft}>
            <View style={[styles.statusIcon, { backgroundColor: statusColor + '15' }]}>
              <StatusIcon size={20} color={statusColor} strokeWidth={2.5} />
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '15' }]}>
                <Text style={[styles.categoryText, { color: categoryColor }]}>
                  {item.category}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.itemActions}>
            <TouchableOpacity style={styles.editButton}>
              <Edit3 size={16} color={colors.primary} strokeWidth={2.5} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton}>
              <Trash2 size={16} color={colors.error} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.stockInfo}>
          <View style={styles.stockNumbers}>
            <Text style={styles.currentStock}>
              {item.currentStock} {item.unit}
            </Text>
            <Text style={styles.stockRange}>
              Min: {item.minStock} • Max: {item.maxStock}
            </Text>
          </View>
          <View style={styles.stockBar}>
            <View 
              style={[
                styles.stockFill, 
                { 
                  width: `${Math.min(stockPercentage, 100)}%`,
                  backgroundColor: statusColor 
                }
              ]} 
            />
          </View>
        </View>

        <View style={styles.itemDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Cost per unit:</Text>
            <Text style={styles.detailValue}>${item.costPerUnit}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Supplier:</Text>
            <Text style={styles.detailValue} numberOfLines={1}>{item.supplier}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Last restocked:</Text>
            <Text style={styles.detailValue}>{item.lastRestocked}</Text>
          </View>
          {item.expiryDate && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Expires:</Text>
              <Text style={[styles.detailValue, { color: colors.error }]}>{item.expiryDate}</Text>
            </View>
          )}
        </View>

        <View style={styles.cardFooter}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {item.status.replace('-', ' ').toUpperCase()}
            </Text>
          </View>
          
          {(item.status === 'low-stock' || item.status === 'out-of-stock') && (
            <TouchableOpacity
              style={[styles.restockButton, { backgroundColor: colors.primary }]}
              onPress={() => handleRestock(item)}
            >
              <ShoppingCart size={14} color={colors.white} strokeWidth={2.5} />
              <Text style={styles.restockButtonText}>Restock</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.white, colors.backgroundLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View>
          <Text style={styles.title}>Inventory</Text>
          <Text style={styles.subtitle}>{filteredInventory.length} items tracked</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.filterIcon} testID="inventory-filter-btn">
            <Filter size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} testID="inventory-add-btn" activeOpacity={0.9}>
            <Plus size={20} color={colors.white} />
            <Text style={styles.addButtonText}>Add Item</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search inventory..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textLight}
          />
        </View>
      </View>

      <View style={styles.statsSection}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.inStock}</Text>
            <Text style={styles.statLabel}>In Stock</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.warning }]}>{stats.lowStock}</Text>
            <Text style={styles.statLabel}>Low Stock</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.error }]}>{stats.outOfStock}</Text>
            <Text style={styles.statLabel}>Out of Stock</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{stats.overstocked}</Text>
            <Text style={styles.statLabel}>Overstocked</Text>
          </View>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <CategoryPill key={category.key} category={category} />
        ))}
      </ScrollView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.inventoryList}>
          {filteredInventory.length > 0 ? (
            filteredInventory.map((item) => (
              <InventoryCard key={item.id} item={item} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Package size={48} color={colors.textLight} />
              <Text style={styles.emptyStateText}>No inventory items found</Text>
              <Text style={styles.emptyStateSubtext}>
                Try adjusting your search or category filter
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
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
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 6,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.secondary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
    elevation: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 8,
    ...shadows.card,
    elevation: 8,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 14,
  },
  searchContainer: {
    paddingHorizontal: 28,
    paddingVertical: 20,
    backgroundColor: colors.white,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    ...shadows.card,
    elevation: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  statsSection: {
    paddingHorizontal: 28,
    paddingVertical: 20,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 32,
    padding: 28,
    ...shadows.large,
    elevation: 18,
    borderTopWidth: 6,
    borderTopColor: colors.primary,
    borderWidth: 0,
    transform: [{ scale: 1 }],
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.success,
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 6,
    fontWeight: '700',
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  categoriesContainer: {
    backgroundColor: colors.white,
    paddingBottom: 8,
  },
  categoriesContent: {
    paddingHorizontal: 28,
    paddingVertical: 16,
    gap: 12,
  },
  categoryPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
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
    fontSize: 14,
    fontWeight: '700',
    color: colors.textLight,
  },
  categoryPillTextActive: {
    color: colors.white,
    fontWeight: '800',
  },
  scrollView: {
    flex: 1,
  },
  inventoryList: {
    paddingHorizontal: 28,
    paddingBottom: 32,
  },
  inventoryCard: {
    backgroundColor: colors.white,
    borderRadius: 32,
    padding: 32,
    marginBottom: 32,
    ...shadows.large,
    elevation: 18,
    borderWidth: 0,
    borderLeftWidth: 6,
    transform: [{ scale: 1 }],
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  itemLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.error + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stockInfo: {
    marginBottom: 16,
  },
  stockNumbers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  currentStock: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  stockRange: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '600',
  },
  stockBar: {
    height: 6,
    backgroundColor: colors.backgroundLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  stockFill: {
    height: '100%',
    borderRadius: 3,
  },
  itemDetails: {
    marginBottom: 16,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  restockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
    ...shadows.small,
    elevation: 4,
  },
  restockButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
});