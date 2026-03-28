import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Clock,
  Star,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
} from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

type TimePeriod = 'today' | 'week' | 'month' | 'year';

const mockAnalytics = {
  revenue: {
    today: 2850,
    week: 18500,
    month: 75200,
    year: 892000,
    growth: 12.5,
  },
  customers: {
    today: 145,
    week: 980,
    month: 4200,
    year: 48500,
    growth: 8.3,
  },
  orders: {
    today: 89,
    week: 620,
    month: 2650,
    year: 31200,
    growth: -2.1,
  },
  avgOrderValue: {
    today: 32.02,
    week: 29.84,
    month: 28.38,
    year: 28.59,
    growth: 15.2,
  },
  topItems: [
    { name: 'Grilled Salmon', orders: 45, revenue: 1260 },
    { name: 'Wagyu Sliders', orders: 38, revenue: 912 },
    { name: 'Truffle Pasta', orders: 32, revenue: 896 },
    { name: 'Caesar Salad', orders: 28, revenue: 448 },
  ],
  peakHours: [
    { hour: '12:00', orders: 25 },
    { hour: '13:00', orders: 32 },
    { hour: '19:00', orders: 45 },
    { hour: '20:00', orders: 38 },
    { hour: '21:00', orders: 28 },
  ],
};

