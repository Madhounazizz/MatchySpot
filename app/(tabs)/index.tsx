import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Coffee, Utensils, Wine, Sparkles, QrCode, ChefHat } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/colors';
import SearchBar from '@/components/SearchBar';
import CategoryPills from '@/components/CategoryPills';
import SectionHeader from '@/components/SectionHeader';
import BRCCard from '@/components/BRCCard';
import EventCard from '@/components/EventCard';
import UserCard from '@/components/UserCard';
import FoodCategoryCard from '@/components/FoodCategoryCard';
import { brcs, featuredBRCs, nearbyBRCs } from '@/mocks/brcs';
import { upcomingEvents } from '@/mocks/events';
import { suggestedUsers } from '@/mocks/users';
import { foodCategories } from '@/constants/foodCategories';

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
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <LinearGradient
          colors={[colors.primary + '10', colors.accent + '20', colors.white]}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <Text style={styles.greeting}>Hello, Alex 👋</Text>
            <Text style={styles.subtitle}>Discover amazing cuisines & connect with food lovers around you</Text>
          </View>
        </LinearGradient>
        
        <SearchBar />
        
        <CategoryPills
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />
        
        {/* Food Categories Section */}
        <View style={styles.cuisineSection}>
          <SectionHeader
            title="Explore World Cuisines"
            icon={<ChefHat size={20} color={colors.primary} />}
          />
          
          <View style={styles.foodCategoriesContainer}>
            {foodCategories.map((category) => (
              <FoodCategoryCard
                key={category.id}
                category={category}
                onPress={(categoryId) => {
                  console.log('Selected cuisine:', categoryId);
                  // Navigate to cuisine-specific restaurants
                  router.push('/discover');
                }}
              />
            ))}
          </View>
        </View>
        
        <SectionHeader
          title="Featured Places"
          onSeeAllPress={handleSeeAllBRCs}
        />
        
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
        
        <SectionHeader
          title="Upcoming Events"
          onSeeAllPress={handleSeeAllEvents}
        />
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        >
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </ScrollView>
        

        <SectionHeader
          title="Near You"
          onSeeAllPress={handleSeeAllBRCs}
        />
        
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
        <SectionHeader
          title="Scan QR Code"
        />
        
        <View style={styles.qrScannerSection}>
          <TouchableOpacity
            style={styles.qrScannerButton}
            onPress={() => router.push('/qr-scanner')}
          >
            <View style={styles.qrIconContainer}>
              <QrCode size={28} color={colors.primary} />
            </View>
            <View style={styles.qrTextContainer}>
              <Text style={styles.qrButtonText}>Scan QR Code</Text>
              <Text style={styles.qrSubText}>Order food & join chatroom</Text>
            </View>
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
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 16,
    marginBottom: 8,
  },
  header: {
    paddingHorizontal: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 16,
  },
  featuredContainer: {
    paddingLeft: 16,
    paddingRight: 8,
    marginBottom: 24,
  },
  featuredCardWrapper: {
    marginRight: 16,
    width: 300,
  },
  horizontalList: {
    paddingLeft: 16,
    paddingRight: 8,
    paddingBottom: 24,
  },
  usersContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  nearbyContainer: {
    paddingLeft: 16,
    paddingRight: 8,
    paddingBottom: 24,
  },
  nearbyCardWrapper: {
    marginRight: 12,
  },
  qrScannerSection: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  qrScannerButton: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  qrIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  qrTextContainer: {
    flex: 1,
  },
  qrButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  qrSubText: {
    fontSize: 14,
    color: colors.textLight,
  },
  testQRButton: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  testQRText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textLight,
    textAlign: 'center',
  },
  cuisineSection: {
    backgroundColor: colors.backgroundLight,
    marginHorizontal: 8,
    borderRadius: 20,
    paddingVertical: 8,
    marginBottom: 24,
  },
  foodCategoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
});