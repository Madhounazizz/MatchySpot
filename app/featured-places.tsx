import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Star } from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import { featuredBRCs } from '@/mocks/brcs';
import BRCCard from '@/components/BRCCard';

export default function FeaturedPlacesScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Featured Places',
          headerStyle: {
            backgroundColor: colors.white,
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
            color: colors.text,
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Top Rated Places</Text>
          <Text style={styles.headerSubtitle}>
            Discover the best restaurants, cafés, and bars in your area
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Star size={20} color={colors.primary} />
            <Text style={styles.statValue}>{featuredBRCs.length}</Text>
            <Text style={styles.statLabel}>Featured</Text>
          </View>
          <View style={styles.statCard}>
            <MapPin size={20} color={colors.secondary} />
            <Text style={styles.statValue}>5+</Text>
            <Text style={styles.statLabel}>Locations</Text>
          </View>
        </View>

        <View style={styles.listContainer}>
          {featuredBRCs.map((brc) => (
            <View key={brc.id} style={styles.cardWrapper}>
              <BRCCard brc={brc} size="large" />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  backButton: {
    padding: 8,
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  header: {
    backgroundColor: colors.white,
    padding: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    ...shadows.small,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  cardWrapper: {
    marginBottom: 16,
  },
});
