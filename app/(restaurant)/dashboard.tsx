import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform,
} from 'react-native';
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  Star,
  AlertCircle,
  CheckCircle,
  ChefHat,
  Settings,
  BarChart3,
  Bell,
  ArrowUpRight,
  MapPin,
} from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import { mockReservations } from '@/mocks/reservations';
import { mockStaff } from '@/mocks/staff';
import { RestaurantStats } from '@/types';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

const mockStats: RestaurantStats = {
  todayReservations: 24,
  todayRevenue: 3420,
  occupancyRate: 78,
  averageRating: 4.6,
  totalReviews: 342,
  pendingReservations: 3,
};

const getTimeOfDayGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

export default function RestaurantDashboard() {
  const todayReservations = mockReservations.filter(
    (reservation) => reservation.date === '2025-01-20'
  );
  
  const pendingReservations = todayReservations.filter(
    (reservation) => reservation.status === 'pending'
  );
  
  const activeStaff = mockStaff.filter((staff) => staff.isActive);

  const StatCard = ({ 
    icon: Icon, 
    title, 
    value, 
    subtitle, 
    color = colors.primary,
    trend,
    onPress 
  }: {
    icon: any;
    title: string;
    value: string | number;
    subtitle?: string;
    color?: string;
    trend?: 'up' | 'down' | 'neutral';
    onPress?: () => void;
  }) => (
    <TouchableOpacity 
      style={[styles.statCard, onPress && styles.pressableCard]} 
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      <View style={styles.statCardHeader}>
        <View style={[styles.statIconContainer, { backgroundColor: color + '10' }]}>
          <Icon size={22} color={color} strokeWidth={2.5} />
        </View>
        {trend && (
          <View style={[styles.trendIndicator, { 
            backgroundColor: trend === 'up' ? colors.success + '15' : 
                           trend === 'down' ? colors.error + '15' : colors.textLight + '15' 
          }]}>
            <ArrowUpRight 
              size={12} 
              color={trend === 'up' ? colors.success : 
                     trend === 'down' ? colors.error : colors.textLight}
              style={trend === 'down' ? { transform: [{ rotate: '90deg' }] } : {}}
            />
          </View>
        )}
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );

  const QuickActionCard = ({ 
    icon: Icon, 
    title, 
    description, 
    color = colors.primary,
    badge,
    onPress 
  }: {
    icon: any;
    title: string;
    description: string;
    color?: string;
    badge?: number;
    onPress?: () => void;
  }) => (
    <TouchableOpacity 
      style={styles.actionCard} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.actionHeader}>
        <View style={[styles.actionIconContainer, { backgroundColor: color + '12' }]}>
          <Icon size={18} color={color} strokeWidth={2.5} />
        </View>
        {badge && badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge > 99 ? '99+' : badge}</Text>
          </View>
        )}
      </View>
      <View style={styles.actionContent}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Enhanced Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Text style={styles.welcomeText}>{getTimeOfDayGreeting()}!</Text>
              <Text style={styles.restaurantName}>Bella Vista Restaurant</Text>
              <View style={styles.locationContainer}>
                <MapPin size={14} color={colors.textLight} />
                <Text style={styles.locationText}>Downtown, NYC</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Bell size={20} color={colors.text} />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Enhanced Stats Grid */}
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            <StatCard
              icon={Calendar}
              title={"Today's Reservations"}
              value={mockStats.todayReservations}
              subtitle={`${pendingReservations.length} pending`}
              color={colors.primary}
              trend="up"
            />
            <StatCard
              icon={DollarSign}
              title={"Today's Revenue"}
              value={`${mockStats.todayRevenue.toLocaleString()}`}
              subtitle="+12% vs yesterday"
              color={colors.success}
              trend="up"
            />
            <StatCard
              icon={TrendingUp}
              title={"Occupancy Rate"}
              value={`${mockStats.occupancyRate}%`}
              subtitle="Above average"
              color={colors.secondary}
              trend="up"
            />
            <StatCard
              icon={Star}
              title={"Average Rating"}
              value={mockStats.averageRating}
              subtitle={`${mockStats.totalReviews} reviews`}
              color={colors.warning}
              trend="neutral"
            />
          </View>
        </View>

        {/* Enhanced Quick Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.actionsGrid}>
            <QuickActionCard
              icon={AlertCircle}
              title={"Pending Reservations"}
              description={`${pendingReservations.length} need confirmation`}
              color={colors.error}
              badge={pendingReservations.length}
            />
            <QuickActionCard
              icon={Users}
              title={"Staff Management"}
              description={`${activeStaff.length} staff on duty`}
              color={colors.primary}
            />
            <QuickActionCard
              icon={ChefHat}
              title={"Menu Management"}
              description={"Update dishes & pricing"}
              color={colors.secondary}
            />
            <QuickActionCard
              icon={BarChart3}
              title={"Analytics"}
              description={"View detailed reports"}
              color={colors.success}
            />
          </View>
        </View>

        {/* Performance Insights */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Performance Insights</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>View Analytics</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.insightsCard}>
            <View style={styles.insightRow}>
              <View style={styles.insightItem}>
                <View style={[styles.insightIcon, { backgroundColor: colors.success + '15' }]}>
                  <TrendingUp size={18} color={colors.success} />
                </View>
                <View style={styles.insightContent}>
                  <Text style={styles.insightValue}>+18%</Text>
                  <Text style={styles.insightLabel}>Revenue Growth</Text>
                </View>
              </View>
              <View style={styles.insightItem}>
                <View style={[styles.insightIcon, { backgroundColor: colors.primary + '15' }]}>
                  <Clock size={18} color={colors.primary} />
                </View>
                <View style={styles.insightContent}>
                  <Text style={styles.insightValue}>42min</Text>
                  <Text style={styles.insightLabel}>Avg. Table Turn</Text>
                </View>
              </View>
            </View>
            <View style={styles.insightRow}>
              <View style={styles.insightItem}>
                <View style={[styles.insightIcon, { backgroundColor: colors.warning + '15' }]}>
                  <Star size={18} color={colors.warning} />
                </View>
                <View style={styles.insightContent}>
                  <Text style={styles.insightValue}>4.6★</Text>
                  <Text style={styles.insightLabel}>Customer Rating</Text>
                </View>
              </View>
              <View style={styles.insightItem}>
                <View style={[styles.insightIcon, { backgroundColor: colors.accent + '15' }]}>
                  <Users size={18} color={colors.accent} />
                </View>
                <View style={styles.insightContent}>
                  <Text style={styles.insightValue}>89%</Text>
                  <Text style={styles.insightLabel}>Customer Return</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Enhanced Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.activityList}>
            {todayReservations.slice(0, 4).map((reservation, index) => (
              <TouchableOpacity key={reservation.id} style={[
                styles.activityItem,
                index === todayReservations.slice(0, 4).length - 1 && styles.lastActivityItem
              ]}>
                <View style={styles.activityLeft}>
                  <View style={[styles.activityIcon, {
                    backgroundColor: getStatusColor(reservation.status) + '15'
                  }]}>
                    <Calendar size={16} color={getStatusColor(reservation.status)} />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>
                      {reservation.customerName}
                    </Text>
                    <Text style={styles.activityTime}>
                      {reservation.time} • Party of {reservation.partySize}
                    </Text>
                  </View>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(reservation.status) + '12' }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: getStatusColor(reservation.status) }
                  ]}>
                    {reservation.status}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'confirmed':
      return colors.success;
    case 'pending':
      return colors.warning;
    case 'seated':
      return colors.primary;
    case 'completed':
      return colors.textLight;
    case 'cancelled':
    case 'no-show':
      return colors.error;
    default:
      return colors.textLight;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 20,
    backgroundColor: colors.white,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...shadows.small,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 4,
    fontWeight: '500',
  },
  restaurantName: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  statsSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    width: cardWidth,
    ...shadows.card,
    borderWidth: 1,
    borderColor: colors.border + '30',
  },
  pressableCard: {
    transform: [{ scale: 1 }],
  },
  statCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  statTitle: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 4,
    fontWeight: '600',
  },
  statSubtitle: {
    fontSize: 11,
    color: colors.textExtraLight,
    fontWeight: '500',
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  seeAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.backgroundLight,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    width: cardWidth,
    ...shadows.small,
    borderWidth: 1,
    borderColor: colors.border + '20',
  },
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 11,
    color: colors.white,
    fontWeight: '700',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  actionDescription: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '500',
    lineHeight: 16,
  },
  activityList: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    ...shadows.card,
    borderWidth: 1,
    borderColor: colors.border + '20',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + '40',
  },
  lastActivityItem: {
    borderBottomWidth: 0,
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
    letterSpacing: -0.1,
  },
  activityTime: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
    letterSpacing: 0.3,
  },
  bottomSpacing: {
    height: 32,
  },
  insightsCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    ...shadows.card,
    borderWidth: 1,
    borderColor: colors.border + '20',
  },
  insightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  insightIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  insightLabel: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '500',
  },
});