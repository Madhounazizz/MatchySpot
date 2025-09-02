import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Animated,
  Dimensions,
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
  Timer,
  Flame,
  Star,
} from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

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
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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

  const OrderCard = ({ order, index }: { order: Order; index: number }) => {
    const StatusIcon = getStatusIcon(order.status);
    const statusColor = getStatusColor(order.status);
    const priorityColor = getPriorityColor(order.priority);
    const cardAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;

    React.useEffect(() => {
      Animated.sequence([
        Animated.delay(index * 100),
        Animated.parallel([
          Animated.timing(cardAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }, [index]);

    return (
      <Animated.View
        style={[
          styles.orderCard,
          {
            opacity: cardAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <TouchableOpacity 
          activeOpacity={0.95}
          testID={`order-${order.id}`}
        >
          <LinearGradient
            colors={['#FFFFFF', '#FAFBFC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}
          >
            <View style={styles.orderHeader}>
              <View style={styles.orderLeft}>
                <LinearGradient
                  colors={[statusColor + '20', statusColor + '10']}
                  style={styles.statusIcon}
                >
                  <StatusIcon size={18} color={statusColor} strokeWidth={2.5} />
                </LinearGradient>
                <View style={styles.orderInfo}>
                  <View style={styles.orderTitleRow}>
                    <Text style={styles.tableNumber}>{order.tableNumber}</Text>
                    <LinearGradient
                      colors={[priorityColor, priorityColor + 'CC']}
                      style={styles.priorityBadge}
                    >
                      <Flame size={10} color={colors.white} strokeWidth={2} />
                    </LinearGradient>
                  </View>
                  {order.customerName && (
                    <View style={styles.customerRow}>
                      <Text style={styles.customerName}>{order.customerName}</Text>
                      <View style={styles.vipIndicator}>
                        <Star size={8} color="#FFD700" fill="#FFD700" />
                      </View>
                    </View>
                  )}
                  <View style={styles.timeRow}>
                    <Clock size={12} color="#FF6B6B" strokeWidth={2} />
                    <Text style={styles.orderTime}>{order.orderTime}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.orderActions}>
                <LinearGradient
                  colors={[statusColor + '20', statusColor + '10']}
                  style={styles.statusBadge}
                >
                  <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                  <Text style={[styles.statusText, { color: statusColor }]}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Text>
                </LinearGradient>
                <LinearGradient
                  colors={['#4CAF50', '#45A049']}
                  style={styles.totalBadge}
                >
                  <DollarSign size={12} color={colors.white} strokeWidth={2} />
                  <Text style={styles.totalText}>{order.totalAmount}</Text>
                </LinearGradient>
              </View>
            </View>

            <View style={styles.orderItems}>
              <LinearGradient
                colors={['#F3E5F5', '#E1BEE7']}
                style={styles.itemsGradient}
              >
                <ChefHat size={14} color="#9C27B0" strokeWidth={2} />
                <Text style={styles.itemsSummary}>
                  {order.items.length} item{order.items.length > 1 ? 's' : ''} • {order.items.slice(0, 2).map(item => `${item.quantity}x ${item.name}`).join(', ')}{order.items.length > 2 && ` +${order.items.length - 2} more`}
                </Text>
              </LinearGradient>
            </View>

            {order.notes && (
              <View style={styles.notesSection}>
                <LinearGradient
                  colors={['#FFF3E0', '#FFE0B2']}
                  style={styles.notesGradient}
                >
                  <AlertCircle size={12} color="#FF9800" strokeWidth={2} />
                  <Text style={styles.notesText}>{order.notes}</Text>
                </LinearGradient>
              </View>
            )}

            <View style={styles.orderFooter}>
              {order.status !== 'served' && order.status !== 'cancelled' && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleStatusUpdate(order)}
                >
                  <LinearGradient
                    colors={[statusColor, statusColor + 'DD']}
                    style={styles.actionGradient}
                  >
                    <Text style={styles.actionButtonText}>
                      {order.status === 'pending' ? 'Start Cooking' :
                       order.status === 'preparing' ? 'Mark Ready' :
                       order.status === 'ready' ? 'Serve Now' : 'Update'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
              
              {order.estimatedTime > 0 && (
                <LinearGradient
                  colors={['#E3F2FD', '#BBDEFB']}
                  style={styles.timeEstimate}
                >
                  <Timer size={14} color="#2196F3" strokeWidth={2} />
                  <Text style={styles.timeText}>{order.estimatedTime}min</Text>
                </LinearGradient>
              )}
              
              <TouchableOpacity style={styles.viewButton}>
                <Eye size={16} color="#FF6B6B" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
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
        colors={['#FF9800', '#FFB74D', '#FFCC02']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Animated.View 
          style={[
            styles.headerContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View>
            <Text style={styles.title}>Kitchen Orders</Text>
            <Text style={styles.subtitle}>{filteredOrders.length} active orders</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.filterIcon} testID="orders-filter-btn" activeOpacity={0.8}>
              <Filter size={20} color={colors.white} strokeWidth={2.5} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} testID="orders-add-btn" activeOpacity={0.9}>
              <LinearGradient
                colors={['#FFFFFF', '#F5F5F5']}
                style={styles.addButtonGradient}
              >
                <Plus size={18} color="#FF9800" strokeWidth={2.5} />
                <Text style={styles.addButtonText}>New</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
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
            filteredOrders.map((order, index) => (
              <OrderCard key={order.id} order={order} index={index} />
            ))
          ) : (
            <Animated.View 
              style={[
                styles.emptyState,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={['#FFF3E0', '#FFE0B2']}
                style={styles.emptyStateGradient}
              >
                <ChefHat size={64} color="#FF9800" strokeWidth={1.5} />
                <Text style={styles.emptyStateText}>No orders found</Text>
                <Text style={styles.emptyStateSubtext}>
                  {selectedFilter === 'all'
                    ? 'Kitchen is all caught up!'
                    : `No ${selectedFilter} orders found`}
                </Text>
              </LinearGradient>
            </Animated.View>
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
  },
  addButton: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    gap: 8,
  },
  addButtonText: {
    color: '#FF9800',
    fontWeight: '700',
    fontSize: 15,
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
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  cardGradient: {
    padding: 16,
    borderRadius: 20,
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
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
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
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginRight: 8,
  },
  priorityBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginRight: 6,
  },
  vipIndicator: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  orderItems: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  itemsGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  itemsSummary: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '500',
    lineHeight: 15,
  },
  notesSection: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  notesGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 6,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  totalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  actionGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  timeEstimate: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 4,
  },
  timeText: {
    fontSize: 10,
    color: colors.textLight,
    fontWeight: '500',
  },
  viewButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,107,107,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.2)',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  emptyStateGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    width: '100%',
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