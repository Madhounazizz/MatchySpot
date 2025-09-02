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
import { router } from 'expo-router';

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

  const InventoryCard = ({ item }: { item: InventoryItem }) => {
    const StatusIcon = getStatusIcon(item.status);
    const statusColor = getStatusColor(item.status);
    const categoryColor = getCategoryColor(item.category);
    const stockPercentage = (item.currentStock / item.maxStock) * 100;

    return (
      <TouchableOpacity 
        style={styles.inventoryCard} 
        activeOpacity={0.9}
        testID={`inventory-${item.id}`}
      >
        <View style={styles.cardHeader}>
          <View style={styles.itemLeft}>
            <View style={[styles.statusIcon, { backgroundColor: statusColor + '15' }]}>
              <StatusIcon size={16} color={statusColor} strokeWidth={2} />
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
            <Text style={styles.currentStock}>
              {item.currentStock} {item.unit}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
              <Text style={[styles.statusText, { color: statusColor }]}>
                {item.status === 'low-stock' ? 'Low' : 
                 item.status === 'out-of-stock' ? 'Out' :
                 item.status === 'overstocked' ? 'Over' : 'OK'}
              </Text>
            </View>
          </View>
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

        <View style={styles.itemDetails}>
          <Text style={styles.detailText}>
            ${item.costPerUnit}/{item.unit} • {item.supplier}
          </Text>
          {item.expiryDate && (
            <Text style={[styles.detailText, { color: colors.error }]}>
              Expires: {item.expiryDate}
            </Text>
          )}
          <View style={styles.inventoryMetrics}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Value:</Text>
              <Text style={styles.metricValue}>${(item.currentStock * item.costPerUnit).toFixed(0)}</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Usage:</Text>
              <Text style={styles.metricValue}>High</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <TouchableOpacity style={styles.editButton}>
            <Edit3 size={14} color={colors.primary} strokeWidth={2} />
          </TouchableOpacity>
          
          {(item.status === 'low-stock' || item.status === 'out-of-stock') && (
            <TouchableOpacity
              style={[styles.restockButton, { backgroundColor: colors.primary }]}
              onPress={() => handleRestock(item)}
            >
              <ShoppingCart size={12} color={colors.white} strokeWidth={2} />
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
          <TouchableOpacity 
            style={styles.addButton} 
            testID="inventory-add-btn" 
            activeOpacity={0.9}
            onPress={() => router.push('/(restaurant)/add-inventory')}
          >
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

      <View style={styles.filterTabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabsContent}
        >
          {categories.map((category) => {
            const count = category.key === 'all' 
              ? inventory.length 
              : inventory.filter(item => item.category === category.key).length;
            return (
              <TouchableOpacity
                key={category.key}
                style={[
                  styles.filterTab,
                  selectedCategory === category.key && styles.filterTabActive,
                ]}
                onPress={() => setSelectedCategory(category.key)}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    selectedCategory === category.key && styles.filterTabTextActive,
                  ]}
                >
                  {category.label} ({count})
                </Text>
                {selectedCategory === category.key && <View style={styles.filterTabIndicator} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

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
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 2,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
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
  statsSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 10,
    ...shadows.small,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.success,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textLight,
    marginTop: 3,
    fontWeight: '500',
    textAlign: 'center',
  },
  filterTabsContainer: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterTabsContent: {
    paddingHorizontal: 16,
    gap: 24,
  },
  filterTab: {
    paddingVertical: 8,
    position: 'relative',
  },
  filterTabActive: {
    // Active state handled by indicator
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textLight,
  },
  filterTabTextActive: {
    color: '#FF7060',
    fontWeight: '600',
  },
  filterTabIndicator: {
    position: 'absolute',
    bottom: -8,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#FF7060',
    borderRadius: 1,
  },
  scrollView: {
    flex: 1,
  },
  inventoryList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  inventoryCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    ...shadows.small,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  statusIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  categoryBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  itemActions: {
    alignItems: 'flex-end',
    gap: 4,
  },
  editButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentStock: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  stockBar: {
    height: 3,
    backgroundColor: colors.backgroundLight,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  stockFill: {
    height: '100%',
    borderRadius: 2,
  },
  itemDetails: {
    marginBottom: 6,
  },
  detailText: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '500',
    marginBottom: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '600',
  },
  restockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 3,
  },
  restockButtonText: {
    fontSize: 9,
    fontWeight: '600',
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
  inventoryMetrics: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  metricLabel: {
    fontSize: 9,
    color: colors.textLight,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 9,
    color: colors.text,
    fontWeight: '600',
  },
});