import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Star, MapPin, Clock, Phone, Share, Calendar, MessageCircle, ThumbsUp } from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import Button from '@/components/Button';
import { brcs } from '@/mocks/brcs';
import { menuItems } from '@/mocks/menu';
import { reviews } from '@/mocks/reviews';
import { useUserStore } from '@/store/useUserStore';




export default function BRCDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { toggleFavorite, isFavorite } = useUserStore();

  const [selectedMenuCategory, setSelectedMenuCategory] = useState('all');

  
  const brc = brcs.find((b) => b.id === id);
  const brcMenuItems = menuItems.filter((item) => item.brcId === id);
  const brcReviews = reviews.filter((review) => review.brcId === id);
  const favorite = brc ? isFavorite(brc.id) : false;
  
  if (!brc) {
    return (
      <View style={styles.container}>
        <Text>Place not found</Text>
      </View>
    );
  }

  const handleFavoritePress = () => {
    toggleFavorite(brc.id);
  };

  const handleBookTable = () => {
    console.log('Navigating to booking with brcId:', brc.id);
    try {
      router.push({
        pathname: '/booking',
        params: { brcId: brc.id }
      });
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback navigation
      router.push('/booking');
    }
  };
  


  const handleShare = () => {
    // Handle share functionality
  };

  const handleViewAllReviews = () => {
    router.push('/reviews');
  };



  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const menuCategories = ['all', ...Array.from(new Set(brcMenuItems.map(item => item.category)))];
  const filteredMenuItems = selectedMenuCategory === 'all' 
    ? brcMenuItems 
    : brcMenuItems.filter(item => item.category === selectedMenuCategory);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: "",
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
                <Share size={24} color={colors.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={handleFavoritePress}>
                <Heart
                  size={24}
                  color={favorite ? colors.primary : colors.white}
                  fill={favorite ? colors.primary : 'transparent'}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: brc.image }}
            style={styles.image}
            contentFit="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.imageGradient}
          />
          
          <View style={styles.imageOverlay}>
            <View style={styles.typeTag}>
              <Text style={styles.typeText}>{brc.type}</Text>
            </View>
            
            <View style={styles.statusContainer}>
              <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
              <Text style={styles.statusText}>Open Now</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{brc.name}</Text>
            
            <TouchableOpacity style={styles.ratingContainer} onPress={handleViewAllReviews}>
              <Star size={20} color={colors.primary} fill={colors.primary} />
              <Text style={styles.rating}>{brc.rating}</Text>
              <Text style={styles.reviewCount}>({brc.reviewCount} reviews)</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <MapPin size={20} color={colors.textLight} />
              <Text style={styles.infoText}>{brc.address}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Clock size={20} color={colors.textLight} />
              <Text style={styles.infoText}>
                {brc.openingHours.open} - {brc.openingHours.close}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Phone size={20} color={colors.textLight} />
              <Text style={styles.infoText}>+1 (555) 123-4567</Text>
            </View>
          </View>
          
          <View style={styles.tagsContainer}>
            {brc.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{brc.description}</Text>
          
          <View style={styles.divider} />
          
          {/* Reviews Section */}
          {brcReviews.length > 0 && (
            <>
              <View style={styles.reviewsHeader}>
                <Text style={styles.sectionTitle}>Reviews</Text>
                <TouchableOpacity onPress={handleViewAllReviews}>
                  <Text style={styles.viewAllText}>View All ({brcReviews.length})</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.reviewsContainer}>
                {brcReviews.slice(0, 3).map((review) => (
                  <View key={review.id} style={styles.reviewItem}>
                    <View style={styles.reviewHeader}>
                      <Image
                        source={{ uri: review.userAvatar }}
                        style={styles.reviewAvatar}
                        contentFit="cover"
                      />
                      <View style={styles.reviewUserInfo}>
                        <Text style={styles.reviewUserName}>{review.userName}</Text>
                        <View style={styles.reviewMeta}>
                          <View style={styles.reviewRating}>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                color={i < review.rating ? colors.primary : colors.backgroundDark}
                                fill={i < review.rating ? colors.primary : colors.backgroundDark}
                              />
                            ))}
                          </View>
                          <Text style={styles.reviewDate}>{formatDate(review.date)}</Text>
                        </View>
                      </View>
                    </View>
                    
                    <Text style={styles.reviewText} numberOfLines={3}>
                      {review.text}
                    </Text>
                    
                    {review.images && review.images.length > 0 && (
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.reviewImages}>
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
                      <TouchableOpacity style={styles.reviewAction}>
                        <ThumbsUp size={16} color={colors.textLight} />
                        <Text style={styles.reviewActionText}>{review.likes}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.reviewAction}>
                        <MessageCircle size={16} color={colors.textLight} />
                        <Text style={styles.reviewActionText}>Reply</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
              
              <View style={styles.divider} />
            </>
          )}
          
          {brcMenuItems.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Menu</Text>
              
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.menuCategoriesContainer}
              >
                {menuCategories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.menuCategoryButton,
                      selectedMenuCategory === category && styles.activeMenuCategory,
                    ]}
                    onPress={() => setSelectedMenuCategory(category)}
                  >
                    <Text
                      style={[
                        styles.menuCategoryText,
                        selectedMenuCategory === category && styles.activeMenuCategoryText,
                      ]}
                    >
                      {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <View style={styles.menuItemsContainer}>
                {filteredMenuItems.map((item) => (
                  <View key={item.id} style={styles.menuItem}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.menuItemImage}
                      contentFit="cover"
                    />
                    
                    <View style={styles.menuItemInfo}>
                      <View style={styles.menuItemHeader}>
                        <Text style={styles.menuItemName}>{item.name}</Text>
                        <Text style={styles.menuItemPrice}>${item.price}</Text>
                      </View>
                      
                      <Text style={styles.menuItemDescription} numberOfLines={2}>
                        {item.description}
                      </Text>
                      
                      <View style={styles.menuItemFooter}>
                        <View style={styles.menuItemRating}>
                          <Star size={14} color={colors.primary} fill={colors.primary} />
                          <Text style={styles.menuItemRatingText}>{item.rating}</Text>
                        </View>
                        
                        <View style={styles.menuItemTags}>
                          {item.isVegetarian && (
                            <View style={styles.menuItemTag}>
                              <Text style={styles.menuItemTagText}>V</Text>
                            </View>
                          )}
                          {item.isVegan && (
                            <View style={styles.menuItemTag}>
                              <Text style={styles.menuItemTagText}>VG</Text>
                            </View>
                          )}
                          {item.isGlutenFree && (
                            <View style={styles.menuItemTag}>
                              <Text style={styles.menuItemTagText}>GF</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
              
              <View style={styles.divider} />
            </>
          )}
          
          <View style={styles.actionsContainer}>
            <Button
              title="View on Map"
              variant="outline"
              onPress={() => router.push('/map')}
              style={styles.actionButton}
              icon={<MapPin size={20} color={colors.primary} />}
            />
          </View>
        </View>
      </ScrollView>
      

      
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View>
            <Text style={styles.footerTitle}>Ready to visit?</Text>
            <Text style={styles.footerSubtitle}>Book your table now</Text>
          </View>
          
          <Button
            title="Book Table"
            onPress={handleBookTable}
            style={styles.bookButton}
            icon={<Calendar size={20} color={colors.white} />}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerActions: {
    flexDirection: 'row',
    marginRight: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    justifyContent: 'space-between',
  },
  typeTag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 80,
  },
  typeText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  statusContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 6,
  },
  reviewCount: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 4,
  },
  infoContainer: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  tag: {
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: colors.primaryDark,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.backgroundLight,
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textLight,
  },
  menuCategoriesContainer: {
    marginBottom: 16,
  },
  menuCategoryButton: {
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  activeMenuCategory: {
    backgroundColor: colors.primary,
  },
  menuCategoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  activeMenuCategoryText: {
    color: colors.white,
  },
  menuItemsContainer: {
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  menuItemInfo: {
    flex: 1,
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  menuItemDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
    lineHeight: 20,
  },
  menuItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemRatingText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 4,
  },
  menuItemTags: {
    flexDirection: 'row',
  },
  menuItemTag: {
    backgroundColor: colors.success,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  menuItemTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.white,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 100,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 0,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.backgroundLight,
    ...shadows.large,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  footerSubtitle: {
    fontSize: 14,
    color: colors.textLight,
  },
  bookButton: {
    width: 160,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  reviewsContainer: {
    marginBottom: 20,
  },
  reviewItem: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewUserInfo: {
    flex: 1,
  },
  reviewUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewRating: {
    flexDirection: 'row',
    marginRight: 8,
  },
  reviewDate: {
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
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
  },
  reviewActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  reviewActionText: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 6,
  },
});