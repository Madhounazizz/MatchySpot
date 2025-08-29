import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Coffee, Utensils, Wine, Sparkles, QrCode } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/colors';
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
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, Alex 👋</Text>
          <Text style={styles.subtitle}>Find your perfect match today</Text>
        </View>
        
        <SearchBar />
        
        {/* QR Scanner Button with Fox Design */}
        <TouchableOpacity
          style={styles.qrScannerButton}
          onPress={() => router.push('/qr-scanner')}
        >
          <LinearGradient
            colors={['#FF6B35', '#F7931E']}
            style={styles.qrGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.foxContainer}>
              <Text style={styles.foxEmoji}>🦊</Text>
              <QrCode size={24} color="#FFF" />
            </View>
            <View style={styles.qrTextContainer}>
              <Text style={styles.qrButtonText}>Scan QR Code</Text>
              <Text style={styles.qrSubText}>Order & Join Chatroom</Text>
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
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
  qrScannerButton: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  qrGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    gap: 16,
  },
  foxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  foxEmoji: {
    fontSize: 28,
  },
  qrTextContainer: {
    alignItems: 'center',
  },
  qrButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  qrSubText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFF',
    opacity: 0.9,
    marginTop: 2,
  },
  testQRButton: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#4ECDC4',
    borderStyle: 'dashed',
  },
  testQRText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4ECDC4',
    textAlign: 'center',
  },
});