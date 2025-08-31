import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { MapPin, Star, Clock, Wifi, Coffee, ChevronRight, Shield, Heart, Filter } from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import { brcs } from '@/mocks/brcs';
import SearchBar from '@/components/SearchBar';

export default function CafesScreen() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const cafes = brcs.filter(brc => brc.type === 'cafe');

  const filters = [
    { id: 'all', label: 'All Cafes' },
    { id: 'specialty', label: 'Specialty Coffee' },
    { id: 'wifi', label: 'Work-Friendly' },
    { id: 'pastries', label: 'Fresh Pastries' },
  ];

  const filteredCafes = selectedFilter === 'all' 
    ? cafes 
    : cafes.filter(cafe => 
        cafe.tags.some(tag => 
          tag.toLowerCase().includes(selectedFilter.toLowerCase()) ||
          (selectedFilter === 'wifi' && tag.toLowerCase().includes('wifi')) ||
          (selectedFilter === 'specialty' && tag.toLowerCase().includes('coffee'))
        )
      );

  const handleCafePress = (id: string) => {
    router.push(`/brc/${id}`);
  };

  const handleVerifyBusiness = (cafeId: string, cafeName: string) => {
    Alert.alert(
      'Verify Business',
      `Are you the owner of ${cafeName}? This will start the business verification process.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Verify', 
          onPress: () => {
            Alert.alert('Verification Started', 'We\'ll review your request within 24-48 hours. You\'ll receive an email with next steps.');
          }
        }
      ]
    );
  };

  const toggleFavorite = (cafeId: string) => {
    setFavorites(prev => 
      prev.includes(cafeId) 
        ? prev.filter(id => id !== cafeId)
        : [...prev, cafeId]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cafés</Text>
        <Text style={styles.subtitle}>Find your perfect coffee spot</Text>
      </View>

      <SearchBar placeholder="Search cafés..." />

      {/* Filter Bar */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setFilterOpen(!filterOpen)}
        >
          <Filter size={16} color={colors.primary} />
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
        
        {filterOpen && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            {filters.map(filter => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterChip,
                  selectedFilter === filter.id && styles.activeFilterChip
                ]}
                onPress={() => setSelectedFilter(filter.id)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedFilter === filter.id && styles.activeFilterChipText
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Hero section */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }}
            style={styles.heroImage}
            contentFit="cover"
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Coffee Time</Text>
            <Text style={styles.heroSubtitle}>Discover cozy spots for your daily brew</Text>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <TouchableOpacity style={styles.categoryItem}>
            <View style={styles.categoryIcon}>
              <Coffee size={20} color={colors.primary} />
            </View>
            <Text style={styles.categoryText}>Specialty</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryItem}>
            <View style={styles.categoryIcon}>
              <Wifi size={20} color={colors.primary} />
            </View>
            <Text style={styles.categoryText}>Work-friendly</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryItem}>
            <View style={styles.categoryIcon}>
              <Coffee size={20} color={colors.primary} />
            </View>
            <Text style={styles.categoryText}>Pastries</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>Popular Cafés ({filteredCafes.length})</Text>
          {filteredCafes.map((cafe) => (
            <TouchableOpacity
              key={cafe.id}
              style={styles.cafeCard}
              onPress={() => handleCafePress(cafe.id)}
              activeOpacity={0.7}
            >
              <Image
                source={{ uri: cafe.image }}
                style={styles.cafeImage}
                contentFit="cover"
              />
              <View style={styles.cafeContent}>
                <Text style={styles.cafeName}>{cafe.name}</Text>
                <View style={styles.ratingRow}>
                  <Star size={14} color={colors.primary} fill={colors.primary} />
                  <Text style={styles.ratingText}>{cafe.rating}</Text>
                  <Text style={styles.reviewCount}>({cafe.reviewCount})</Text>
                </View>
                
                <View style={styles.tagsRow}>
                  {cafe.tags.slice(0, 3).map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
                
                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <MapPin size={12} color={colors.textLight} />
                    <Text style={styles.infoText}>{cafe.distance}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Clock size={12} color={colors.textLight} />
                    <Text style={styles.infoText}>
                      {cafe.openingHours.open} - {cafe.openingHours.close}
                    </Text>
                  </View>
                </View>
                
                {/* Action Buttons */}
                <View style={styles.actionRow}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => toggleFavorite(cafe.id)}
                  >
                    <Heart 
                      size={16} 
                      color={favorites.includes(cafe.id) ? colors.error : colors.textLight}
                      fill={favorites.includes(cafe.id) ? colors.error : 'none'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.verifyButton}
                    onPress={() => handleVerifyBusiness(cafe.id, cafe.name)}
                  >
                    <Shield size={14} color={colors.white} />
                    <Text style={styles.verifyButtonText}>Verify</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <ChevronRight size={20} color={colors.textLight} />
            </TouchableOpacity>
          ))}
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: colors.white,
  },
  title: {
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  heroContainer: {
    height: 200,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    overflow: 'hidden',
    ...shadows.medium,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  categoryItem: {
    alignItems: 'center',
    width: '30%',
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  listContainer: {
    marginTop: 16,
  },
  cafeCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    ...shadows.small,
  },
  cafeImage: {
    width: 100,
    height: 120,
  },
  cafeContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  cafeName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 2,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 10,
    color: colors.primaryDark,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  infoText: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 4,
  },
  filterContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.accent,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
    marginLeft: 6,
  },
  filterScroll: {
    marginTop: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.backgroundLight,
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textLight,
  },
  activeFilterChipText: {
    color: colors.white,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.backgroundLight,
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
  verifyButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
    marginLeft: 4,
  },
});