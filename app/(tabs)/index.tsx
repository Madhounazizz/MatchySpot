import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Coffee, Utensils, Wine, Sparkles, QrCode, TrendingUp } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, shadows, typography, borderRadius, spacing } from '@/constants/colors';

const { width } = Dimensions.get('window');
import SearchBar from '@/components/SearchBar';
import CategoryPills from '@/components/CategoryPills';
import SectionHeader from '@/components/SectionHeader';
import BRCCard from '@/components/BRCCard';
import EventCard from '@/components/EventCard';
import UserCard from '@/components/UserCard';
import { brcs, featuredBRCs, nearbyBRCs } from '@/mocks/brcs';
import { upcomingEvents } from '@/mocks/events';
import { suggestedUsers } from '@/mocks/users';

const categories = [
  { id: 'all', name: 'All', gradient: ['#FF6B6B', '#FF8A80'] as const },
  { id: 'restaurant', name: 'Restaurants', icon: <Utensils size={16} color={colors.white} />, gradient: ['#FF9800', '#FFB74D'] as const },
  { id: 'cafe', name: 'Cafés', icon: <Coffee size={16} color={colors.white} />, gradient: ['#8BC34A', '#AED581'] as const },
  { id: 'bar', name: 'Bars', icon: <Wine size={16} color={colors.white} />, gradient: ['#9C27B0', '#BA68C8'] as const },
  { id: 'trending', name: 'Trending', icon: <TrendingUp size={16} color={colors.white} />, gradient: ['#FF5722', '#FF8A65'] as const },
];

