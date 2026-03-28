import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Calendar, Clock, Users } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Event } from '@/types';
import { colors, shadows } from '@/constants/colors';

type EventCardProps = {
  event: Event;
};

export default function EventCard({ event }: EventCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/events/${event.id}`);
  };

  // Format date to display as "Jul 15"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <TouchableOpacity
      style={[styles.container, shadows.medium]}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: event.brcImage }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{event.title}</Text>
        <Text style={styles.venue} numberOfLines={1}>{event.brcName}</Text>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Calendar size={14} color={colors.textLight} />
            <Text style={styles.infoText}>{formatDate(event.date)}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Clock size={14} color={colors.textLight} />
            <Text style={styles.infoText}>{event.time}</Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.attendeesContainer}>
            <View style={styles.avatarsRow}>
              {event.attendees.slice(0, 3).map((attendee, index) => (
                <Image
                  key={index}
                  source={{ uri: attendee.avatar }}
                  style={[
                    styles.attendeeAvatar,
                    { marginLeft: index > 0 ? -10 : 0 },
                  ]}
                  contentFit="cover"
                />
              ))}
              {event.attendees.length > 3 && (
                <View style={styles.moreAttendeesCircle}>
                  <Text style={styles.moreAttendeesText}>+{event.attendees.length - 3}</Text>
                </View>
              )}
            </View>
            
            <View style={styles.attendeesInfo}>
              <Users size={14} color={colors.textLight} />
              <Text style={styles.attendeesText}>
                {event.attendees.length}/{event.maxAttendees}
              </Text>
            </View>
          </View>
          
          {event.price && (
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>${event.price}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    width: 280,
    marginRight: 16,
  },
  image: {
    width: '100%',
    height: 140,
  },
  content: {
    padding: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  venue: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  infoText: {
    fontSize: 13,
    color: colors.textLight,
    marginLeft: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attendeesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarsRow: {
    flexDirection: 'row',
    marginRight: 8,
  },
  attendeeAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  moreAttendeesCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -10,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  moreAttendeesText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textLight,
  },
  attendeesInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeesText: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 4,
  },
  priceTag: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priceText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});