import React from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { MapPin, Star, Clock, ChevronRight } from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import { brcs } from '@/mocks/brcs';
import SearchBar from '@/components/SearchBar';

export default function RestaurantsScreen() {
  const router = useRouter();
  const restaurants = brcs.filter(brc => brc.type === 'restaurant');

  const handleRestaurantPress = (id: string) => {
    router.push(`/brc/${id}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Restaurants</Text>
        <Text style={styles.subtitle}>Discover the best dining experiences</Text>
      </View>

      <SearchBar placeholder="Search restaurants..." />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.featuredContainer}>
          <Text style={styles.sectionTitle}>Featured Restaurants</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredScroll}
          >
            {restaurants.slice(0, 3).map((restaurant) => (
              <TouchableOpacity 
                key={restaurant.id} 
                style={styles.featuredCard}
                onPress={() => handleRestaurantPress(restaurant.id)}
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri: restaurant.image }}
                  style={styles.featuredImage}
                  contentFit="cover"
                />
                <View style={styles.featuredOverlay}>
                  <View style={styles.featuredContent}>
                    <Text style={styles.featuredName}>{restaurant.name}</Text>
                    <View style={styles.ratingContainer}>
                      <Star size={14} color={colors.primary} fill={colors.primary} />
                      <Text style={styles.rating}>{restaurant.rating}</Text>
                      <Text style={styles.reviewCount}>({restaurant.reviewCount})</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>All Restaurants</Text>
          {restaurants.map((restaurant) => (
            <TouchableOpacity
              key={restaurant.id}
              style={styles.listItem}
              onPress={() => handleRestaurantPress(restaurant.id)}
              activeOpacity={0.7}
            >
              <Image
                source={{ uri: restaurant.image }}
                style={styles.listItemImage}
                contentFit="cover"
              />
              <View style={styles.listItemContent}>
                <Text style={styles.listItemName}>{restaurant.name}</Text>
                <View style={styles.infoRow}>
                  <View style={styles.ratingContainer}>
                    <Star size={12} color={colors.primary} fill={colors.primary} />
                    <Text style={styles.smallRating}>{restaurant.rating}</Text>
                  </View>
                  <View style={styles.tagContainer}>
                    {restaurant.tags.slice(0, 2).map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <MapPin size={12} color={colors.textLight} />
                    <Text style={styles.infoText}>{restaurant.distance}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Clock size={12} color={colors.textLight} />
                    <Text style={styles.infoText}>
                      {restaurant.openingHours.open} - {restaurant.openingHours.close}
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
    width: 280,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    ...shadows.medium,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  featuredContent: {
    justifyContent: 'flex-end',
  },
  featuredName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: colors.white,
    marginLeft: 2,
    opacity: 0.8,
  },
  listContainer: {
    paddingTop: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 12,
    ...shadows.small,
  },
  listItemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  listItemContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  listItemName: {
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
  smallRating: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 4,
  },
  tagContainer: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  tag: {
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 6,
  },
  tagText: {
    fontSize: 10,
    color: colors.primaryDark,
    fontWeight: '500',
  },
});