export default function AnalyticsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('today');

  const periods: { key: TimePeriod; label: string }[] = [
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
    { key: 'year', label: 'Year' },
  ];

  const MetricCard = ({ 
    title, 
    value, 
    growth, 
    icon: Icon, 
    color 
  }: { 
    title: string; 
    value: string; 
    growth: number; 
    icon: any; 
    color: string; 
  }) => (
    <View style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <View style={[styles.metricIcon, { backgroundColor: color + '15' }]}>
          <Icon size={20} color={color} strokeWidth={2} />
        </View>
        <View style={[styles.growthBadge, { 
          backgroundColor: growth >= 0 ? colors.success + '15' : colors.error + '15' 
        }]}>
          {growth >= 0 ? (
            <TrendingUp size={12} color={colors.success} strokeWidth={2} />
          ) : (
            <TrendingDown size={12} color={colors.error} strokeWidth={2} />
          )}
          <Text style={[styles.growthText, { 
            color: growth >= 0 ? colors.success : colors.error 
          }]}>
            {Math.abs(growth)}%
          </Text>
        </View>
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricTitle}>{title}</Text>
    </View>
  );

  const formatValue = (dataKey: 'revenue' | 'customers' | 'orders' | 'avgOrderValue', period: TimePeriod) => {
    const data = mockAnalytics[dataKey];
    const value = data[period];
    
    if (dataKey === 'revenue') {
      return `${value.toLocaleString()}`;
    } else if (dataKey === 'avgOrderValue') {
      return `${value.toFixed(2)}`;
    } else {
      return value.toLocaleString();
    }
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
          <Text style={styles.title}>Analytics</Text>
          <Text style={styles.subtitle}>Restaurant performance insights</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.chartButton}>
            <BarChart3 size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.periodSelector}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.periodContent}
        >
          {periods.map((period) => (
            <TouchableOpacity
              key={period.key}
              style={[
                styles.periodButton,
                selectedPeriod === period.key && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period.key)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period.key && styles.periodButtonTextActive,
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Revenue"
            value={formatValue('revenue', selectedPeriod)}
            growth={mockAnalytics.revenue.growth}
            icon={DollarSign}
            color={colors.success}
          />
          <MetricCard
            title="Customers"
            value={formatValue('customers', selectedPeriod)}
            growth={mockAnalytics.customers.growth}
            icon={Users}
            color={colors.primary}
          />
          <MetricCard
            title="Orders"
            value={formatValue('orders', selectedPeriod)}
            growth={mockAnalytics.orders.growth}
            icon={Activity}
            color={colors.secondary}
          />
          <MetricCard
            title="Avg Order"
            value={formatValue('avgOrderValue', selectedPeriod)}
            growth={mockAnalytics.avgOrderValue.growth}
            icon={Star}
            color={colors.warning}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Performing Items</Text>
          <View style={styles.topItemsList}>
            {mockAnalytics.topItems.map((item, index) => (
              <View key={item.name} style={styles.topItemCard}>
                <View style={styles.topItemLeft}>
                  <View style={[styles.rankBadge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.rankText}>{index + 1}</Text>
                  </View>
                  <View style={styles.topItemInfo}>
                    <Text style={styles.topItemName}>{item.name}</Text>
                    <Text style={styles.topItemOrders}>{item.orders} orders</Text>
                  </View>
                </View>
                <Text style={styles.topItemRevenue}>${item.revenue}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Peak Hours</Text>
          <View style={styles.peakHoursChart}>
            {mockAnalytics.peakHours.map((hour) => {
              const maxOrders = Math.max(...mockAnalytics.peakHours.map(h => h.orders));
              const height = (hour.orders / maxOrders) * 80;
              
              return (
                <View key={hour.hour} style={styles.hourBar}>
                  <View style={styles.barContainer}>
                    <View 
                      style={[
                        styles.bar, 
                        { 
                          height: height,
                          backgroundColor: colors.primary,
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.hourLabel}>{hour.hour}</Text>
                  <Text style={styles.orderCount}>{hour.orders}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Insights</Text>
          <View style={styles.insightsList}>
            <View style={styles.insightCard}>
              <View style={[styles.insightIcon, { backgroundColor: colors.success + '15' }]}>
                <TrendingUp size={16} color={colors.success} strokeWidth={2} />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Revenue Growth</Text>
                <Text style={styles.insightText}>
                  Revenue is up 12.5% compared to last period
                </Text>
              </View>
            </View>
            
            <View style={styles.insightCard}>
              <View style={[styles.insightIcon, { backgroundColor: colors.warning + '15' }]}>
                <Clock size={16} color={colors.warning} strokeWidth={2} />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Peak Time</Text>
                <Text style={styles.insightText}>
                  Busiest hour is 7:00 PM with 45 orders
                </Text>
              </View>
            </View>
            
            <View style={styles.insightCard}>
              <View style={[styles.insightIcon, { backgroundColor: colors.primary + '15' }]}>
                <Star size={16} color={colors.primary} strokeWidth={2} />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Best Seller</Text>
                <Text style={styles.insightText}>
                  Grilled Salmon is your top performer today
                </Text>
              </View>
            </View>
          </View>
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
  chartButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodSelector: {
    backgroundColor: colors.white,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  periodContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.backgroundLight,
  },
  periodButtonActive: {
    backgroundColor: colors.primary,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
  },
  periodButtonTextActive: {
    color: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  metricCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    width: (Dimensions.get('window').width - 44) / 2,
    ...shadows.small,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 2,
  },
  growthText: {
    fontSize: 10,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  topItemsList: {
    gap: 8,
  },
  topItemCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shadows.small,
    elevation: 1,
    borderWidth: 1,
    borderColor: colors.border,
  },
  topItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rankBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  topItemInfo: {
    flex: 1,
  },
  topItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  topItemOrders: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '500',
  },
  topItemRevenue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
  },
  peakHoursChart: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    ...shadows.small,
    elevation: 1,
    borderWidth: 1,
    borderColor: colors.border,
  },
  hourBar: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    height: 80,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    width: 20,
    borderRadius: 10,
    minHeight: 4,
  },
  hourLabel: {
    fontSize: 10,
    color: colors.textLight,
    fontWeight: '500',
    marginBottom: 2,
  },
  orderCount: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },
  insightsList: {
    gap: 12,
  },
  insightCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.small,
    elevation: 1,
    borderWidth: 1,
    borderColor: colors.border,
  },
  insightIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  insightText: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '500',
    lineHeight: 16,
  },
});