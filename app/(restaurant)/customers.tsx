import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import {
  Users,
  Search,
  Plus,
  Filter,
  Star,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Gift,
  TrendingUp,
  Heart,
  MessageSquare,
} from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

type CustomerTier = 'bronze' | 'silver' | 'gold' | 'platinum';
type CustomerStatus = 'active' | 'inactive' | 'vip';

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  address?: string;
  joinDate: string;
  lastVisit: string;
  totalVisits: number;
  totalSpent: number;
  averageSpent: number;
  tier: CustomerTier;
  status: CustomerStatus;
  loyaltyPoints: number;
  favoriteItems: string[];
  notes?: string;
  birthday?: string;
  preferences: string[];
};

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    address: '123 Oak Street, Miami, FL',
    joinDate: '2023-03-15',
    lastVisit: '2025-01-18',
    totalVisits: 24,
    totalSpent: 2840,
    averageSpent: 118,
    tier: 'gold',
    status: 'vip',
    loyaltyPoints: 1420,
    favoriteItems: ['Grilled Salmon', 'Caesar Salad', 'Key Lime Pie'],
    notes: 'Prefers window tables, allergic to shellfish',
    birthday: '1985-07-22',
    preferences: ['Seafood', 'Vegetarian Options', 'Wine Pairing'],
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '+1 (555) 987-6543',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    address: '456 Pine Avenue, Miami, FL',
    joinDate: '2023-08-10',
    lastVisit: '2025-01-19',
    totalVisits: 15,
    totalSpent: 1680,
    averageSpent: 112,
    tier: 'silver',
    status: 'active',
    loyaltyPoints: 840,
    favoriteItems: ['Wagyu Beef Sliders', 'Truffle Mac & Cheese'],
    preferences: ['Meat Dishes', 'Craft Cocktails'],
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    phone: '+1 (555) 456-7890',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    address: '789 Maple Drive, Miami, FL',
    joinDate: '2024-01-20',
    lastVisit: '2025-01-15',
    totalVisits: 8,
    totalSpent: 720,
    averageSpent: 90,
    tier: 'bronze',
    status: 'active',
    loyaltyPoints: 360,
    favoriteItems: ['Farm Fresh Salad', 'Chocolate Lava Cake'],
    birthday: '1992-11-15',
    preferences: ['Vegetarian', 'Desserts', 'Healthy Options'],
  },
  {
    id: '4',
    name: 'David Thompson',
    email: 'david.thompson@email.com',
    phone: '+1 (555) 321-0987',
    joinDate: '2022-11-05',
    lastVisit: '2024-12-20',
    totalVisits: 45,
    totalSpent: 5400,
    averageSpent: 120,
    tier: 'platinum',
    status: 'inactive',
    loyaltyPoints: 2700,
    favoriteItems: ['Lobster Bisque', 'Signature Manhattan', 'Wagyu Steak'],
    notes: 'Business dinners, prefers private dining',
    preferences: ['Premium Dishes', 'Wine Selection', 'Private Dining'],
  },
];

type CustomerFilter = 'all' | 'active' | 'inactive' | 'vip';

