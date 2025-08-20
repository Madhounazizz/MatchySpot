import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
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
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { mockReservations } from '@/mocks/reservations';
import { mockStaff } from '@/mocks/staff';
import { RestaurantStats } from '@/types';

const mockStats: RestaurantStats = {
  todayReservations: 24,
  todayRevenue: 3420,
  occupancyRate: 78,
  averageRating: 4.6,
  totalReviews: 342,
  pendingReservations: 3,
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
    onPress 
  }: {
    icon: any;
    title: string;
    value: string | number;
    subtitle?: string;
    color?: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity 
      style={[styles.statCard, onPress && styles.pressableCard]} 
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.statIconContainer, { backgroundColor: color + '15' }]}>
        <Icon size={24} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statValue}>{value}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );

  const QuickActionCard = ({ 
    icon: Icon, 
    title, 
    description, 
    color = colors.primary,
    onPress 
  }: {
    icon: any;
    title: string;
    description: string;
    color?: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity 
      style={styles.actionCard} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.actionIconContainer, { backgroundColor: color + '15' }]}>
        <Icon size={20} color={color} />
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
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.restaurantName}>Bella Vista Restaurant</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            icon={Calendar}
            title={"Today's Reservations"}
            value={mockStats.todayReservations}
            subtitle={`${pendingReservations.length} pending`}
          />
          <StatCard
            icon={DollarSign}
            title={"Today's Revenue"}
            value={`$${mockStats.todayRevenue.toLocaleString()}`}
            color={colors.success}
          />
          <StatCard
            icon={TrendingUp}
            title={"Occupancy Rate"}
            value={`${mockStats.occupancyRate}%`}
            subtitle={"Above average"}
            color={colors.warning}
          />
          <StatCard
            icon={Star}
            title={"Average Rating"}
            value={mockStats.averageRating}
            subtitle={`${mockStats.totalReviews} reviews`}
            color={colors.accent}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <QuickActionCard
              icon={AlertCircle}
              title={"Pending Reservations"}
              description={`${pendingReservations.length} need confirmation`}
              color={colors.error}
            />
            <QuickActionCard
              icon={Users}
              title={"Staff on Duty"}
              description={`${activeStaff.length} staff members active`}
              color={colors.primary}
            />
            <QuickActionCard
              icon={Clock}
              title={"Table Status"}
              description={"View current table availability"}
              color={colors.success}
            />
            <QuickActionCard
              icon={CheckCircle}
              title={"Today's Schedule"}
              description={"Manage reservations & staff"}
              color={colors.accent}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            {todayReservations.slice(0, 3).map((reservation) => (
              <View key={reservation.id} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Calendar size={16} color={colors.primary} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>
                    New reservation - {reservation.customerName}
                  </Text>
                  <Text style={styles.activityTime}>
                    {reservation.time} • Party of {reservation.partySize}
                  </Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(reservation.status) + '15' }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: getStatusColor(reservation.status) }
                  ]}>
                    {reservation.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
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
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  pressableCard: {
    transform: [{ scale: 1 }],
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statContent: {
    flex: 1,
  },
  statTitle: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 12,
    color: colors.textLight,
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 12,
    color: colors.textLight,
  },
  activityList: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primary + '15',
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
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});