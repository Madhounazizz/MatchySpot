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
  }) => {
    const isActive = selectedFilter === filter;
    return (
      <TouchableOpacity
        style={[
          styles.tabButton,
          isActive && styles.tabButtonActive,
        ]}
        onPress={() => setSelectedFilter(filter)}
        testID={`filter-${filter}`}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.tabButtonText,
            isActive && styles.tabButtonTextActive,
          ]}
        >
          {label}
        </Text>
        {count > 0 && (
          <View style={[styles.countBadge, isActive && styles.countBadgeActive]}>
            <Text style={[styles.countText, isActive && styles.countTextActive]}>
              {count}
            </Text>
          </View>
        )}
        {isActive && <View style={styles.activeIndicator} />}
      </TouchableOpacity>
    );
  };

  const OrderCard = ({ order }: { order: Order }) => {
    const StatusIcon = getStatusIcon(order.status);
    const statusColor = getStatusColor(order.status);
    const priorityColor = getPriorityColor(order.priority);

    return (
      <TouchableOpacity 
        style={styles.orderCard} 
        activeOpacity={0.9}
        testID={`order-${order.id}`}
      >
        <View style={styles.orderHeader}>
          <View style={styles.orderLeft}>
            <View style={[styles.statusIcon, { backgroundColor: statusColor + '15' }]}>
              <StatusIcon size={16} color={statusColor} strokeWidth={2} />
            </View>
            <View style={styles.orderInfo}>
              <View style={styles.orderTitleRow}>
                <Text style={styles.tableNumber}>{order.tableNumber}</Text>
                <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
              </View>
              {order.customerName && (
                <Text style={styles.customerName}>{order.customerName}</Text>
              )}
              <Text style={styles.orderTime}>{order.orderTime}</Text>
            </View>
          </View>
          <View style={styles.orderActions}>
            <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
              <Text style={[styles.statusText, { color: statusColor }]}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Text>
            </View>
            <Text style={styles.totalText}>${order.totalAmount}</Text>
          </View>
        </View>

        <View style={styles.orderItems}>
          <Text style={styles.itemsSummary}>
            {order.items.length} item{order.items.length > 1 ? 's' : ''} • {order.items.slice(0, 2).map(item => `${item.quantity}x ${item.name}`).join(', ')}{order.items.length > 2 && ` +${order.items.length - 2} more`}
          </Text>
        </View>

        {order.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesText}>{order.notes}</Text>
          </View>
        )}

        <View style={styles.orderFooter}>
          {order.status !== 'served' && order.status !== 'cancelled' && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: statusColor }]}
              onPress={() => handleStatusUpdate(order)}
            >
              <Text style={styles.actionButtonText}>
                {order.status === 'pending' ? 'Start' :
                 order.status === 'preparing' ? 'Ready' :
                 order.status === 'ready' ? 'Serve' : 'Update'}
              </Text>
            </TouchableOpacity>
          )}
          
          {order.estimatedTime > 0 && (
            <View style={styles.timeEstimate}>
              <Clock size={12} color={colors.textLight} strokeWidth={2} />
              <Text style={styles.timeText}>{order.estimatedTime}min</Text>
            </View>
          )}
          
          <TouchableOpacity style={styles.viewButton}>
            <Eye size={14} color={colors.primary} strokeWidth={2} />
          </TouchableOpacity>
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

      <View style={styles.tabBarContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBarContent}
        >
          <FilterButton filter="all" label="All" count={filterCounts.all} />
          <FilterButton filter="pending" label="Pending" count={filterCounts.pending} />
          <FilterButton filter="preparing" label="Preparing" count={filterCounts.preparing} />
          <FilterButton filter="ready" label="Ready" count={filterCounts.ready} />
          <FilterButton filter="served" label="Served" count={filterCounts.served} />
        </ScrollView>
      </View>

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
  tabBarContainer: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabBarContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  tabButton: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 4,
    borderRadius: 20,
    backgroundColor: 'transparent',
    minHeight: 36,
  },
  tabButtonActive: {
    backgroundColor: '#FF7060' + '10',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
  },
  tabButtonTextActive: {
    color: '#FF7060',
  },
  countBadge: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
    minWidth: 20,
    alignItems: 'center',
  },
  countBadgeActive: {
    backgroundColor: '#FF7060',
  },
  countText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textLight,
  },
  countTextActive: {
    color: colors.white,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -12,
    width: 24,
    height: 2,
    backgroundColor: '#FF7060',
    borderRadius: 1,
  },
  scrollView: {
    flex: 1,
  },
  ordersList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    ...shadows.small,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  orderLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  statusIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  orderInfo: {
    flex: 1,
  },
  orderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  tableNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginRight: 6,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  customerName: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textLight,
    marginBottom: 1,
  },
  orderTime: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '500',
  },
  orderActions: {
    alignItems: 'flex-end',
    gap: 4,
  },
  totalText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
  },
  orderItems: {
    marginBottom: 8,
  },
  itemsSummary: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '500',
    lineHeight: 15,
  },
  notesSection: {
    backgroundColor: colors.backgroundLight,
    padding: 6,
    borderRadius: 6,
    marginBottom: 6,
  },
  notesText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  actionButton: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  timeEstimate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  timeText: {
    fontSize: 10,
    color: colors.textLight,
    fontWeight: '500',
  },
  viewButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
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