export default function CustomersScreen() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<CustomerFilter>('all');

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           customer.phone.includes(searchQuery);
      const matchesFilter = selectedFilter === 'all' || customer.status === selectedFilter;
      return matchesSearch && matchesFilter;
    });
  }, [customers, searchQuery, selectedFilter]);

  const getTierColor = (tier: CustomerTier): string => {
    switch (tier) {
      case 'bronze':
        return '#CD7F32';
      case 'silver':
        return '#C0C0C0';
      case 'gold':
        return '#FFD700';
      case 'platinum':
        return '#E5E4E2';
      default:
        return colors.textLight;
    }
  };

  const getStatusColor = (status: CustomerStatus): string => {
    switch (status) {
      case 'active':
        return colors.success;
      case 'inactive':
        return colors.textLight;
      case 'vip':
        return colors.primary;
      default:
        return colors.textLight;
    }
  };

  const handleContactCustomer = (customer: Customer, method: 'phone' | 'email' | 'message') => {
    Alert.alert(
      'Contact Customer',
      `Contact ${customer.name} via ${method}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Contact',
          onPress: () => {
            console.log(`Contacting ${customer.name} via ${method}`);
            Alert.alert('Success', `Contacting ${customer.name} via ${method}`);
          },
        },
      ]
    );
  };

  const FilterButton = ({ filter, label, count }: { 
    filter: CustomerFilter; 
    label: string; 
    count: number;
  }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.filterButtonActive,
      ]}
      onPress={() => setSelectedFilter(filter)}
      testID={`filter-${filter}`}
    >
      <Text
        style={[
          styles.filterButtonText,
          selectedFilter === filter && styles.filterButtonTextActive,
        ]}
      >
        {label} ({count})
      </Text>
    </TouchableOpacity>
  );

  const CustomerCard = ({ customer }: { customer: Customer }) => {
    const tierColor = getTierColor(customer.tier);
    const statusColor = getStatusColor(customer.status);

    return (
      <TouchableOpacity 
        style={[
          styles.customerCard,
          { borderLeftColor: statusColor }
        ]} 
        activeOpacity={0.95}
        testID={`customer-${customer.id}`}
      >
        <View style={styles.cardHeader}>
          <View style={styles.customerLeft}>
            <View style={styles.avatarContainer}>
              {customer.avatar ? (
                <Image source={{ uri: customer.avatar }} style={styles.customerAvatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Users size={24} color={colors.white} strokeWidth={2.5} />
                </View>
              )}
              <View style={[styles.tierBadge, { backgroundColor: tierColor }]}>
                <Text style={styles.tierText}>{customer.tier.charAt(0).toUpperCase()}</Text>
              </View>
            </View>
            <View style={styles.customerInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.customerName}>{customer.name}</Text>
                {customer.status === 'vip' && (
                  <View style={styles.vipBadge}>
                    <Star size={12} color={colors.warning} fill={colors.warning} />
                    <Text style={styles.vipText}>VIP</Text>
                  </View>
                )}
              </View>
              <Text style={styles.customerEmail}>{customer.email}</Text>
              <Text style={styles.customerPhone}>{customer.phone}</Text>
            </View>
          </View>
          <View style={styles.customerActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleContactCustomer(customer, 'phone')}
            >
              <Phone size={16} color={colors.primary} strokeWidth={2.5} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleContactCustomer(customer, 'email')}
            >
              <Mail size={16} color={colors.secondary} strokeWidth={2.5} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleContactCustomer(customer, 'message')}
            >
              <MessageSquare size={16} color={colors.accent} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardStatsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{customer.totalVisits}</Text>
            <Text style={styles.statLabel}>Visits</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>${customer.totalSpent.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>${customer.averageSpent}</Text>
            <Text style={styles.statLabel}>Avg. Spend</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{customer.loyaltyPoints}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
        </View>

        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Calendar size={14} color={colors.textLight} strokeWidth={2} />
            <Text style={styles.detailText}>Last visit: {customer.lastVisit}</Text>
          </View>
          {customer.address && (
            <View style={styles.detailRow}>
              <MapPin size={14} color={colors.textLight} strokeWidth={2} />
              <Text style={styles.detailText} numberOfLines={1}>{customer.address}</Text>
            </View>
          )}
          {customer.birthday && (
            <View style={styles.detailRow}>
              <Gift size={14} color={colors.warning} strokeWidth={2} />
              <Text style={styles.detailText}>Birthday: {customer.birthday}</Text>
            </View>
          )}
        </View>

        {customer.favoriteItems.length > 0 && (
          <View style={styles.favoritesSection}>
            <View style={styles.favoritesHeader}>
              <Heart size={14} color={colors.error} strokeWidth={2} />
              <Text style={styles.favoritesLabel}>Favorite Items</Text>
            </View>
            <View style={styles.favoritesList}>
              {customer.favoriteItems.slice(0, 3).map((item, index) => (
                <View key={index} style={styles.favoriteItem}>
                  <Text style={styles.favoriteItemText}>{item}</Text>
                </View>
              ))}
              {customer.favoriteItems.length > 3 && (
                <Text style={styles.moreFavorites}>+{customer.favoriteItems.length - 3} more</Text>
              )}
            </View>
          </View>
        )}

        {customer.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Notes:</Text>
            <Text style={styles.notesText}>{customer.notes}</Text>
          </View>
        )}

        <View style={styles.cardFooter}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {customer.status.toUpperCase()}
            </Text>
          </View>
          <View style={[styles.tierBadgeFooter, { backgroundColor: tierColor + '20' }]}>
            <Text style={[styles.tierTextFooter, { color: tierColor }]}>
              {customer.tier.toUpperCase()} TIER
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const getFilterCounts = () => {
    return {
      all: customers.length,
      active: customers.filter(c => c.status === 'active').length,
      inactive: customers.filter(c => c.status === 'inactive').length,
      vip: customers.filter(c => c.status === 'vip').length,
    };
  };

  const getCustomerStats = () => {
    return {
      total: customers.length,
      totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
      averageSpend: customers.reduce((sum, c) => sum + c.averageSpent, 0) / customers.length,
      totalVisits: customers.reduce((sum, c) => sum + c.totalVisits, 0),
    };
  };

  const filterCounts = getFilterCounts();
  const stats = getCustomerStats();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.white, colors.backgroundLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View>
          <Text style={styles.title}>Customers</Text>
          <Text style={styles.subtitle}>{filteredCustomers.length} customers</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.filterIcon} testID="customers-filter-btn">
            <Filter size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} testID="customers-add-btn" activeOpacity={0.9}>
            <Plus size={20} color={colors.white} />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search customers..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textLight}
          />
        </View>
      </View>

      <View style={styles.statsSection}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <TrendingUp size={16} color={colors.primary} strokeWidth={2.5} />
            <Text style={styles.statNumber}>${stats.totalRevenue.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Revenue</Text>
          </View>
          <View style={styles.statItem}>
            <Users size={16} color={colors.success} strokeWidth={2.5} />
            <Text style={styles.statNumber}>{stats.totalVisits}</Text>
            <Text style={styles.statLabel}>Total Visits</Text>
          </View>
          <View style={styles.statItem}>
            <Star size={16} color={colors.warning} strokeWidth={2.5} />
            <Text style={styles.statNumber}>${Math.round(stats.averageSpend)}</Text>
            <Text style={styles.statLabel}>Avg. Spend</Text>
          </View>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        <FilterButton filter="all" label="All" count={filterCounts.all} />
        <FilterButton filter="active" label="Active" count={filterCounts.active} />
        <FilterButton filter="vip" label="VIP" count={filterCounts.vip} />
        <FilterButton filter="inactive" label="Inactive" count={filterCounts.inactive} />
      </ScrollView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.customersList}>
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <CustomerCard key={customer.id} customer={customer} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Users size={48} color={colors.textLight} />
              <Text style={styles.emptyStateText}>No customers found</Text>
              <Text style={styles.emptyStateSubtext}>
                Try adjusting your search or filter
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
    gap: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '700',
    textAlign: 'center',
  },
  filterContainer: {
    paddingLeft: 28,
    marginBottom: 24,
  },
  filterContent: {
    paddingRight: 20,
  },
  filterButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: colors.white,
    marginRight: 12,
    borderWidth: 0,
    ...shadows.card,
    elevation: 6,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    ...shadows.large,
    elevation: 8,
  },
  filterButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  filterButtonTextActive: {
    color: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  customersList: {
    paddingHorizontal: 28,
    paddingBottom: 32,
  },
  customerCard: {
    backgroundColor: colors.white,
    borderRadius: 36,
    padding: 32,
    marginBottom: 32,
    ...shadows.large,
    elevation: 20,
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
  customerLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  customerAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: colors.white,
    ...shadows.card,
    elevation: 8,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
    elevation: 8,
  },
  tierBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  tierText: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.white,
  },
  customerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  customerName: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.text,
    marginRight: 12,
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  vipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '15',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 4,
  },
  vipText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.warning,
  },
  customerEmail: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 4,
    fontWeight: '600',
  },
  customerPhone: {
    fontSize: 16,
    color: colors.textLight,
    fontWeight: '600',
  },
  customerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
    elevation: 4,
  },
  cardStatsSection: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundLight,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailsSection: {
    marginBottom: 16,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500',
    flex: 1,
  },
  favoritesSection: {
    marginBottom: 16,
  },
  favoritesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  favoritesLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  favoritesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  favoriteItem: {
    backgroundColor: colors.primary + '10',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  favoriteItemText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  moreFavorites: {
    fontSize: 12,
    color: colors.textLight,
    fontStyle: 'italic',
    alignSelf: 'center',
  },
  notesSection: {
    backgroundColor: colors.accent + '10',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
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
  tierBadgeFooter: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tierTextFooter: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
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