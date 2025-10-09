import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Users, Sparkles, PartyPopper, Clock, Ticket } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, shadows } from '@/constants/colors';
import { upcomingEvents } from '@/mocks/events';
import EventCard from '@/components/EventCard';

export default function UpcomingEventsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [scrollY] = useState(new Animated.Value(0));

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const headerScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.95],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <Animated.View style={{ opacity: headerOpacity, transform: [{ scale: headerScale }] }}>
        <LinearGradient
          colors={['#667eea', '#764ba2', '#f093fb']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.headerGradient, { paddingTop: insets.top + 16 }]}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ArrowLeft size={24} color={colors.white} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.headerContent}>
            <View style={styles.iconBadgeContainer}>
              <LinearGradient
                colors={['#f093fb', '#f5576c']}
                style={styles.iconBadge}
              >
                <PartyPopper size={28} color={colors.white} strokeWidth={2.5} />
              </LinearGradient>
              <View style={styles.iconGlow} />
            </View>
            <Text style={styles.headerTitle}>Upcoming Events</Text>
            <Text style={styles.headerSubtitle}>
              🎉 Don't miss out on amazing experiences
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.statIconContainer}
            >
              <Ticket size={22} color={colors.white} strokeWidth={2.5} />
            </LinearGradient>
            <Text style={styles.statValue}>{upcomingEvents.length}</Text>
            <Text style={styles.statLabel}>Events</Text>
          </View>
          <View style={styles.statCard}>
            <LinearGradient
              colors={['#f093fb', '#f5576c']}
              style={styles.statIconContainer}
            >
              <Users size={22} color={colors.white} strokeWidth={2.5} />
            </LinearGradient>
            <Text style={styles.statValue}>150+</Text>
            <Text style={styles.statLabel}>Attendees</Text>
          </View>
          <View style={styles.statCard}>
            <LinearGradient
              colors={['#4facfe', '#00f2fe']}
              style={styles.statIconContainer}
            >
              <Clock size={22} color={colors.white} strokeWidth={2.5} />
            </LinearGradient>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
        </View>

        <View style={styles.listContainer}>
          {upcomingEvents.map((event) => (
            <View key={event.id} style={styles.cardWrapper}>
              <EventCard event={event} />
            </View>
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FD',
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: {
    marginBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  },
  headerContent: {
    alignItems: 'center',
  },
  iconBadgeContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  iconBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.large,
  },
  iconGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f093fb',
    opacity: 0.3,
    transform: [{ scale: 1.3 }],
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.white,
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 20,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
    marginTop: -24,
  },
  contentContainer: {
    paddingTop: 24,
    paddingBottom: 100,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 28,
    gap: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    ...shadows.medium,
  },
  statIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    ...shadows.small,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  cardWrapper: {
    marginBottom: 20,
  },
});
