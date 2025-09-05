import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Coffee, Utensils, Wine, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/colors';
import SearchBar from '@/components/SearchBar';
import CategoryPills from '@/components/CategoryPills';
import SectionHeader from '@/components/SectionHeader';
import BRCCard from '@/components/BRCCard';
import EventCard from '@/components/EventCard';
import { featuredBRCs, nearbyBRCs } from '@/mocks/brcs';
import { upcomingEvents } from '@/mocks/events';


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

  nearbyContainer: {
    paddingLeft: 16,
    paddingRight: 8,
    paddingBottom: 24,
  },
  nearbyCardWrapper: {
    marginRight: 12,
  },


});