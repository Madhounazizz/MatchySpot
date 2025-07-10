import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Star, Filter, ThumbsUp, MessageCircle, ArrowLeft } from 'lucide-react-native';
import { Image } from 'expo-image';
import { colors, shadows } from '@/constants/colors';
import { reviews } from '@/mocks/reviews';
import { brcs } from '@/mocks/brcs';

const filterOptions = [
  { id: 'all', name: 'All Reviews' },
  { id: '5', name: '5 Stars' },
  { id: '4', name: '4 Stars' },
  { id: '3', name: '3 Stars' },
  { id: '2', name: '2 Stars' },
  { id: '1', name: '1 Star' },
];

export default function ReviewsScreen() {
  const router = useRouter();
  const { brcId } = useLocalSearchParams<{ brcId?: string }>();
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // Filter reviews by BRC if brcId is provided
  const brcReviews = brcId ? reviews.filter(review => review.brcId === brcId) : reviews;
  
  const filteredReviews = selectedFilter === 'all' 
    ? brcReviews 
    : brcReviews.filter(review => review.rating.toString() === selectedFilter);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  const getBRCName = (brcId: string) => {
    const brc = brcs.find(b => b.id === brcId);
    return brc ? brc.name : 'Unknown Place';
  };

  const selectedBRC = brcId ? brcs.find(b => b.id === brcId) : null;
  const pageTitle = selectedBRC ? `${selectedBRC.name} Reviews` : 'All Reviews';

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: pageTitle,
          headerStyle: { backgroundColor: colors.white },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '600' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <View style={styles.header}>
        <Text style={styles.title}>{pageTitle}</Text>
        <Text style={styles.subtitle}>{filteredReviews.length} reviews</Text>
        
        {selectedBRC && (
          <View style={styles.brcInfo}>
            <View style={styles.brcRating}>
              <Star size={20} color={colors.primary} fill={colors.primary} />
              <Text style={styles.brcRatingText}>{selectedBRC.rating}</Text>
              <Text style={styles.brcRatingCount}>({selectedBRC.reviewCount} total)</Text>
            </View>
          </View>
        )}
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {filterOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.filterButton,
              selectedFilter === option.id && styles.activeFilterButton,
            ]}
            onPress={() => setSelectedFilter(option.id)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === option.id && styles.activeFilterText,
              ]}
            >
              {option.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <ScrollView
        style={styles.reviewsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.reviewsContent}
      >
        {filteredReviews.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No reviews found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your filter or check back later</Text>
          </View>
        ) : (
          filteredReviews.map((review) => (
            <View key={review.id} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Image
                  source={{ uri: review.userAvatar }}
                  style={styles.avatar}
                  contentFit="cover"
                />
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{review.userName}</Text>
                  {!brcId && (
                    <Text style={styles.brcName}>{getBRCName(review.brcId)}</Text>
                  )}
                  <View style={styles.reviewMeta}>
                    <View style={styles.rating}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          color={i < review.rating ? colors.primary : colors.backgroundDark}
                          fill={i < review.rating ? colors.primary : colors.backgroundDark}
                        />
                      ))}
                    </View>
                    <Text style={styles.date}>{formatDate(review.date)}</Text>
                  </View>
                </View>
              </View>
              
              <Text style={styles.reviewText}>{review.text}</Text>
              
              {review.images && review.images.length > 0 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.reviewImages}
                >
                  {review.images.map((imageUri, index) => (
                    <Image
                      key={index}
                      source={{ uri: imageUri }}
                      style={styles.reviewImage}
                      contentFit="cover"
                    />
                  ))}
                </ScrollView>
              )}
              
              <View style={styles.reviewActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <ThumbsUp size={18} color={colors.textLight} />
                  <Text style={styles.actionText}>{review.likes}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                  <MessageCircle size={18} color={colors.textLight} />
                  <Text style={styles.actionText}>Reply</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerButton: {
    padding: 8,
    marginLeft: -8,
  },
  header: {
    padding: 20,
    backgroundColor: colors.backgroundLight,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 12,
  },
  brcInfo: {
    marginTop: 8,
  },
  brcRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brcRatingText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 6,
  },
  brcRatingCount: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 4,
  },
  filtersContainer: {
    backgroundColor: colors.white,
    paddingVertical: 16,
  },
  filtersContent: {
    paddingHorizontal: 20,
  },
  filterButton: {
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  activeFilterButton: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  activeFilterText: {
    color: colors.white,
  },
  reviewsList: {
    flex: 1,
  },
  reviewsContent: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
  reviewItem: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...shadows.small,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  brcName: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    marginRight: 8,
  },
  date: {
    fontSize: 12,
    color: colors.textLight,
  },
  reviewText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
    marginBottom: 12,
  },
  reviewImages: {
    marginBottom: 12,
  },
  reviewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 8,
  },
  reviewActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.backgroundDark,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 6,
  },
});