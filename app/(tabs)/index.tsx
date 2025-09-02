import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Coffee, Utensils, Wine, Sparkles, QrCode } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, shadows, typography, borderRadius, spacing } from '@/constants/colors';
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
  { id: 'all', name: 'All' },
  { id: 'restaurant', name: 'Restaurants', icon: <Utensils size={16} color={colors.textLight} /> },
  { id: 'cafe', name: 'Cafés', icon: <Coffee size={16} color={colors.textLight} /> },
  { id: 'bar', name: 'Bars', icon: <Wine size={16} color={colors.textLight} /> },
  { id: 'trending', name: 'Trending', icon: <Sparkles size={16} color={colors.textLight} /> },
];

export default function HomeScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');

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
        colors={[colors.primary, colors.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, Alex 👋</Text>
          <Text style={styles.subtitle}>Find your perfect match today</Text>
        </View>
      </LinearGradient>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        
        <View style={styles.searchContainer}>
          <SearchBar />
        </View>
        
        <CategoryPills
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />
        
        <View style={styles.sectionContainer}>
          <SectionHeader
            title="Featured Places"
            onSeeAllPress={handleSeeAllBRCs}
          />
        </View>
        
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
});