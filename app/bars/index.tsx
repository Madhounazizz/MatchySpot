import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { MapPin, Star, Clock, CloudHail, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, shadows } from '@/constants/colors';
import { brcs } from '@/mocks/brcs';
import SearchBar from '@/components/SearchBar';

export default function BarsScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const bars = brcs.filter(brc => brc.type === 'bar');

  const handleBarPress = (id: string) => {
    router.push(`/brc/${id}`);
  };

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'cocktails', label: 'Cocktails' },
    { id: 'wine', label: 'Wine' },
    { id: 'music', label: 'Live Music' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'transparent']}
          style={styles.headerGradient}
        />
        <Text style={styles.title}>Bars & Nightlife</Text>
        <Text style={styles.subtitle}>Discover the best spots for your night out</Text>
      </View>

      <SearchBar placeholder="Search bars..." />

      <View style={styles.filtersContainer}>
        {filters.map(filter => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterButton,
              activeFilter === filter.id && styles.activeFilterButton
            ]}
            onPress={() => setActiveFilter(filter.id)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === filter.id && styles.activeFilterText
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.featuredContainer}>
          <Text style={styles.sectionTitle}>Featured Bars</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredScroll}
          >
            {bars.map((bar) => (
              <TouchableOpacity 
                key={bar.id} 
                style={styles.featuredCard}
                onPress={() => handleBarPress(bar.id)}
                activeOpacity={0.9}
              >
                <ImageBackground
                  source={{ uri: bar.image }}
                  style={styles.featuredImage}
                  imageStyle={styles.featuredImageStyle}
                >
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.cardGradient}
                  >
                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>{bar.name}</Text>
                      <View style={styles.cardRating}>
                        <Star size={14} color={colors.primary} fill={colors.primary} />
                        <Text style={styles.ratingText}>{bar.rating}</Text>
                      </View>
                      
                      <View style={styles.cardTags}>
                        {bar.tags.slice(0, 2).map((tag, index) => (
                          <View key={index} style={styles.tag}>
                            <Text style={styles.tagText}>{tag}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </LinearGradient>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.specialsContainer}>
          <Text style={styles.sectionTitle}>Tonight&apos;s Specials</Text>
          <View style={styles.specialCard}>
            <View style={styles.specialContent}>
              <Text style={styles.specialTitle}>Happy Hour</Text>
              <Text style={styles.specialDescription}>
                50% off all cocktails from 5-7pm at select locations
              </Text>
              <TouchableOpacity style={styles.specialButton}>
                <Text style={styles.specialButtonText}>View Bars</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.specialIconContainer}>
              <CloudHail size={40} color={colors.primary} />
            </View>
          </View>
        </View>

        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>Popular Bars</Text>
          {bars.map((bar) => (
            <TouchableOpacity
              key={bar.id}
              style={styles.barItem}
              onPress={() => handleBarPress(bar.id)}
              activeOpacity={0.7}
            >
              <Image
                source={{ uri: bar.image }}
                style={styles.barItemImage}
                contentFit="cover"
              />
              <View style={styles.barItemContent}>
                <Text style={styles.barItemName}>{bar.name}</Text>
                <View style={styles.infoRow}>
                  <Star size={12} color={colors.primary} fill={colors.primary} />
                  <Text style={styles.smallRating}>{bar.rating}</Text>
                  <Text style={styles.reviewCount}>({bar.reviewCount})</Text>
                </View>
                <View style={styles.tagsRow}>
                  {bar.tags.slice(0, 2).map((tag, index) => (
                    <View key={index} style={styles.smallTag}>
                      <Text style={styles.smallTagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <MapPin size={12} color={colors.textLight} />
                    <Text style={styles.infoText}>{bar.distance}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Clock size={12} color={colors.textLight} />
                    <Text style={styles.infoText}>
                      {bar.openingHours.open} - {bar.openingHours.close}
                    </Text>
                  </View>
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
    backgroundColor: colors.text,
    position: 'relative',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.8,
    marginBottom: 16,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: colors.backgroundLight,
  },
  activeFilterButton: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textLight,
  },
  activeFilterText: {
    color: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  featuredContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  featuredScroll: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  featuredCard: {
    width: 240,
    height: 320,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    ...shadows.medium,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  featuredImageStyle: {
    borderRadius: 16,
  },
  cardGradient: {
    height: '70%',
    justifyContent: 'flex-end',
    padding: 16,
  },
  cardContent: {
    justifyContent: 'flex-end',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 8,
  },
  cardRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
    marginLeft: 4,
  },
  cardTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '500',
  },
  specialsContainer: {
    marginBottom: 24,
  },
  specialCard: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundLight,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    ...shadows.small,
  },
  specialContent: {
    flex: 1,
    paddingRight: 16,
  },
  specialTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  specialDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 16,
  },
  specialButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  specialButtonText: {
    color: colors.white,
    fontWeight: '500',
    fontSize: 14,
  },
  specialIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingTop: 8,
  },
  barItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 12,
    ...shadows.small,
  },
  barItemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  barItemContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  barItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  smallRating: {
    fontSize: 12,
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
    marginTop: 4,
  },
  smallTag: {
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 6,
  },
  smallTagText: {
    fontSize: 10,
    color: colors.primaryDark,
    fontWeight: '500',
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
});