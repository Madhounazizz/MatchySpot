import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  CheckCircle2, 
  Circle, 
  MapPin, 
  Search, 
  Filter, 
  Star, 
  DollarSign, 
  Calendar, 
  Users, 
  Gift, 
  Share2, 
  Bell, 
  TrendingUp, 
  Camera, 
  MessageCircle, 
  Navigation, 
  Percent, 
  Award, 
  Settings, 
  BarChart3, 
  Clock, 
  Target 
} from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import { useLanguage } from '@/store/useLanguageStore';

interface TodoItem {
  id: string;
  title: string;
  description: string;
  category: 'core' | 'discovery' | 'booking' | 'social' | 'tokens' | 'brc' | 'ux';
  priority: 'high' | 'medium' | 'low';
  status: 'missing' | 'partial' | 'complete';
  icon: React.ReactNode;
  estimatedHours: number;
}

const todoItems: TodoItem[] = [
  // 🎯 Core Location & Discovery Features
  {
    id: '1',
    title: 'Location Detection & Map Integration',
    description: 'Auto-detect user location and show nearby BRCs on interactive map with real-time updates',
    category: 'core',
    priority: 'high',
    status: 'missing',
    icon: <MapPin size={20} color={colors.primary} />,
    estimatedHours: 8
  },
  {
    id: '2',
    title: 'Advanced Search & Filters',
    description: 'Filter BRCs by distance, rating, price range, cuisine type, and availability',
    category: 'discovery',
    priority: 'high',
    status: 'partial',
    icon: <Filter size={20} color={colors.primary} />,
    estimatedHours: 6
  },
  {
    id: '3',
    title: 'Promotion Badges & Highlights',
    description: 'Visual badges for active promos (20% off, happy hour) with expiry timers',
    category: 'discovery',
    priority: 'medium',
    status: 'missing',
    icon: <Percent size={20} color={colors.primary} />,
    estimatedHours: 4
  },
  {
    id: '4',
    title: 'Navigation to BRC',
    description: 'In-app navigation from user location to selected BRC with turn-by-turn directions',
    category: 'core',
    priority: 'high',
    status: 'missing',
    icon: <Navigation size={20} color={colors.primary} />,
    estimatedHours: 6
  },

  // 📅 Booking & Events
  {
    id: '5',
    title: 'Event Booking System',
    description: 'Book events with limited spots, see attendee count, and manage event reservations',
    category: 'booking',
    priority: 'high',
    status: 'partial',
    icon: <Calendar size={20} color={colors.primary} />,
    estimatedHours: 8
  },
  {
    id: '6',
    title: 'Table Booking Confirmation',
    description: 'Instant booking confirmation with contact info sharing to BRC owners',
    category: 'booking',
    priority: 'high',
    status: 'complete',
    icon: <CheckCircle2 size={20} color={colors.success} />,
    estimatedHours: 0
  },
  {
    id: '7',
    title: 'Booking Status Management',
    description: 'Track booking status (Confirmed/Pending/Canceled) with real-time updates',
    category: 'booking',
    priority: 'medium',
    status: 'partial',
    icon: <Clock size={20} color={colors.primary} />,
    estimatedHours: 4
  },

  // 🪙 Token System Enhancement
  {
    id: '8',
    title: 'Review Rewards System',
    description: 'Automatic +20 tokens for posting reviews with photo upload bonus',
    category: 'tokens',
    priority: 'high',
    status: 'complete',
    icon: <Award size={20} color={colors.success} />,
    estimatedHours: 0
  },
  {
    id: '9',
    title: 'Referral Program',
    description: 'Invite friends system with +50 tokens for both users when friend makes first booking',
    category: 'social',
    priority: 'high',
    status: 'partial',
    icon: <Share2 size={20} color={colors.primary} />,
    estimatedHours: 6
  },
  {
    id: '10',
    title: 'Token Balance Visibility',
    description: 'Prominent token balance display in profile with transaction history',
    category: 'tokens',
    priority: 'medium',
    status: 'complete',
    icon: <DollarSign size={20} color={colors.success} />,
    estimatedHours: 0
  },

  // 📱 Social Features
  {
    id: '11',
    title: 'Photo Upload for Reviews',
    description: 'Allow users to upload photos of dishes/events with reviews for extra tokens',
    category: 'social',
    priority: 'medium',
    status: 'missing',
    icon: <Camera size={20} color={colors.primary} />,
    estimatedHours: 5
  },
  {
    id: '12',
    title: 'Push Notifications',
    description: 'Booking confirmations, event reminders, promo alerts, and token earnings notifications',
    category: 'core',
    priority: 'high',
    status: 'missing',
    icon: <Bell size={20} color={colors.primary} />,
    estimatedHours: 4
  },
  {
    id: '13',
    title: 'Social Proof & Reviews',
    description: 'Display user reviews with ratings, helpful votes, and review authenticity verification',
    category: 'social',
    priority: 'medium',
    status: 'partial',
    icon: <Star size={20} color={colors.primary} />,
    estimatedHours: 6
  },

  // 🏪 BRC Dashboard Enhancements
  {
    id: '14',
    title: 'Advanced Menu Management',
    description: 'Rich menu editor with categories, dietary info, availability status, and pricing',
    category: 'brc',
    priority: 'medium',
    status: 'partial',
    icon: <Settings size={20} color={colors.primary} />,
    estimatedHours: 8
  },
  {
    id: '15',
    title: 'Promotion Creation Tools',
    description: 'Create time-limited promotions with discount percentages and target audience',
    category: 'brc',
    priority: 'medium',
    status: 'missing',
    icon: <TrendingUp size={20} color={colors.primary} />,
    estimatedHours: 6
  },
  {
    id: '16',
    title: 'Event Management System',
    description: 'Create events with limited spots, pricing, descriptions, and attendee management',
    category: 'brc',
    priority: 'medium',
    status: 'partial',
    icon: <Users size={20} color={colors.primary} />,
    estimatedHours: 7
  },
  {
    id: '17',
    title: 'No-Show Management',
    description: 'Mark no-shows, implement penalties, and manage reservation reliability scores',
    category: 'brc',
    priority: 'low',
    status: 'missing',
    icon: <Target size={20} color={colors.primary} />,
    estimatedHours: 4
  },
  {
    id: '18',
    title: 'Analytics Dashboard',
    description: 'Revenue tracking, popular items, peak hours, customer demographics, and booking trends',
    category: 'brc',
    priority: 'medium',
    status: 'partial',
    icon: <BarChart3 size={20} color={colors.primary} />,
    estimatedHours: 10
  },

  // 🎨 UX/UI Improvements
  {
    id: '19',
    title: 'Onboarding Flow',
    description: 'Welcome tutorial explaining token system, booking process, and key features',
    category: 'ux',
    priority: 'medium',
    status: 'missing',
    icon: <Gift size={20} color={colors.primary} />,
    estimatedHours: 5
  },
  {
    id: '20',
    title: 'Offline Mode Support',
    description: 'Cache essential data for offline viewing of saved BRCs and booking history',
    category: 'ux',
    priority: 'low',
    status: 'missing',
    icon: <Circle size={20} color={colors.primary} />,
    estimatedHours: 8
  }
];

