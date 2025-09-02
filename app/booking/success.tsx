import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { CheckCircle, Calendar, Clock, Users, MapPin, Home, MessageSquare, Star, Share2, Download, Phone } from 'lucide-react-native';
import { colors, shadows, typography, borderRadius, spacing } from '@/constants/colors';
import Button from '@/components/Button';
import { brcs } from '@/mocks/brcs';

export default function BookingSuccessScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  
  const params = useLocalSearchParams<{
    brcId?: string;
    date?: string;
    time?: string;
    guests?: string;
    table?: string;
  }>();

  const selectedBRC = params.brcId ? brcs.find(brc => brc.id === params.brcId) : brcs[0];
  const bookingDate = params.date || 'Today, Jul 9';
  const bookingTime = params.time || '19:00';
  const guestCount = params.guests || '2';
  const selectedTable = params.table || 'Window Table';
  const bookingId = `BRC${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, scaleAnim]);

  const handleGoHome = () => {
    router.replace('/(tabs)');
  };

  const handleViewBookings = () => {
    router.push('/(tabs)/profile');
  };

  const handleContactPlace = () => {
    if (selectedBRC) {
      router.push('/chat/1');
    }
  };

  const handleShareBooking = () => {
    console.log('Share booking details');
  };

  const handleDownloadConfirmation = () => {
    console.log('Download confirmation');
  };

  const handleCallRestaurant = () => {
    console.log('Call restaurant');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: '',
          headerStyle: { backgroundColor: colors.success },
          headerTintColor: colors.white,
          headerTitleStyle: { fontWeight: '600' },
          headerLeft: () => null,
          headerTransparent: true,
        }}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Success Header */}
        <Animated.View 
          style={[
            styles.successHeader,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <View style={styles.successIconContainer}>
            <View style={styles.successIconBackground}>
              <CheckCircle size={120} color={colors.textInverse} fill={colors.success} />
            </View>
            <View style={styles.successBadge}>
              <Text style={styles.successBadgeText}>✓</Text>
            </View>
          </View>
          
          <Text style={styles.successTitle}>Booking Confirmed!</Text>
          <Text style={styles.successSubtitle}>
            Your table reservation is all set
          </Text>
          <View style={styles.bookingIdContainer}>
            <Text style={styles.bookingIdText}>Booking ID: {bookingId}</Text>
          </View>
        </Animated.View>

        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Enhanced Restaurant Info Card */}
          <View style={styles.restaurantCard}>
            <View style={styles.restaurantHeader}>
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{selectedBRC?.name}</Text>
                <View style={styles.ratingContainer}>
                  <View style={styles.ratingBadge}>
                    <Star size={14} color={colors.warning} fill={colors.warning} />
                    <Text style={styles.ratingText}>4.8</Text>
                  </View>
                  <Text style={styles.reviewsText}>(324 reviews)</Text>
                </View>
                <Text style={styles.restaurantAddress}>{selectedBRC?.address}</Text>
              </View>
            </View>
            
            <View style={styles.quickActions}>
              <TouchableOpacity style={[styles.quickActionButton, styles.callButton]} onPress={handleCallRestaurant}>
                <Phone size={18} color={colors.textInverse} />
                <Text style={[styles.quickActionText, styles.callButtonText]}>Call</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.quickActionButton, styles.chatButton]} onPress={handleContactPlace}>
                <MessageSquare size={18} color={colors.textInverse} />
                <Text style={[styles.quickActionText, styles.chatButtonText]}>Chat</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.quickActionButton, styles.shareButton]} onPress={handleShareBooking}>
                <Share2 size={18} color={colors.textInverse} />
                <Text style={[styles.quickActionText, styles.shareButtonText]}>Share</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.quickActionButton, styles.saveButton]} onPress={handleDownloadConfirmation}>
                <Download size={18} color={colors.textInverse} />
                <Text style={[styles.quickActionText, styles.saveButtonText]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Booking Details Card */}
          <View style={styles.bookingDetailsCard}>
            <Text style={styles.cardTitle}>Reservation Details</Text>
            
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <Calendar size={24} color={colors.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Date</Text>
                  <Text style={styles.detailValue}>{bookingDate}</Text>
                </View>
              </View>
              
              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <Clock size={24} color={colors.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Time</Text>
                  <Text style={styles.detailValue}>{bookingTime}</Text>
                </View>
              </View>
              
              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <Users size={24} color={colors.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Guests</Text>
                  <Text style={styles.detailValue}>{guestCount} people</Text>
                </View>
              </View>
              
              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <MapPin size={24} color={colors.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Table</Text>
                  <Text style={styles.detailValue}>{selectedTable}</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Timeline Card */}
          <View style={styles.timelineCard}>
            <Text style={styles.cardTitle}>What&apos;s Next?</Text>
            
            <View style={styles.timelineItem}>
              <View style={styles.timelineIcon}>
                <Text style={styles.timelineNumber}>1</Text>
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Arrive 10 minutes early</Text>
                <Text style={styles.timelineDescription}>Check in at the host station</Text>
              </View>
            </View>
            
            <View style={styles.timelineItem}>
              <View style={styles.timelineIcon}>
                <Text style={styles.timelineNumber}>2</Text>
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Enjoy your meal</Text>
                <Text style={styles.timelineDescription}>Your table will be ready</Text>
              </View>
            </View>
            
            <View style={styles.timelineItem}>
              <View style={styles.timelineIcon}>
                <Text style={styles.timelineNumber}>3</Text>
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Leave a review</Text>
                <Text style={styles.timelineDescription}>Share your experience</Text>
              </View>
            </View>
          </View>
          
          {/* Policies Card */}
          <View style={styles.policiesCard}>
            <Text style={styles.cardTitle}>Cancellation Policy</Text>
            <View style={styles.policyItem}>
              <Text style={styles.policyText}>• Free cancellation up to 2 hours before</Text>
            </View>
            <View style={styles.policyItem}>
              <Text style={styles.policyText}>• Late arrival grace period: 15 minutes</Text>
            </View>
            <View style={styles.policyItem}>
              <Text style={styles.policyText}>• Contact restaurant if running late</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
      
      {/* Fixed Bottom Actions */}
      <View style={styles.bottomActions}>
        <View style={styles.actionRow}>
          <Button
            title="View Bookings"
            variant="outline"
            onPress={handleViewBookings}
            style={styles.secondaryButton}
          />
          
          <Button
            title="Back to Home"
            onPress={handleGoHome}
            style={styles.primaryButton}
            icon={<Home size={18} color={colors.white} />}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  
  scrollView: {
    flex: 1,
  },
  
  successHeader: {
    backgroundColor: colors.success,
    paddingTop: 100,
    paddingBottom: spacing['2xl'],
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    borderBottomLeftRadius: borderRadius['3xl'],
    borderBottomRightRadius: borderRadius['3xl'],
  },
  
  successIconContainer: {
    position: 'relative',
    marginBottom: spacing.xl,
  },
  
  successIconBackground: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.xlarge,
  },
  
  successBadge: {
    position: 'absolute',
    top: -spacing.sm,
    right: -spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.large,
  },
  
  successBadgeText: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.extrabold,
    color: colors.success,
  },
  
  successTitle: {
    fontSize: typography.sizes['4xl'],
    fontWeight: typography.weights.extrabold,
    color: colors.textInverse,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  
  successSubtitle: {
    fontSize: typography.sizes.xl,
    color: colors.textInverse,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: spacing.lg,
  },
  
  bookingIdContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  
  bookingIdText: {
    fontSize: typography.sizes.base,
    color: colors.textInverse,
    textAlign: 'center',
    fontWeight: typography.weights.semibold,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 120,
  },
  
  restaurantCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius['2xl'],
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...shadows.large,
  },
  
  restaurantHeader: {
    marginBottom: spacing.xl,
  },
  
  restaurantInfo: {
    flex: 1,
  },
  
  restaurantName: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.extrabold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
  },
  
  ratingText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginLeft: spacing.xs,
  },
  
  reviewsText: {
    fontSize: typography.sizes.sm,
    color: colors.textLight,
  },
  
  restaurantAddress: {
    fontSize: typography.sizes.base,
    color: colors.textLight,
    lineHeight: typography.sizes.base * typography.lineHeights.relaxed,
  },
  
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: spacing.sm,
  },
  
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.xl,
    ...shadows.medium,
  },
  
  callButton: {
    backgroundColor: colors.success,
  },
  
  chatButton: {
    backgroundColor: colors.primary,
  },
  
  shareButton: {
    backgroundColor: colors.secondary,
  },
  
  saveButton: {
    backgroundColor: colors.info,
  },
  
  quickActionText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    marginTop: spacing.xs,
  },
  
  callButtonText: {
    color: colors.textInverse,
  },
  
  chatButtonText: {
    color: colors.textInverse,
  },
  
  shareButtonText: {
    color: colors.textInverse,
  },
  
  saveButtonText: {
    color: colors.textInverse,
  },
  bookingDetailsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius['2xl'],
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...shadows.large,
  },
  
  cardTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  
  detailsGrid: {
    gap: spacing.md,
  },
  
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    ...shadows.small,
  },
  
  detailIconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  
  detailContent: {
    flex: 1,
  },
  
  detailLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textLight,
    marginBottom: spacing.xs,
    fontWeight: typography.weights.medium,
  },
  
  detailValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  timelineCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius['2xl'],
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...shadows.large,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  timelineNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  timelineDescription: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  policiesCard: {
    backgroundColor: colors.accent,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  policyItem: {
    marginBottom: 8,
  },
  policyText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 40,
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
    ...shadows.large,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    height: 56,
  },
  primaryButton: {
    flex: 1,
    height: 56,
  },
});