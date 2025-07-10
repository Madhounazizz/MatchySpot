import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Star, MapPin, Clock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { BRC } from '@/types';
import { colors, shadows } from '@/constants/colors';
import { useUserStore } from '@/store/useUserStore';

type BRCCardProps = {
  brc: BRC;
  size?: 'small' | 'medium' | 'large';
};

export default function BRCCard({ brc, size = 'medium' }: BRCCardProps) {
  const router = useRouter();
  const { toggleFavorite, isFavorite } = useUserStore();
  const favorite = isFavorite(brc.id);

  const handlePress = () => {
    router.push(`/brc/${brc.id}`);
  };

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    toggleFavorite(brc.id);
  };

  const getCardStyle = () => {
    switch (size) {
      case 'small':
        return { width: 160, height: 200 };
      case 'large':
        return { width: 300, height: 320 };
      case 'medium':
      default:
        return { width: 260, height: 220 };
    }
  };

  const getImageStyle = () => {
    switch (size) {
      case 'small':
        return { height: 120 };
      case 'large':
        return { height: 220 };
      case 'medium':
      default:
        return { height: 140 };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return { title: 14, subtitle: 12 };
      case 'large':
        return { title: 20, subtitle: 16 };
      case 'medium':
      default:
        return { title: 16, subtitle: 13 };
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, getCardStyle(), shadows.medium]}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={[styles.imageContainer, getImageStyle()]}>
        <Image
          source={{ uri: brc.image }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}
        />
        <Pressable
          style={styles.favoriteButton}
          onPress={handleFavoritePress}
          hitSlop={10}
        >
          <Heart
            size={22}
            color={favorite ? colors.primary : colors.white}
            fill={favorite ? colors.primary : 'transparent'}
          />
        </Pressable>
        <View style={styles.typeTag}>
          <Text style={styles.typeText}>{brc.type}</Text>
        </View>
        
        {/* Status indicator */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
          <Text style={styles.statusText}>Open</Text>
        </View>
      </View>
      
      <View style={[styles.content, size === 'large' && styles.largeContent]}>
        <Text style={[styles.title, { fontSize: getFontSize().title }]} numberOfLines={1}>
          {brc.name}
        </Text>
        
        <View style={styles.infoRow}>
          <View style={styles.ratingContainer}>
            <Star size={14} color={colors.primary} fill={colors.primary} />
            <Text style={styles.rating}>{brc.rating}</Text>
            <Text style={styles.reviewCount}>({brc.reviewCount})</Text>
          </View>
          
          {brc.distance && (
            <View style={styles.distanceContainer}>
              <MapPin size={12} color={colors.textLight} />
              <Text style={styles.distance}>{brc.distance}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.hoursContainer}>
          <Clock size={12} color={colors.textLight} />
          <Text style={styles.hours}>
            {brc.openingHours.open} - {brc.openingHours.close}
          </Text>
        </View>
        
        <View style={styles.tagsContainer}>
          {brc.tags.slice(0, size === 'large' ? 3 : 2).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
    marginBottom: 16,
  },
  imageContainer: {
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    padding: 8,
  },
  typeTag: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  typeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  statusContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
  },
  content: {
    padding: 16,
  },
  largeContent: {
    padding: 20,
  },
  title: {
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 2,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 4,
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  hours: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    color: colors.primaryDark,
    fontWeight: '500',
  },
});