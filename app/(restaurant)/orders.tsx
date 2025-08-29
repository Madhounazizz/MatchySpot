import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import {
  Clock,
  CheckCircle,
  AlertCircle,
  ChefHat,
  Utensils,
  DollarSign,
  Users,
  Filter,
  Plus,
  Eye,
} from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
type OrderPriority = 'low' | 'medium' | 'high';

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
};

type Order = {
  id: string;
  tableNumber: string;
  customerName?: string;
  items: OrderItem[];
  status: OrderStatus;
  priority: OrderPriority;
  orderTime: string;
  estimatedTime: number;
  totalAmount: number;
  notes?: string;
  waiterId?: string;
  waiterName?: string;
};

const mockOrders: Order[] = [
  {
    id: '1',
    tableNumber: 'T12',
    customerName: 'Sarah Johnson',
    items: [
      { id: '1', name: 'Grilled Salmon', quantity: 2, price: 28 },
      { id: '2', name: 'Caesar Salad', quantity: 1, price: 16 },
      { id: '3', name: 'Wine - Chardonnay', quantity: 1, price: 12 },
    ],
    status: 'preparing',
    priority: 'high',
    orderTime: '19:15',
    estimatedTime: 25,
    totalAmount: 84,
    notes: 'No onions in salad',
    waiterId: '3',
    waiterName: 'Alex Thompson',
  },
  {
    id: '2',
    tableNumber: 'T08',
    customerName: 'Michael Chen',
    items: [
      { id: '4', name: 'Wagyu Beef Sliders', quantity: 1, price: 24 },
      { id: '5', name: 'Truffle Mac & Cheese', quantity: 1, price: 18 },
    ],
    status: 'ready',
    priority: 'medium',
    orderTime: '19:30',
    estimatedTime: 15,
    totalAmount: 42,
    waiterId: '3',
    waiterName: 'Alex Thompson',
  },
  {
    id: '3',
    tableNumber: 'T05',
    items: [
      { id: '6', name: 'Lobster Bisque', quantity: 2, price: 16 },
      { id: '7', name: 'Chocolate Lava Cake', quantity: 1, price: 14 },
    ],
    status: 'pending',
    priority: 'low',
    orderTime: '19:45',
    estimatedTime: 30,
    totalAmount: 46,
    waiterId: '2',
    waiterName: 'Maria Garcia',
  },
  {
    id: '4',
    tableNumber: 'T15',
    customerName: 'Emily Rodriguez',
    items: [
      { id: '8', name: 'Farm Fresh Salad', quantity: 1, price: 16 },
      { id: '9', name: 'Craft Old Fashioned', quantity: 2, price: 16 },
    ],
    status: 'served',
    priority: 'medium',
    orderTime: '18:30',
    estimatedTime: 0,
    totalAmount: 48,
    waiterId: '3',
    waiterName: 'Alex Thompson',
  },
];

