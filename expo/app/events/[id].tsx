import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Calendar, Clock, MapPin, Users, Share } from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import Button from '@/components/Button';
import { events } from '@/mocks/events';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const event = events.find((e) => e.id === id);
  
  if (!event) {
    return (
      <View style={styles.container}>
        <Text>Event not found</Text>
      </View>
    );
  }

  const handleJoinEvent = () => {
    // Join event logic
    router.back();
  };

  const handleViewVenue = () => {
    router.push(`/brc/${event.brcId}`);
  };

  // Format date to display as "Friday, July 15, 2025"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: "",
          headerRight: () => (
            <TouchableOpacity style={styles.shareButton}>
              <Share size={24} color={colors.white} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: event.brcImage }}
          style={styles.image}
          contentFit="cover"
        />
        <View style={styles.imageOverlay} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.venue}>{event.brcName}</Text>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Calendar size={20} color={colors.primary} />
            <Text style={styles.infoText}>{formatDate(event.date)}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Clock size={20} color={colors.primary} />
            <Text style={styles.infoText}>{event.time}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <MapPin size={20} color={colors.primary} />
            <TouchableOpacity onPress={handleViewVenue}>
              <Text style={styles.venueLink}>View Venue</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <Text style={styles.sectionTitle}>About This Event</Text>
        <Text style={styles.description}>{event.description}</Text>
        
        <View style={styles.divider} />
        
        <View style={styles.attendeesSection}>
          <View style={styles.attendeesHeader}>
            <Text style={styles.sectionTitle}>Attendees</Text>
            <View style={styles.attendeeCount}>
              <Users size={16} color={colors.textLight} />
              <Text style={styles.attendeeCountText}>
                {event.attendees.length}/{event.maxAttendees}
              </Text>
            </View>
          </View>
          
          <View style={styles.attendeesList}>
            {event.attendees.map((attendee) => (
              <View key={attendee.id} style={styles.attendeeItem}>
                <Image
                  source={{ uri: attendee.avatar }}
                  style={styles.attendeeAvatar}
                  contentFit="cover"
                />
                <Text style={styles.attendeeName}>{attendee.name}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.priceSection}>
          <Text style={styles.sectionTitle}>Price</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${event.price}</Text>
            <Text style={styles.priceDescription}>per person</Text>
          </View>
          <Text style={styles.priceNote}>
            Includes event entry and one welcome drink.
          </Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.policySection}>
          <Text style={styles.sectionTitle}>Cancellation Policy</Text>
          <Text style={styles.policyText}>
            Free cancellation up to 24 hours before the event.
            No refunds for cancellations made less than 24 hours in advance.
          </Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View>
            <Text style={styles.footerPrice}>${event.price}</Text>
            <Text style={styles.footerPriceLabel}>per person</Text>
          </View>
          
          <Button
            title="Join Event"
            onPress={handleJoinEvent}
            style={styles.joinButton}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  imageContainer: {
    width: '100%',
    height: 250,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  venue: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
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
  },
  venueLink: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '500',
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.backgroundLight,
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textLight,
  },
  attendeesSection: {
    marginBottom: 20,
  },
  attendeesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  attendeeCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  attendeeCountText: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 6,
  },
  attendeesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  attendeeItem: {
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 16,
    width: 70,
  },
  attendeeAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  attendeeName: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
  },
  priceSection: {
    marginBottom: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginRight: 6,
  },
  priceDescription: {
    fontSize: 16,
    color: colors.textLight,
  },
  priceNote: {
    fontSize: 14,
    color: colors.textLight,
    fontStyle: 'italic',
  },
  policySection: {
    marginBottom: 100,
  },
  policyText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textLight,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.backgroundLight,
    ...shadows.medium,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  footerPrice: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  footerPriceLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  joinButton: {
    width: 200,
  },
});