export default function TodoFeaturesScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Features', color: colors.text },
    { id: 'core', name: 'Core', color: colors.primary },
    { id: 'discovery', name: 'Discovery', color: colors.secondary },
    { id: 'booking', name: 'Booking', color: colors.warning },
    { id: 'social', name: 'Social', color: colors.info },
    { id: 'tokens', name: 'Tokens', color: colors.success },
    { id: 'brc', name: 'BRC Tools', color: colors.primaryDark },
    { id: 'ux', name: 'UX/UI', color: colors.textLight }
  ];

  const priorities = [
    { id: 'all', name: 'All Priority', color: colors.text },
    { id: 'high', name: 'High', color: colors.error },
    { id: 'medium', name: 'Medium', color: colors.warning },
    { id: 'low', name: 'Low', color: colors.success }
  ];

  const filteredItems = todoItems.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
    const priorityMatch = selectedPriority === 'all' || item.priority === selectedPriority;
    return categoryMatch && priorityMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return colors.success;
      case 'partial': return colors.warning;
      case 'missing': return colors.error;
      default: return colors.textLight;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'complete': return '✅ Complete';
      case 'partial': return '🔄 Partial';
      case 'missing': return '❌ Missing';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.textLight;
    }
  };

  const stats = {
    total: todoItems.length,
    complete: todoItems.filter(item => item.status === 'complete').length,
    partial: todoItems.filter(item => item.status === 'partial').length,
    missing: todoItems.filter(item => item.status === 'missing').length,
    totalHours: todoItems.reduce((sum, item) => sum + item.estimatedHours, 0),
    remainingHours: todoItems.filter(item => item.status !== 'complete').reduce((sum, item) => sum + item.estimatedHours, 0)
  };

  const handleImplementFeature = (item: TodoItem) => {
    Alert.alert(
      'Implement Feature',
      `Would you like to implement "${item.title}"?\n\nEstimated time: ${item.estimatedHours} hours\nPriority: ${item.priority.toUpperCase()}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Implement', 
          onPress: () => {
            // Here we would trigger the actual implementation
            Alert.alert('Feature Implementation', 'This feature will be implemented following the app\'s design system and best practices.');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🚀 Feature Development Roadmap</Text>
          <Text style={styles.subtitle}>Missing features analysis based on user story requirements</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: colors.backgroundLight }]}>
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total Features</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.accent }]}>
              <Text style={[styles.statNumber, { color: colors.success }]}>{stats.complete}</Text>
              <Text style={styles.statLabel}>Complete</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: '#FFF3CD' }]}>
              <Text style={[styles.statNumber, { color: colors.warning }]}>{stats.partial}</Text>
              <Text style={styles.statLabel}>Partial</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#F8D7DA' }]}>
              <Text style={[styles.statNumber, { color: colors.error }]}>{stats.missing}</Text>
              <Text style={styles.statLabel}>Missing</Text>
            </View>
          </View>
          <View style={[styles.statCard, styles.fullWidthCard, { backgroundColor: colors.primaryLight + '20' }]}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{stats.remainingHours}h</Text>
            <Text style={styles.statLabel}>Estimated Development Time Remaining</Text>
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <Text style={styles.filterTitle}>Filter by Category:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.filterChip,
                  selectedCategory === category.id && { backgroundColor: category.color + '20', borderColor: category.color }
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedCategory === category.id && { color: category.color, fontWeight: '600' }
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.filterTitle}>Filter by Priority:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {priorities.map((priority) => (
              <TouchableOpacity
                key={priority.id}
                style={[
                  styles.filterChip,
                  selectedPriority === priority.id && { backgroundColor: priority.color + '20', borderColor: priority.color }
                ]}
                onPress={() => setSelectedPriority(priority.id)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedPriority === priority.id && { color: priority.color, fontWeight: '600' }
                ]}>
                  {priority.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Todo Items */}
        <View style={styles.todoContainer}>
          <Text style={styles.sectionTitle}>
            📋 Features ({filteredItems.length})
          </Text>
          
          {filteredItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.todoItem}
              onPress={() => handleImplementFeature(item)}
              activeOpacity={0.7}
            >
              <View style={styles.todoHeader}>
                <View style={styles.todoIconContainer}>
                  {item.icon}
                </View>
                <View style={styles.todoContent}>
                  <View style={styles.todoTitleRow}>
                    <Text style={styles.todoTitle}>{item.title}</Text>
                    <View style={styles.todoBadges}>
                      <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) + '20' }]}>
                        <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>
                          {item.priority.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.todoDescription}>{item.description}</Text>
                  <View style={styles.todoFooter}>
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                      {getStatusText(item.status)}
                    </Text>
                    <Text style={styles.estimateText}>⏱️ {item.estimatedHours}h</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Implementation Guide */}
        <View style={styles.guideContainer}>
          <Text style={styles.guideTitle}>🎯 Implementation Priority Guide</Text>
          <View style={styles.guideItem}>
            <Text style={styles.guideLabel}>🔴 High Priority:</Text>
            <Text style={styles.guideText}>Core functionality that directly impacts user experience and app usability</Text>
          </View>
          <View style={styles.guideItem}>
            <Text style={styles.guideLabel}>🟡 Medium Priority:</Text>
            <Text style={styles.guideText}>Features that enhance user engagement and business value</Text>
          </View>
          <View style={styles.guideItem}>
            <Text style={styles.guideLabel}>🟢 Low Priority:</Text>
            <Text style={styles.guideText}>Nice-to-have features that can be implemented later</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    lineHeight: 22,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    ...shadows.small,
  },
  fullWidthCard: {
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    fontWeight: '500',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    marginTop: 8,
  },
  filterScroll: {
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.backgroundLight,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500',
  },
  todoContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  todoItem: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
  },
  todoHeader: {
    flexDirection: 'row',
  },
  todoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  todoContent: {
    flex: 1,
  },
  todoTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  todoBadges: {
    flexDirection: 'row',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
  },
  todoDescription: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
    marginBottom: 12,
  },
  todoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  estimateText: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '500',
  },
  guideContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  guideTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  guideItem: {
    marginBottom: 12,
  },
  guideLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  guideText: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
});