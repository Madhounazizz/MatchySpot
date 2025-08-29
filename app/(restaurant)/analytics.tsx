import React, { useMemo, useState } from 'react';
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
  DollarSign,
  Users,
  Calendar,
  Star,
  Clock,
  Target,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
} from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import { menuItems } from '@/mocks/menu';
import ReportsExport from '@/components/ReportsExport';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

type TimePeriod = 'today' | 'week' | 'month' | 'year';

type AnalyticsData = {
  revenue: { current: number; previous: number; change: number };
  reservations: { current: number; previous: number; change: number };
  customers: { current: number; previous: number; change: number };
  rating: { current: number; previous: number; change: number };
};

const mockAnalytics: Record<TimePeriod, AnalyticsData> = {
  today: {
    revenue: { current: 3420, previous: 2890, change: 18.3 },
    reservations: { current: 24, previous: 19, change: 26.3 },
    customers: { current: 67, previous: 52, change: 28.8 },
    rating: { current: 4.6, previous: 4.4, change: 4.5 },
  },
  week: {
    revenue: { current: 18500, previous: 16200, change: 14.2 },
    reservations: { current: 142, previous: 128, change: 10.9 },
    customers: { current: 389, previous: 342, change: 13.7 },
    rating: { current: 4.5, previous: 4.3, change: 4.7 },
  },
  month: {
    revenue: { current: 78900, previous: 71200, change: 10.8 },
    reservations: { current: 567, previous: 523, change: 8.4 },
    customers: { current: 1456, previous: 1298, change: 12.2 },
    rating: { current: 4.4, previous: 4.2, change: 4.8 },
  },
  year: {
    revenue: { current: 892000, previous: 798000, change: 11.8 },
    reservations: { current: 6234, previous: 5789, change: 7.7 },
    customers: { current: 15678, previous: 14234, change: 10.1 },
    rating: { current: 4.3, previous: 4.1, change: 4.9 },
  },
};

const hourlyData = [
  { hour: '11AM', reservations: 2, revenue: 180 },
  { hour: '12PM', reservations: 8, revenue: 720 },
  { hour: '1PM', reservations: 12, revenue: 1080 },
  { hour: '2PM', reservations: 6, revenue: 540 },
  { hour: '3PM', reservations: 3, revenue: 270 },
  { hour: '6PM', reservations: 15, revenue: 1350 },
  { hour: '7PM', reservations: 18, revenue: 1620 },
  { hour: '8PM', reservations: 14, revenue: 1260 },
  { hour: '9PM', reservations: 10, revenue: 900 },
  { hour: '10PM', reservations: 5, revenue: 450 },
];

const categoryData = [
  { name: 'Main Courses', value: 45, color: colors.primary },
  { name: 'Appetizers', value: 25, color: colors.success },
  { name: 'Desserts', value: 20, color: colors.warning },
  { name: 'Drinks', value: 10, color: colors.accent },
];

