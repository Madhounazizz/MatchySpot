import React, { useState, useMemo } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Alert, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { MapPin, Star, Clock, Coffee, ChevronRight, Shield, Heart, Filter, TrendingUp } from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import { brcs } from '@/mocks/brcs';
import SearchBar from '@/components/SearchBar';
import BRCCard from '@/components/BRCCard';
import { useTranslation } from '@/store/useLanguageStore';
import { LinearGradient } from 'expo-linear-gradient';



export default function CafesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const cafes = useMemo(() => brcs.filter(brc => brc.type === 'cafe'), []);
  const featuredCafes = useMemo(() => cafes.filter(cafe => cafe.rating >= 4.5).slice(0, 3), [cafes]);
  const nearbyCafes = useMemo(() => cafes.filter(cafe => cafe.distance && parseFloat(cafe.distance.replace(' mi', '')) <= 1.0), [cafes]);

  const filters = [
    { id: 'all', label: t('allCafes'), icon: Coffee },
    { id: 'trending', label: t('trending'), icon: TrendingUp },
  ];

  const filteredCafes = useMemo(() => {
    let filtered = cafes;
    
    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(cafe => 
        cafe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cafe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        cafe.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(cafe => {
        switch (selectedFilter) {
          case 'trending':
            return cafe.rating >= 4.5 && cafe.reviewCount >= 200;
          default:
            return true;
        }
      });
    }
    
    return filtered.sort((a, b) => {
      // Sort by rating first, then by review count
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.reviewCount - a.reviewCount;
    });
  }, [cafes, searchQuery, selectedFilter]);

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

      <SearchBar 
        placeholder={t('searchCafes')} 
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Filter Bar */}
      <View style={styles.filterContainer}>
        <View style={styles.filterHeader}>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setFilterOpen(!filterOpen)}
          >
            <Filter size={16} color={colors.primary} />
            <Text style={styles.filterButtonText}>{t('filter')}</Text>
          </TouchableOpacity>
          
          <View style={styles.viewModeContainer}>
            <TouchableOpacity 
              style={[styles.viewModeButton, viewMode === 'grid' && styles.activeViewMode]}
              onPress={() => setViewMode('grid')}
            >
              <Text style={[styles.viewModeText, viewMode === 'grid' && styles.activeViewModeText]}>Grid</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.viewModeButton, viewMode === 'list' && styles.activeViewMode]}
              onPress={() => setViewMode('list')}
            >
              <Text style={[styles.viewModeText, viewMode === 'list' && styles.activeViewModeText]}>List</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {filterOpen && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            {filters.map(filter => {
              const IconComponent = filter.icon;
              return (
                <TouchableOpacity
                  key={filter.id}
                  style={[
                    styles.filterChip,
                    selectedFilter === filter.id && styles.activeFilterChip
                  ]}
                  onPress={() => setSelectedFilter(filter.id)}
                >
                  <IconComponent 
                    size={14} 
                    color={selectedFilter === filter.id ? colors.white : colors.primary} 
                  />
                  <Text style={[
                    styles.filterChipText,
                    selectedFilter === filter.id && styles.activeFilterChipText
                  ]}>
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
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
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.heroOverlay}
          >
            <Text style={styles.heroTitle}>{t('coffeeTime')}</Text>
            <Text style={styles.heroSubtitle}>{t('discoverCozySpots')}</Text>
            <View style={styles.heroStats}>
              <View style={styles.heroStat}>
                <Coffee size={16} color={colors.white} />
                <Text style={styles.heroStatText}>{cafes.length} {t('cafes')}</Text>
              </View>
              <View style={styles.heroStat}>
                <Star size={16} color={colors.white} />
                <Text style={styles.heroStatText}>{(cafes.reduce((sum, cafe) => sum + cafe.rating, 0) / cafes.length).toFixed(1)} {t('avgRating')}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Featured Cafes */}
        {featuredCafes.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('featuredCafes')}</Text>
              <TouchableOpacity onPress={() => router.push('/discover')}>
                <Text style={styles.seeAllText}>{t('seeAll')}</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={featuredCafes}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => `featured-${item.id}`}
              renderItem={({ item }) => (
                <BRCCard brc={item} size="large" />
              )}
              contentContainerStyle={styles.horizontalList}
            />
          </View>
        )}
        
        {/* Nearby Cafes */}
        {nearbyCafes.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('nearbyCafes')}</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>{t('seeAll')}</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={nearbyCafes}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => `nearby-${item.id}`}
              renderItem={({ item }) => (
                <BRCCard brc={item} size="medium" />
              )}
              contentContainerStyle={styles.horizontalList}
            />
          </View>
        )}
        


        {/* All Cafes */}
        <View style={styles.listContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedFilter === 'all' ? t('allCafes') : filters.find(f => f.id === selectedFilter)?.label} ({filteredCafes.length})
            </Text>
            {searchQuery && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.clearSearchText}>{t('clear')}</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {filteredCafes.length === 0 ? (
            <View style={styles.emptyState}>
              <Coffee size={48} color={colors.textLight} />
              <Text style={styles.emptyStateTitle}>{t('noCafesFound')}</Text>
              <Text style={styles.emptyStateSubtitle}>{t('tryDifferentFilter')}</Text>
            </View>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <FlatList
                  data={filteredCafes}
                  numColumns={2}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.gridItem}>
                      <BRCCard brc={item} size="small" />
                    </View>
                  )}
                  contentContainerStyle={styles.gridContainer}
                  scrollEnabled={false}
                />
              ) : (
                filteredCafes.map((cafe) => (
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
                          <Text style={styles.verifyButtonText}>{t('verify')}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <ChevronRight size={20} color={colors.textLight} />
                  </TouchableOpacity>
                ))
              )}
            </>
          )}
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
    justifyContent: 'flex-end',
  },
  heroStats: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 20,
  },
  heroStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroStatText: {
    fontSize: 12,
    color: colors.white,
    marginLeft: 6,
    fontWeight: '500',
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
  sectionContainer: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  horizontalList: {
    paddingLeft: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  clearSearchText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.error,
  },
  listContainer: {
    marginTop: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
  gridContainer: {
    paddingHorizontal: 8,
  },
  gridItem: {
    flex: 1,
    paddingHorizontal: 8,
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
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewModeContainer: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundLight,
    borderRadius: 20,
    padding: 2,
  },
  viewModeButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 18,
  },
  activeViewMode: {
    backgroundColor: colors.white,
    ...shadows.small,
  },
  viewModeText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textLight,
  },
  activeViewModeText: {
    color: colors.primary,
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
    flexDirection: 'row',
    alignItems: 'center',
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
    marginLeft: 6,
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