type OrderFilter = 'all' | 'pending' | 'preparing' | 'ready' | 'served';

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedFilter, setSelectedFilter] = useState<OrderFilter>('all');

  const filteredOrders = useMemo(() => {
    if (selectedFilter === 'all') return orders;
    return orders.filter(order => order.status === selectedFilter);
  }, [orders, selectedFilter]);

  const getStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case 'pending':
        return colors.warning;
      case 'preparing':
        return colors.primary;
      case 'ready':
        return colors.success;
      case 'served':
        return colors.textLight;
      case 'cancelled':
        return colors.error;
      default:
        return colors.textLight;
    }
  };

  const getPriorityColor = (priority: OrderPriority): string => {
    switch (priority) {
      case 'high':
        return colors.error;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.success;
      default:
        return colors.textLight;
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return Clock;
      case 'preparing':
        return ChefHat;
      case 'ready':
        return CheckCircle;
      case 'served':
        return Utensils;
      case 'cancelled':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleStatusUpdate = (order: Order) => {
    const statusFlow: OrderStatus[] = ['pending', 'preparing', 'ready', 'served'];
    const currentIndex = statusFlow.indexOf(order.status);
    
    if (currentIndex < statusFlow.length - 1) {
      const nextStatus = statusFlow[currentIndex + 1];
      updateOrderStatus(order.id, nextStatus);
    }
  };

  const FilterButton = ({ filter, label, count }: { 
    filter: OrderFilter; 
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

  const OrderCard = ({ order }: { order: Order }) => {
    const StatusIcon = getStatusIcon(order.status);
    const statusColor = getStatusColor(order.status);
    const priorityColor = getPriorityColor(order.priority);

    return (
      <TouchableOpacity 
        style={[
          styles.orderCard,
          { borderLeftColor: statusColor }
        ]} 
        activeOpacity={0.95}
        testID={`order-${order.id}`}
      >
        <View style={styles.orderHeader}>
          <View style={styles.orderLeft}>
            <View style={[styles.statusIcon, { backgroundColor: statusColor + '15' }]}>
              <StatusIcon size={20} color={statusColor} strokeWidth={2.5} />
            </View>
            <View style={styles.orderInfo}>
              <View style={styles.orderTitleRow}>
                <Text style={styles.tableNumber}>Table {order.tableNumber}</Text>
                <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
              </View>
              {order.customerName && (
                <Text style={styles.customerName}>{order.customerName}</Text>
              )}
              <Text style={styles.orderTime}>
                Ordered at {order.orderTime} • {order.waiterName}
              </Text>
            </View>
          </View>
          <View style={styles.orderActions}>
            <TouchableOpacity style={styles.viewButton}>
              <Eye size={16} color={colors.primary} strokeWidth={2.5} />
            </TouchableOpacity>
            <View style={styles.totalAmount}>
              <DollarSign size={16} color={colors.success} strokeWidth={2.5} />
              <Text style={styles.totalText}>{order.totalAmount}</Text>
            </View>
          </View>
        </View>

        <View style={styles.orderItems}>
          {order.items.slice(0, 3).map((item, index) => (
            <View key={item.id} style={styles.orderItem}>
              <Text style={styles.itemQuantity}>{item.quantity}x</Text>
              <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.itemPrice}>${item.price}</Text>
            </View>
          ))}
          {order.items.length > 3 && (
            <Text style={styles.moreItems}>+{order.items.length - 3} more items</Text>
          )}
        </View>

        {order.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Notes:</Text>
            <Text style={styles.notesText}>{order.notes}</Text>
          </View>
        )}

        <View style={styles.orderFooter}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {order.status.toUpperCase()}
            </Text>
          </View>
          
          {order.status !== 'served' && order.status !== 'cancelled' && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: statusColor }]}
              onPress={() => handleStatusUpdate(order)}
            >
              <Text style={styles.actionButtonText}>
                {order.status === 'pending' ? 'Start Preparing' :
                 order.status === 'preparing' ? 'Mark Ready' :
                 order.status === 'ready' ? 'Mark Served' : 'Update'}
              </Text>
            </TouchableOpacity>
          )}
          
          {order.estimatedTime > 0 && (
            <View style={styles.timeEstimate}>
              <Clock size={14} color={colors.textLight} strokeWidth={2} />
              <Text style={styles.timeText}>{order.estimatedTime}min</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const getFilterCounts = () => {
    return {
      all: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      ready: orders.filter(o => o.status === 'ready').length,
      served: orders.filter(o => o.status === 'served').length,
    };
  };

  const filterCounts = getFilterCounts();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.white, colors.backgroundLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View>
          <Text style={styles.title}>Orders</Text>
          <Text style={styles.subtitle}>{filteredOrders.length} active orders</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.filterIcon} testID="orders-filter-btn" activeOpacity={0.8}>
            <Filter size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} testID="orders-add-btn" activeOpacity={0.9}>
            <Plus size={20} color={colors.white} />
            <Text style={styles.addButtonText}>New</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.statsSection}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{filterCounts.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{filterCounts.preparing}</Text>
            <Text style={styles.statLabel}>Preparing</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{filterCounts.ready}</Text>
            <Text style={styles.statLabel}>Ready</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{filterCounts.served}</Text>
            <Text style={styles.statLabel}>Served</Text>
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
        <FilterButton filter="pending" label="Pending" count={filterCounts.pending} />
        <FilterButton filter="preparing" label="Preparing" count={filterCounts.preparing} />
        <FilterButton filter="ready" label="Ready" count={filterCounts.ready} />
        <FilterButton filter="served" label="Served" count={filterCounts.served} />
      </ScrollView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.ordersList}>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <ChefHat size={48} color={colors.textLight} />
              <Text style={styles.emptyStateText}>No orders found</Text>
              <Text style={styles.emptyStateSubtext}>
                {selectedFilter === 'all'
                  ? 'No orders available'
                  : `No ${selectedFilter} orders found`}
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
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.secondary + '12',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
    elevation: 6,
    borderWidth: 1,
    borderColor: colors.secondary + '20',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 20,
    gap: 8,
    ...shadows.large,
    elevation: 10,
    borderWidth: 1,
    borderColor: colors.primaryDark,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 0.3,
  },
  statsSection: {
    paddingHorizontal: 28,
    paddingVertical: 24,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 32,
    padding: 28,
    ...shadows.large,
    elevation: 18,
    borderLeftWidth: 6,
    borderLeftColor: colors.primary,
    overflow: 'hidden',
    borderWidth: 0,
    transform: [{ scale: 1 }],
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 6,
    fontWeight: '700',
    letterSpacing: -0.2,
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
  ordersList: {
    paddingHorizontal: 28,
    paddingBottom: 32,
  },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: 36,
    padding: 36,
    marginBottom: 32,
    ...shadows.large,
    elevation: 24,
    borderWidth: 0,
    borderLeftWidth: 8,
    overflow: 'hidden',
    transform: [{ scale: 1 }],
    position: 'relative',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  statusIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    ...shadows.small,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  orderInfo: {
    flex: 1,
  },
  orderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  tableNumber: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.text,
    marginRight: 12,
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    ...shadows.small,
    elevation: 2,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textLight,
    marginBottom: 4,
  },
  orderTime: {
    fontSize: 14,
    color: colors.textExtraLight,
    fontWeight: '500',
  },
  orderActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  viewButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.primary + '25',
  },
  totalAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success + '15',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
    ...shadows.small,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.success + '25',
  },
  totalText: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.success,
    letterSpacing: -0.2,
  },
  orderItems: {
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 12,
  },
  itemQuantity: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    width: 24,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
  },
  moreItems: {
    fontSize: 12,
    color: colors.textLight,
    fontStyle: 'italic',
    marginTop: 4,
  },
  notesSection: {
    backgroundColor: colors.warning + '12',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    borderLeftWidth: 6,
    borderLeftColor: colors.warning,
    borderWidth: 1,
    borderColor: colors.warning + '20',
    ...shadows.small,
    elevation: 4,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.warning,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  orderFooter: {
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
  actionButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 20,
    ...shadows.large,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 0.3,
  },
  timeEstimate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '600',
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