import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { CheckCircle, Calendar, Clock, Users, MapPin, Home, MessageSquare, Star, Share2, Download, Phone } from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
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
            <CheckCircle size={100} color={colors.white} fill={colors.success} />
            <View style={styles.successBadge}>
              <Text style={styles.successBadgeText}>✓</Text>
            </View>
          </View>
          
          <Text style={styles.successTitle}>Booking Confirmed!</Text>
          <Text style={styles.successSubtitle}>
            Your table reservation is all set
          </Text>
          <Text style={styles.bookingIdText}>Booking ID: {bookingId}</Text>
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
          {/* Restaurant Info Card */}
          <View style={styles.restaurantCard}>
            <View style={styles.restaurantHeader}>
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{selectedBRC?.name}</Text>
                <View style={styles.ratingContainer}>
                  <Star size={16} color={colors.warning} fill={colors.warning} />
                  <Text style={styles.ratingText}>4.8</Text>
                  <Text style={styles.reviewsText}>(324 reviews)</Text>
                </View>
                <Text style={styles.restaurantAddress}>{selectedBRC?.address}</Text>
              </View>
            </View>
            
            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.quickActionButton} onPress={handleCallRestaurant}>
                <Phone size={20} color={colors.primary} />
                <Text style={styles.quickActionText}>Call</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickActionButton} onPress={handleContactPlace}>
                <MessageSquare size={20} color={colors.primary} />
                <Text style={styles.quickActionText}>Chat</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickActionButton} onPress={handleShareBooking}>
                <Share2 size={20} color={colors.primary} />
                <Text style={styles.quickActionText}>Share</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickActionButton} onPress={handleDownloadConfirmation}>
                <Download size={20} color={colors.primary} />
                <Text style={styles.quickActionText}>Save</Text>
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
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  successHeader: {
    backgroundColor: colors.success,
    paddingTop: 100,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  successIconContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  successBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: colors.white,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.card,
  },
  successBadgeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.success,
  },
  successTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 18,
    color: colors.white,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 12,
  },
  bookingIdText: {
    fontSize: 14,
    color: colors.white,
    textAlign: 'center',
    opacity: 0.8,
    fontWeight: '600',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  restaurantCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    ...shadows.card,
  },
  restaurantHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 8,
  },
  restaurantAddress: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.backgroundDark,
  },
  quickActionButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.accent,
    minWidth: 70,
  },
  quickActionText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  bookingDetailsCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    ...shadows.card,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
  },
  detailsGrid: {
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    padding: 16,
    borderRadius: 16,
  },
  detailIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  timelineCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    ...shadows.card,
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
    backgroundColor: colors.card,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...shadows.card,
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