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
  Activity,
  Zap,
  Award,
  Target,
  Sparkles,
  TrendingDown,
  Eye,
  Coffee,
  Utensils,
} from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import { mockReservations } from '@/mocks/reservations';
import { mockStaff } from '@/mocks/staff';
import { RestaurantStats } from '@/types';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

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
    onPress,
    gradient = false
  }: {
    icon: any;
    title: string;
    value: string | number;
    subtitle?: string;
    color?: string;
    trend?: 'up' | 'down' | 'neutral';
    onPress?: () => void;
    gradient?: boolean;
  }) => {
    const CardContent = (
      <>
        <View style={styles.statCardHeader}>
          <View style={[styles.statIconContainer, { backgroundColor: gradient ? 'rgba(255,255,255,0.2)' : color + '15' }]}>
            <Icon size={24} color={gradient ? colors.white : color} strokeWidth={2.5} />
          </View>
          {trend && (
            <View style={[styles.trendIndicator, { 
              backgroundColor: trend === 'up' ? (gradient ? 'rgba(255,255,255,0.2)' : colors.success + '15') : 
                             trend === 'down' ? (gradient ? 'rgba(255,255,255,0.2)' : colors.error + '15') : 
                             (gradient ? 'rgba(255,255,255,0.2)' : colors.textLight + '15')
            }]}>
              <ArrowUpRight 
                size={14} 
                color={gradient ? colors.white : (trend === 'up' ? colors.success : 
                       trend === 'down' ? colors.error : colors.textLight)}
                style={trend === 'down' ? { transform: [{ rotate: '90deg' }] } : {}}
              />
            </View>
          )}
        </View>
        <View style={styles.statContent}>
          <Text style={[styles.statValue, gradient && { color: colors.white }]}>{value}</Text>
          <Text style={[styles.statTitle, gradient && { color: 'rgba(255,255,255,0.9)' }]}>{title}</Text>
          {subtitle && <Text style={[styles.statSubtitle, gradient && { color: 'rgba(255,255,255,0.7)' }]}>{subtitle}</Text>}
        </View>
      </>
    );

    if (gradient) {
      return (
        <TouchableOpacity 
          style={[styles.statCard, styles.gradientCard]} 
          onPress={onPress}
          activeOpacity={onPress ? 0.8 : 1}
        >
          <View style={[styles.gradientBackground, { backgroundColor: color }]}>
            {CardContent}
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity 
        style={[styles.statCard, onPress && styles.pressableCard]} 
        onPress={onPress}
        activeOpacity={onPress ? 0.8 : 1}
      >
        {CardContent}
      </TouchableOpacity>
    );
  };

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
        {/* Modern Header with Gradient */}
        <View style={styles.header}>
          <View style={styles.gradientHeader}>
            <View style={styles.headerTop}>
              <View style={styles.headerLeft}>
                <Text style={styles.welcomeText}>{getTimeOfDayGreeting()}!</Text>
                <Text style={styles.restaurantName}>Bella Vista Restaurant</Text>
                <View style={styles.locationContainer}>
                  <MapPin size={16} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.locationText}>Downtown, NYC</Text>
                </View>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.headerButton}>
                  <Activity size={20} color={colors.white} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.notificationButton}>
                  <Bell size={20} color={colors.white} />
                  <View style={styles.notificationDot} />
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Live Status Bar */}
            <View style={styles.liveStatusBar}>
              <View style={styles.statusItem}>
                <View style={styles.liveIndicator} />
                <Text style={styles.liveText}>Live</Text>
              </View>
              <View style={styles.statusItem}>
                <Zap size={14} color="rgba(255,255,255,0.9)" />
                <Text style={styles.statusText}>{activeStaff.length} staff active</Text>
              </View>
              <View style={styles.statusItem}>
                <Target size={14} color="rgba(255,255,255,0.9)" />
                <Text style={styles.statusText}>{mockStats.occupancyRate}% occupied</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Enhanced Stats Grid */}
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            <StatCard
              icon={DollarSign}
              title={"Today's Revenue"}
              value={`${mockStats.todayRevenue.toLocaleString()}`}
              subtitle="+18% vs yesterday"
              color={colors.success}
              trend="up"
              gradient={true}
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
              subtitle="Peak hours: 7-9 PM"
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
            <Text style={styles.sectionTitle}>Live Activity Feed</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.activityList}>
            {recentActivities.map((activity, index) => (
              <TouchableOpacity key={activity.id} style={[
                styles.activityItem,
                index === recentActivities.length - 1 && styles.lastActivityItem
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
    backgroundColor: '#f1f5f9',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 0,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
    ...shadows.large,
    elevation: 15,
  },
  gradientHeader: {
    paddingHorizontal: 28,
    paddingBottom: 32,
    backgroundColor: '#6366f1',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerLeft: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(20px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  welcomeText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 8,
    fontWeight: '600',
  },
  restaurantName: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.white,
    marginBottom: 12,
    letterSpacing: -1.2,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  liveStatusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backdropFilter: 'blur(20px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  liveText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backdropFilter: 'blur(10px)',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.warning,
    borderWidth: 2,
    borderColor: colors.white,
  },
  statsSection: {
    paddingHorizontal: 28,
    paddingTop: 40,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  statCard: {
    backgroundColor: colors.white,
    borderRadius: 28,
    padding: 24,
    width: cardWidth,
    ...shadows.large,
    borderWidth: 0,
    elevation: 12,
    borderTopWidth: 0,
  },
  gradientCard: {
    overflow: 'hidden',
    ...shadows.large,
    elevation: 15,
    borderTopWidth: 0,
  },
  gradientBackground: {
    borderRadius: 28,
    padding: 24,
    backgroundColor: colors.success,
  },
  pressableCard: {
    transform: [{ scale: 1 }],
  },
  statCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 40,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 10,
    letterSpacing: -1.5,
  },
  statTitle: {
    fontSize: 15,
    color: colors.textLight,
    marginBottom: 8,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  statSubtitle: {
    fontSize: 13,
    color: colors.textExtraLight,
    fontWeight: '600',
    lineHeight: 18,
  },
  section: {
    marginTop: 48,
    paddingHorizontal: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.6,
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
    borderRadius: 24,
    padding: 20,
    width: cardWidth,
    ...shadows.card,
    borderWidth: 0,
    elevation: 10,
    borderTopWidth: 3,
    borderTopColor: colors.primary,
  },
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
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
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  actionDescription: {
    fontSize: 13,
    color: colors.textLight,
    fontWeight: '600',
    lineHeight: 18,
  },
  activityList: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    ...shadows.large,
    borderWidth: 0,
    elevation: 12,
    borderTopWidth: 3,
    borderTopColor: colors.secondary,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + '30',
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
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  activityTime: {
    fontSize: 13,
    color: colors.textLight,
    fontWeight: '500',
  },
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bottomSpacing: {
    height: 32,
  },
  insightsCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    ...shadows.large,
    borderWidth: 0,
    elevation: 12,
    borderTopWidth: 3,
    borderTopColor: colors.accent,
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