export default function AnalyticsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('today');
  const [selectedChart, setSelectedChart] = useState<'revenue' | 'reservations'>('revenue');
  const [showReports, setShowReports] = useState<boolean>(false);

  const currentData = mockAnalytics[selectedPeriod];

  const MetricCard = ({
    title,
    value,
    change,
    icon: Icon,
    color = colors.primary,
    prefix = '',
    suffix = '',
  }: {
    title: string;
    value: number;
    change: number;
    icon: any;
    color?: string;
    prefix?: string;
    suffix?: string;
  }) => {
    const isPositive = change > 0;
    const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;

    return (
      <View style={[styles.metricCard, { borderLeftColor: color, borderLeftWidth: 4 }]} testID={`metric-${title}`}>
        <View style={styles.metricHeader}>
          <View style={[styles.metricIcon, { backgroundColor: `${color}15` }]}>
            <Icon size={20} color={color} strokeWidth={2.5} />
          </View>
          <View style={[styles.trendContainer, { backgroundColor: isPositive ? `${colors.success}15` : `${colors.error}15` }]}>
            <TrendIcon size={12} color={isPositive ? colors.success : colors.error} strokeWidth={3} />
            <Text style={[styles.trendText, { color: isPositive ? colors.success : colors.error }]}>
              {Math.abs(change).toFixed(1)}%
            </Text>
          </View>
        </View>
        <Text style={styles.metricValue}>
          {prefix}
          {value.toLocaleString()}
          {suffix}
        </Text>
        <Text style={styles.metricTitle}>{title}</Text>
      </View>
    );
  };

  const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>{title}</Text>
      {children}
    </View>
  );

  const SimpleBarChart = ({
    data,
    selectedMetric,
  }: {
    data: typeof hourlyData;
    selectedMetric: 'revenue' | 'reservations';
  }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const maxValue = useMemo(
      () => Math.max(...data.map(d => (selectedMetric === 'revenue' ? d.revenue : d.reservations))),
      [data, selectedMetric]
    );
    const total = useMemo(
      () => data.reduce((sum, item) => sum + (selectedMetric === 'revenue' ? item.revenue : item.reservations), 0),
      [data, selectedMetric]
    );

    return (
      <View style={styles.barChart} testID="barChart">
        <View style={styles.chartContainer}>
          {data.map((item, index) => {
            const value = selectedMetric === 'revenue' ? item.revenue : item.reservations;
            const height = (value / maxValue) * 120;
            const isActive = activeIndex === index;

            return (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  {isActive && (
                    <View style={styles.tooltip} accessibilityLabel={`Tooltip ${item.hour}`}>
                      <Text style={styles.tooltipText}>
                        {`${selectedMetric === 'revenue' ? '$' : ''}${value.toLocaleString()}${selectedMetric === 'reservations' ? ' res' : ''}`}
                      </Text>
                    </View>
                  )}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setActiveIndex(isActive ? null : index)}
                    accessibilityRole="button"
                    accessibilityLabel={`Bar ${item.hour} value ${value}`}
                    testID={`bar-${index}`}
                    style={[
                      styles.bar,
                      {
                        height,
                        backgroundColor: isActive ? colors.primary : `${colors.primary}80`,
                        borderTopLeftRadius: 6,
                        borderTopRightRadius: 6,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{item.hour}</Text>
              </View>
            );
          })}
        </View>
        <View style={styles.chartLegend}>
          <Text style={styles.chartValue} testID="chart-total">
            {selectedMetric === 'revenue' ? '$' : ''}
            {total.toLocaleString()}
            {selectedMetric === 'reservations' ? ' reservations' : ' revenue'}
          </Text>
          <Text style={styles.chartSubtitle}>Total {selectedPeriod}</Text>
        </View>
      </View>
    );
  };

  const CategoryBreakdown = ({ data }: { data: typeof categoryData }) => (
    <View style={styles.pieChart}>
      {data.map((item, idx) => (
        <View key={idx} style={styles.pieItem}>
          <View style={[styles.pieColor, { backgroundColor: item.color }]} />
          <Text style={styles.pieName}>{item.name}</Text>
          <Text style={styles.pieValue}>{item.value}%</Text>
        </View>
      ))}
    </View>
  );

  const TopPerformers = () => {
    const topItems = [...menuItems].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5);
    return (
      <View style={styles.topPerformers}>
        {topItems.map((item, index) => (
          <View key={item.id} style={styles.performerItem}>
            <View style={styles.performerRank}>
              <Text style={styles.rankNumber}>{index + 1}</Text>
            </View>
            <View style={styles.performerInfo}>
              <Text style={styles.performerName} numberOfLines={1}>
                {item.name}
              </Text>
              <View style={styles.performerStats}>
                <Star size={12} color={colors.warning} fill={colors.warning} />
                <Text style={styles.performerRating}>{item.rating}</Text>
                <Text style={styles.performerPrice}>${item.price}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const PeriodButton = ({ period, label }: { period: TimePeriod; label: string }) => (
    <TouchableOpacity
      style={[styles.periodButton, selectedPeriod === period && styles.periodButtonActive]}
      onPress={() => setSelectedPeriod(period)}
      accessibilityRole="button"
      accessibilityState={{ selected: selectedPeriod === period }}
      testID={`period-${period}`}
    >
      <Text style={[styles.periodButtonText, selectedPeriod === period && styles.periodButtonTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View accessibilityRole="header">
          <Text style={styles.title} testID="analytics-title">
            Analytics
          </Text>
          <Text style={styles.subtitle}>Business insights & performance</Text>
        </View>
        <TouchableOpacity 
          style={styles.filterButton} 
          accessibilityLabel="Open reports" 
          testID="reports-btn"
          onPress={() => setShowReports(true)}
        >
          <Filter size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.periodContainer}
        contentContainerStyle={styles.periodContent}
      >
        <PeriodButton period="today" label="Today" />
        <PeriodButton period="week" label="This Week" />
        <PeriodButton period="month" label="This Month" />
        <PeriodButton period="year" label="This Year" />
      </ScrollView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.metricsGrid}>
          <MetricCard title="Revenue" value={currentData.revenue.current} change={currentData.revenue.change} icon={DollarSign} color={colors.success} prefix="$" />
          <MetricCard title="Reservations" value={currentData.reservations.current} change={currentData.reservations.change} icon={Calendar} color={colors.primary} />
          <MetricCard title="Customers" value={currentData.customers.current} change={currentData.customers.change} icon={Users} color={colors.secondary} />
          <MetricCard title="Rating" value={currentData.rating.current} change={currentData.rating.change} icon={Star} color={colors.warning} />
        </View>

        <ChartCard title="Performance Overview">
          <View style={styles.chartToggle}>
            <TouchableOpacity
              style={[styles.toggleButton, selectedChart === 'revenue' && styles.toggleButtonActive]}
              onPress={() => setSelectedChart('revenue')}
              accessibilityLabel="Show revenue"
            >
              <DollarSign size={16} color={selectedChart === 'revenue' ? colors.white : colors.textLight} />
              <Text style={[styles.toggleText, selectedChart === 'revenue' && styles.toggleTextActive]}>Revenue</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, selectedChart === 'reservations' && styles.toggleButtonActive]}
              onPress={() => setSelectedChart('reservations')}
              accessibilityLabel="Show reservations"
            >
              <Calendar size={16} color={selectedChart === 'reservations' ? colors.white : colors.textLight} />
              <Text style={[styles.toggleText, selectedChart === 'reservations' && styles.toggleTextActive]}>Reservations</Text>
            </TouchableOpacity>
          </View>
          <SimpleBarChart data={hourlyData} selectedMetric={selectedChart} />
        </ChartCard>

        <ChartCard title="Menu Category Performance">
          <CategoryBreakdown data={categoryData} />
        </ChartCard>

        <ChartCard title="Top Menu Items">
          <TopPerformers />
        </ChartCard>

        <View style={styles.quickStats}>
          <View style={styles.statRow}>
            <View style={styles.quickStatItem}>
              <Activity size={20} color={colors.primary} />
              <Text style={styles.quickStatValue}>78%</Text>
              <Text style={styles.quickStatLabel}>Occupancy Rate</Text>
            </View>
            <View style={styles.quickStatItem}>
              <Clock size={20} color={colors.success} />
              <Text style={styles.quickStatValue}>45min</Text>
              <Text style={styles.quickStatLabel}>Avg. Table Turn</Text>
            </View>
            <View style={styles.quickStatItem}>
              <Target size={20} color={colors.warning} />
              <Text style={styles.quickStatValue}>$67</Text>
              <Text style={styles.quickStatLabel}>Avg. Check Size</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
      
      <ReportsExport 
        visible={showReports} 
        onClose={() => setShowReports(false)} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
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
  title: { fontSize: 40, fontWeight: '900', color: colors.text, letterSpacing: -1.5 },
  subtitle: { fontSize: 16, color: colors.textLight, marginTop: 6, fontWeight: '600' },
  filterButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
    elevation: 4,
  },
  periodContainer: { paddingLeft: 28, marginTop: 28, marginBottom: 24 },
  periodContent: { paddingRight: 20, gap: 8 },
  periodButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: colors.white,
    ...shadows.card,
    elevation: 6,
  },
  periodButtonActive: { backgroundColor: colors.primary, ...shadows.large, elevation: 8 },
  periodButtonText: { fontSize: 15, fontWeight: '700', color: colors.textLight },
  periodButtonTextActive: { color: colors.white, fontWeight: '800' },
  scrollView: { flex: 1 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 28, gap: 24, marginBottom: 40 },
  metricCard: { backgroundColor: colors.white, borderRadius: 32, padding: 28, width: cardWidth, ...shadows.large, elevation: 18, borderWidth: 0, transform: [{ scale: 1 }] },
  metricHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  metricIcon: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  trendContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4 },
  trendText: { fontSize: 11, fontWeight: '700' },
  metricValue: { fontSize: 36, fontWeight: '900', color: colors.text, marginBottom: 8 },
  metricTitle: { fontSize: 15, color: colors.textLight, fontWeight: '800' },
  chartCard: {
    backgroundColor: colors.white,
    marginHorizontal: 28,
    marginBottom: 40,
    borderRadius: 32,
    padding: 32,
    ...shadows.large,
    elevation: 18,
    borderLeftWidth: 6,
    borderLeftColor: colors.primary,
    borderWidth: 0,
    transform: [{ scale: 1 }],
  },
  chartTitle: { fontSize: 24, fontWeight: '900', color: colors.text, marginBottom: 28 },
  chartToggle: { flexDirection: 'row', backgroundColor: colors.backgroundLight, borderRadius: 16, padding: 6, marginBottom: 24 },
  toggleButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, gap: 8 },
  toggleButtonActive: { backgroundColor: colors.primary, ...shadows.small, elevation: 3 },
  toggleText: { fontSize: 16, fontWeight: '700', color: colors.textLight },
  toggleTextActive: { color: colors.white },
  barChart: { alignItems: 'center' },
  chartContainer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', width: '100%', height: 140, marginBottom: 16 },
  barContainer: { alignItems: 'center', flex: 1 },
  barWrapper: { height: 120, justifyContent: 'flex-end', alignItems: 'center', width: '80%' },
  bar: { width: '100%', borderRadius: 4, minHeight: 4 },
  tooltip: { position: 'absolute', bottom: 126, paddingHorizontal: 8, paddingVertical: 6, backgroundColor: colors.black, borderRadius: 8, zIndex: 2 },
  tooltipText: { color: colors.white, fontSize: 11, fontWeight: '700' },
  barLabel: { fontSize: 10, color: colors.textLight, marginTop: 8, fontWeight: '600' },
  chartLegend: { alignItems: 'center' },
  chartValue: { fontSize: 28, fontWeight: '900', color: colors.text },
  chartSubtitle: { fontSize: 14, color: colors.textLight, marginTop: 4, fontWeight: '600' },
  pieChart: { width: '100%' },
  pieItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  pieColor: { width: 12, height: 12, borderRadius: 6, marginRight: 12 },
  pieName: { flex: 1, fontSize: 14, color: colors.text, fontWeight: '500' },
  pieValue: { fontSize: 14, fontWeight: '700', color: colors.text },
  topPerformers: { gap: 12 },
  performerItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  performerRank: { width: 32, height: 32, borderRadius: 16, backgroundColor: `${colors.primary}15`, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  rankNumber: { fontSize: 14, fontWeight: '700', color: colors.primary },
  performerInfo: { flex: 1 },
  performerName: { fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: 4 },
  performerStats: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  performerRating: { fontSize: 12, color: colors.textLight, fontWeight: '500' },
  performerPrice: { fontSize: 12, color: colors.success, fontWeight: '600' },
  quickStats: { marginHorizontal: 28, marginBottom: 40 },
  statRow: { flexDirection: 'row', backgroundColor: colors.white, borderRadius: 32, padding: 32, ...shadows.large, elevation: 18, borderLeftWidth: 6, borderLeftColor: colors.secondary, borderWidth: 0, transform: [{ scale: 1 }] },
  quickStatItem: { flex: 1, alignItems: 'center' },
  quickStatValue: { fontSize: 28, fontWeight: '900', color: colors.text, marginTop: 12, marginBottom: 8 },
  quickStatLabel: { fontSize: 13, color: colors.textLight, textAlign: 'center', fontWeight: '700' },
  bottomSpacing: { height: 32 },
});
