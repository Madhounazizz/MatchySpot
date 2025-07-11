import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { CheckCircle, Calendar, Clock, Users, MapPin, Home, MessageSquare } from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import Button from '@/components/Button';
import { brcs } from '@/mocks/brcs';

export default function BookingSuccessScreen() {
  const router = useRouter();
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

  const handleGoHome = () => {
    router.replace('/(tabs)');
  };

  const handleViewBookings = () => {
    router.push('/(tabs)/profile');
  };

  const handleContactPlace = () => {
    if (selectedBRC) {
      router.push(`/chat/${selectedBRC.id}`);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Booking Confirmed',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '600' },
          headerLeft: () => null,
        }}
      />
      
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.successIcon}>
          <CheckCircle size={80} color={colors.success} fill={colors.success} />
        </View>
        
        {/* Success Message */}
        <Text style={styles.title}>Booking Confirmed! 🎉</Text>
        <Text style={styles.subtitle}>
          Your table has been successfully reserved
        </Text>
        
        {/* Booking Details Card */}
        <View style={styles.bookingCard}>
          <Text style={styles.placeName}>{selectedBRC?.name}</Text>
          <Text style={styles.placeAddress}>{selectedBRC?.address}</Text>
          
          <View style={styles.divider} />
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Calendar size={18} color={colors.primary} />
              <Text style={styles.detailText}>{bookingDate}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Clock size={18} color={colors.primary} />
              <Text style={styles.detailText}>{bookingTime}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Users size={18} color={colors.primary} />
              <Text style={styles.detailText}>{guestCount} guests</Text>
            </View>
            
            <View style={styles.detailRow}>
              <MapPin size={18} color={colors.primary} />
              <Text style={styles.detailText}>{selectedTable}</Text>
            </View>
          </View>
        </View>
        
        {/* Important Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Important Information</Text>
          <Text style={styles.infoText}>
            • Please arrive 10 minutes before your reservation time
          </Text>
          <Text style={styles.infoText}>
            • Free cancellation up to 2 hours before your booking
          </Text>
          <Text style={styles.infoText}>
            • Contact the restaurant if you're running late
          </Text>
        </View>
      </View>
      
      {/* Action Buttons */}
      <View style={styles.footer}>
        <Button
          title="Contact Place"
          variant="outline"
          onPress={handleContactPlace}
          style={styles.contactButton}
          icon={<MessageSquare size={18} color={colors.primary} />}
        />
        
        <Button
          title="View My Bookings"
          variant="outline"
          onPress={handleViewBookings}
          style={styles.viewButton}
        />
        
        <Button
          title="Back to Home"
          onPress={handleGoHome}
          style={styles.homeButton}
          icon={<Home size={18} color={colors.white} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  bookingCard: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    ...shadows.card,
  },
  placeName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  placeAddress: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: colors.backgroundDark,
    marginBottom: 20,
  },
  detailsContainer: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  infoCard: {
    width: '100%',
    backgroundColor: colors.accent,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 4,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  contactButton: {
    height: 50,
  },
  viewButton: {
    height: 50,
  },
  homeButton: {
    height: 56,
  },
});