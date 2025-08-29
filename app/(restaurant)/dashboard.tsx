import React, { memo, useState } from 'react';
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
  Settings as SettingsIcon,
  BarChart3,
  Bell,
  ArrowUpRight,
  MapPin,
  Activity,
  Zap,
  Award,
  Target,
} from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import { mockReservations } from '@/mocks/reservations';
import { mockStaff } from '@/mocks/staff';
import { RestaurantStats } from '@/types';
import NotificationCenter from '@/components/NotificationCenter';
import StaffScheduling from '@/components/StaffScheduling';

const { width } = Dimensions.get('window');
const cardWidth = (width - 28 * 2 - 20) / 2;

const mockStats: RestaurantStats = {
  todayReservations: 24,
  todayRevenue: 3420,
  occupancyRate: 78,
  averageRating: 4.6,
  totalReviews: 342,
  pendingReservations: 3,
};

const recentActivities = [
  { id: '1', type: 'reservation', message: 'New reservation from John Smith', time: '2 min ago', icon: Calendar, color: colors.primary },
  { id: '2', type: 'review', message: '5-star review received', time: '15 min ago', icon: Star, color: colors.warning },
  { id: '3', type: 'staff', message: 'Sarah clocked in', time: '1 hour ago', icon: Users, color: colors.success },
  { id: '4', type: 'order', message: 'Table 12 order completed', time: '2 hours ago', icon: CheckCircle, color: colors.success },
];

const getTimeOfDayGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