export default function HomeScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
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
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    
    // Navigate to specific category pages
    if (categoryId === 'restaurant') {
      router.push('/restaurants');
    } else if (categoryId === 'cafe') {
      router.push('/cafes');
    } else if (categoryId === 'bar') {
      router.push('/bars');
    }
  };

  const handleSeeAllBRCs = () => {
    router.push('/discover');
  };

  const handleSeeAllEvents = () => {
    router.push('/(tabs)/discover');
  };



  const filteredBRCs = selectedCategory === 'all' 
    ? brcs 
    : brcs.filter(brc => brc.type === selectedCategory);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF6B6B', '#FF8A80', '#FFAB91']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>Hello, Alex 👋</Text>
            <View style={styles.statusBadge}>
              <View style={styles.onlineDot} />
              <Text style={styles.statusText}>Online</Text>
            </View>
          </View>
          <Text style={styles.subtitle}>Discover amazing places & connect with people</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Matches</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Visits</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
          </View>
        </Animated.View>
      </LinearGradient>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        
        <View style={styles.searchContainer}>
          <SearchBar />
        </View>
        
        <Animated.View 
          style={[
            styles.categoryContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryPill,
                  selectedCategory === category.id && styles.categoryPillActive,
                ]}
                onPress={() => handleCategorySelect(category.id)}
                activeOpacity={0.8}
              >
                {selectedCategory === category.id ? (
                  <LinearGradient
                    colors={category.gradient || ['#FF6B6B', '#FF8A80']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.categoryGradient}
                  >
                    {category.icon && (
                      <View style={styles.categoryIcon}>
                        {category.icon}
                      </View>
                    )}
                    <Text style={styles.categoryTextActive}>{category.name}</Text>
                  </LinearGradient>
                ) : (
                  <>
                    {category.icon && (
                      <View style={styles.categoryIconInactive}>
                        {React.cloneElement(category.icon, { color: colors.textLight })}
                      </View>
                    )}
                    <Text style={styles.categoryText}>{category.name}</Text>
                  </>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.sectionContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.sectionHeaderContainer}>
            <View>
              <Text style={styles.sectionTitle}>Featured Places</Text>
              <Text style={styles.sectionSubtitle}>Handpicked for you</Text>
            </View>
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={handleSeeAllBRCs}
              activeOpacity={0.7}
            >
              <Text style={styles.seeAllText}>See All</Text>
              <View style={styles.seeAllArrow}>
                <Text style={styles.arrowText}>→</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredContainer}
        >
          {featuredBRCs.map((brc) => (
            <View key={brc.id} style={styles.featuredCardWrapper}>
              <BRCCard brc={brc} size="large" />
            </View>
          ))}
        </ScrollView>
        
        <View style={styles.sectionContainer}>
          <SectionHeader
            title="Upcoming Events"
            onSeeAllPress={handleSeeAllEvents}
          />
        </View>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        >
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </ScrollView>
        

        <View style={styles.sectionContainer}>
          <SectionHeader
            title="Near You"
            onSeeAllPress={handleSeeAllBRCs}
          />
        </View>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.nearbyContainer}
        >
          {nearbyBRCs.map((brc) => (
            <View key={brc.id} style={styles.nearbyCardWrapper}>
              <BRCCard brc={brc} size="small" />
            </View>
          ))}
        </ScrollView>
        
        {/* QR Scanner Section */}
        <View style={styles.sectionContainer}>
          <SectionHeader
            title="Quick Actions"
          />
        </View>
        
        <View style={styles.qrScannerSection}>
          <TouchableOpacity
            style={styles.qrScannerButton}
            onPress={() => router.push('/qr-scanner')}
          >
            <LinearGradient
              colors={[colors.secondary, colors.secondaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.qrGradientBackground}
            >
              <View style={styles.qrIconContainer}>
                <QrCode size={32} color={colors.white} />
              </View>
              <View style={styles.qrTextContainer}>
                <Text style={styles.qrButtonText}>Scan QR Code</Text>
                <Text style={styles.qrSubText}>Order food & join chatroom</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
          
          {/* Test QR Codes Link */}
          <TouchableOpacity
            style={styles.testQRButton}
            onPress={() => router.push('/test-qr')}
          >
            <Text style={styles.testQRText}>📱 View Test QR Codes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: borderRadius['3xl'],
    borderBottomRightRadius: borderRadius['3xl'],
  },
  
  header: {
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  
  greeting: {
    fontSize: typography.sizes['4xl'],
    fontWeight: typography.weights.extrabold,
    color: colors.textInverse,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  
  subtitle: {
    fontSize: typography.sizes.lg,
    color: colors.textInverse,
    opacity: 0.9,
    textAlign: 'center',
  },
  
  scrollView: {
    flex: 1,
    marginTop: -20,
  },
  
  contentContainer: {
    paddingTop: 20,
    paddingBottom: 100,
  },
  
  searchContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  
  sectionContainer: {
    paddingHorizontal: spacing.md,
  },
  featuredContainer: {
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
    marginBottom: spacing.lg,
  },
  
  featuredCardWrapper: {
    marginRight: spacing.md,
    width: 300,
  },
  
  horizontalList: {
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
    paddingBottom: spacing.lg,
  },
  
  usersContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  
  nearbyContainer: {
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
    paddingBottom: spacing.lg,
  },
  
  nearbyCardWrapper: {
    marginRight: spacing.sm,
  },
  qrScannerSection: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  
  qrScannerButton: {
    borderRadius: borderRadius['2xl'],
    marginBottom: spacing.sm,
    overflow: 'hidden',
    ...shadows.large,
  },
  
  qrGradientBackground: {
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  qrIconContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  
  qrTextContainer: {
    flex: 1,
  },
  
  qrButtonText: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textInverse,
    marginBottom: spacing.xs,
  },
  
  qrSubText: {
    fontSize: typography.sizes.sm,
    color: colors.textInverse,
    opacity: 0.9,
  },
  
  testQRButton: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.small,
  },
  
  testQRText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textLight,
    textAlign: 'center',
  },
  
  // New enhanced styles
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.sm,
  },
  
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: spacing.xs,
  },
  
  statusText: {
    fontSize: typography.sizes.xs,
    color: colors.textInverse,
    fontWeight: typography.weights.medium,
  },
  
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginTop: spacing.lg,
    width: '100%',
  },
  
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  
  statNumber: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extrabold,
    color: colors.textInverse,
    marginBottom: spacing.xs,
  },
  
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textInverse,
    opacity: 0.8,
    fontWeight: typography.weights.medium,
  },
  
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignSelf: 'center',
  },
  
  categoryContainer: {
    marginBottom: spacing.lg,
  },
  
  categoriesScroll: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  
  categoryPill: {
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.small,
  },
  
  categoryPillActive: {
    borderColor: 'transparent',
    ...shadows.medium,
  },
  
  categoryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  
  categoryIcon: {
    marginRight: spacing.xs,
  },
  
  categoryIconInactive: {
    marginRight: spacing.xs,
    marginLeft: spacing.md,
  },
  
  categoryTextActive: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textInverse,
  },
  
  categoryText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.md,
  },
  
  sectionTitle: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.extrabold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  
  sectionSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textLight,
    fontWeight: typography.weights.medium,
  },
  
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    ...shadows.small,
  },
  
  seeAllText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
    marginRight: spacing.xs,
  },
  
  seeAllArrow: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  arrowText: {
    fontSize: typography.sizes.sm,
    color: colors.textInverse,
    fontWeight: typography.weights.bold,
  },
});