export default function RestaurantDashboard() {
  console.log('[Dashboard] Render');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showScheduling, setShowScheduling] = useState<boolean>(false);
  
  const todayReservations = mockReservations.filter(
    (reservation) => reservation.date === '2025-01-20'
  );

  const pendingReservations = todayReservations.filter(
    (reservation) => reservation.status === 'pending'
  );

  const activeStaff = mockStaff.filter((staff) => staff.isActive);

  const StatCard = memo(({ 
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
      style={styles.statCard} 
      onPress={onPress}
      activeOpacity={onPress ? 0.9 : 1}
      testID={`stat-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <View style={styles.statCardHeader}>
        <View style={[styles.statIconContainer, { backgroundColor: color + '15' }]}>
          <Icon size={20} color={color} strokeWidth={2} />
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
              strokeWidth={2}
            />
          </View>
        )}
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        {subtitle && (
          <Text style={styles.statSubtitle}>{subtitle}</Text>
        )}
      </View>
    </TouchableOpacity>
  ), (prev, next) => prev.value === next.value && prev.subtitle === next.subtitle && prev.color === next.color && prev.trend === next.trend);

  const QuickActionCard = memo(({ 
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
      activeOpacity={0.9}
      testID={`quick-action-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <View style={styles.actionHeader}>
        <View style={[styles.actionIconContainer, { backgroundColor: color + '15' }]}>
          <Icon size={18} color={color} strokeWidth={2} />
        </View>
        {badge && badge > 0 && (
          <View style={[styles.badge, { backgroundColor: color }]}>
            <Text style={styles.badgeText}>{badge > 99 ? '99+' : badge}</Text>
          </View>
        )}
      </View>
      <View style={styles.actionContent}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  ), (prev, next) => prev.description === next.description && prev.badge === next.badge && prev.color === next.color);

  return (
    <SafeAreaView style={styles.container} testID="restaurant-dashboard">
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header} testID="dashboard-header">
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.welcomeText}>{getTimeOfDayGreeting()}!</Text>
              <Text style={styles.restaurantName}>Bella Vista Restaurant</Text>
              <View style={styles.locationContainer}>
                <MapPin size={14} color={colors.textLight} />
                <Text style={styles.locationText}>Downtown, NYC</Text>
              </View>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton} activeOpacity={0.8}>
                <Activity size={18} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.notificationButton}
                onPress={() => setShowNotifications(true)}
                activeOpacity={0.8}
              >
                <Bell size={18} color={colors.primary} />
                {pendingReservations.length > 0 && <View style={styles.notificationDot} />}
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} activeOpacity={0.8}>
                <SettingsIcon size={18} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.liveStatusBar} testID="live-status">
            <View style={styles.statusItem}>
              <View style={styles.liveIndicator} />
              <Text style={styles.liveText}>Live</Text>
            </View>
            <View style={styles.statusItem}>
              <Zap size={12} color={colors.textLight} />
              <Text style={styles.statusText}>{activeStaff.length} staff active</Text>
            </View>
            <View style={styles.statusItem}>
              <Target size={12} color={colors.textLight} />
              <Text style={styles.statusText}>{mockStats.occupancyRate}% occupied</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsSection} testID="stats-section">
          <View style={styles.statsGrid}>
            <StatCard
              icon={DollarSign}
              title={"Today's Revenue"}
              value={`${mockStats.todayRevenue.toLocaleString()}`}
              subtitle={'+18% vs yesterday'}
              color={colors.success}
              trend="up"
            />
            <StatCard
              icon={Calendar}
              title={"Reservations"}
              value={mockStats.todayReservations}
              subtitle={`${pendingReservations.length} pending`}
              color={colors.primary}
              trend="up"
            />
            <StatCard
              icon={Activity}
              title={"Occupancy"}
              value={`${mockStats.occupancyRate}%`}
              subtitle={'Peak hours: 7-9 PM'}
              color={colors.secondary}
              trend="up"
            />
            <StatCard
              icon={Award}
              title={"Rating"}
              value={mockStats.averageRating}
              subtitle={`${mockStats.totalReviews} reviews`}
              color={colors.warning}
              trend="up"
            />
          </View>
        </View>

        <View style={styles.section} testID="quick-actions-section">
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
              onPress={() => setShowScheduling(true)}
            />
            <QuickActionCard
              icon={ChefHat}
              title={"Menu Management"}
              description={'Update dishes & pricing'}
              color={colors.secondary}
            />
            <QuickActionCard
              icon={BarChart3}
              title={"Analytics"}
              description={'View detailed reports'}
              color={colors.success}
            />
          </View>
        </View>

        <View style={styles.section} testID="insights-section">
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

        <View style={styles.section} testID="activity-section">
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Live Activity Feed</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.activityList}>
            {recentActivities.map((activity, index) => (
              <TouchableOpacity key={activity.id} style={[
                styles.activityItem,
                index === recentActivities.length - 1 ? styles.lastActivityItem : undefined
              ]}>
                <View style={styles.activityLeft}>
                  <View style={[styles.activityIcon, {
                    backgroundColor: activity.color + '15'
                  }]}>
                    <activity.icon size={18} color={activity.color} strokeWidth={2.5} />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>
                      {activity.message}
                    </Text>
                    <Text style={styles.activityTime}>
                      {activity.time}
                    </Text>
                  </View>
                </View>
                <View style={styles.activityIndicator}>
                  <View style={[styles.activityDot, { backgroundColor: activity.color }]} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
      
      <NotificationCenter 
        visible={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
      
      <StaffScheduling 
        visible={showScheduling} 
        onClose={() => setShowScheduling(false)} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: colors.white,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
  },
  welcomeText: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 4,
    fontWeight: '600',
  },
  restaurantName: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 4,
  },
  liveStatusBar: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.small,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  liveText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginRight: 16,
  },
  statusText: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '500',
    marginLeft: 4,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...shadows.small,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    borderWidth: 2,
    borderColor: colors.white,
  },
  statsSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  statCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    width: cardWidth,
    ...shadows.medium,
    margin: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
    fontWeight: '600',
  },
  statSubtitle: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '500',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
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
    marginHorizontal: -8,
  },
  actionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    width: cardWidth,
    ...shadows.medium,
    margin: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: colors.error,
    borderRadius: 12,
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
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 13,
    color: colors.textLight,
    fontWeight: '500',
  },
  activityList: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    ...shadows.medium,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '500',
  },
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  bottomSpacing: {
    height: 32,
  },
  insightsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    ...shadows.medium,
    borderWidth: 1,
    borderColor: colors.border,
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
    marginHorizontal: 4,
  },
  insightIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  insightContent: {
    flex: 1,
  },
  insightValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  insightLabel: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '500',
  },
});
