import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { MapPin, Navigation, Filter } from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import { brcs } from '@/mocks/brcs';
import { BRC } from '@/types';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

interface BRCWithDistance extends Omit<BRC, 'distance'> {
  distance?: number;
  cuisine?: string;
}

export default function LocationMapScreen() {
  const router = useRouter();
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [nearbyBRCs, setNearbyBRCs] = useState<BRCWithDistance[]>([]);
  const [, setSelectedBRC] = useState<BRCWithDistance | null>(null);

  useEffect(() => {
    const initLocation = async () => {
      await requestLocationPermission();
    };
    initLocation();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'Please enable location access to find nearby restaurants, bars, and cafés.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => Location.requestForegroundPermissionsAsync() }
          ]
        );
        setLoading(false);
        return;
      }

      await getCurrentLocation();
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = currentLocation.coords;
      
      // Get address from coordinates
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const address = addressResponse[0] 
        ? `${addressResponse[0].street || ''} ${addressResponse[0].city || ''}`
        : 'Current Location';

      const locationData: LocationData = {
        latitude,
        longitude,
        address: address.trim(),
      };

      setLocation(locationData);
      calculateNearbyBRCs(locationData);
      
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert('Location Error', 'Unable to get your current location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  };

  const calculateNearbyBRCs = (userLocation: LocationData) => {
    // Mock coordinates for BRCs (in a real app, these would come from your backend)
    const brcCoordinates: { [key: string]: { lat: number; lng: number } } = {
      '1': { lat: userLocation.latitude + 0.01, lng: userLocation.longitude + 0.01 },
      '2': { lat: userLocation.latitude - 0.005, lng: userLocation.longitude + 0.015 },
      '3': { lat: userLocation.latitude + 0.02, lng: userLocation.longitude - 0.01 },
      '4': { lat: userLocation.latitude - 0.015, lng: userLocation.longitude - 0.005 },
      '5': { lat: userLocation.latitude + 0.008, lng: userLocation.longitude + 0.02 },
    };

    const brcsWithDistance: BRCWithDistance[] = brcs.map(brc => {
      const coords = brcCoordinates[brc.id];
      if (coords) {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          coords.lat,
          coords.lng
        );
        return { ...brc, distance, cuisine: 'Various' } as BRCWithDistance;
      }
      return { ...brc, cuisine: 'Various' } as BRCWithDistance;
    }).filter(brc => brc.distance !== undefined);

    // Sort by distance
    brcsWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    
    setNearbyBRCs(brcsWithDistance);
  };

  const handleNavigateToBRC = (brc: BRCWithDistance) => {
    if (Platform.OS === 'web') {
      Alert.alert('Navigation', 'Navigation is not available on web. Please use your preferred maps app.');
      return;
    }

    Alert.alert(
      'Navigate to ' + brc.name,
      `Open navigation to ${brc.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Navigate', 
          onPress: () => {
            // In a real app, you would open the native maps app
            Alert.alert('Navigation Started', `Navigation to ${brc.name} would open in your maps app.`);
          }
        }
      ]
    );
  };

  const handleBRCPress = (brc: BRCWithDistance) => {
    setSelectedBRC(brc);
    router.push(`/brc/${brc.id}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <MapPin size={48} color={colors.primary} />
        <Text style={styles.loadingText}>Finding your location...</Text>
        <Text style={styles.loadingSubtext}>Please make sure location services are enabled</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.locationInfo}>
          <MapPin size={20} color={colors.primary} />
          <View style={styles.locationText}>
            <Text style={styles.locationTitle}>Your Location</Text>
            <Text style={styles.locationAddress}>{location?.address || 'Location not available'}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={getCurrentLocation}
        >
          <Navigation size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <MapPin size={64} color={colors.primary} />
          <Text style={styles.mapPlaceholderText}>Interactive Map</Text>
          <Text style={styles.mapPlaceholderSubtext}>
            Shows your location and nearby BRCs with real-time updates
          </Text>
          <Text style={styles.implementationNote}>
            📍 Feature Implementation Required:
            {'\n'}• Real-time map with user location
            {'\n'}• BRC markers with promotion badges
            {'\n'}• Tap to view BRC details
            {'\n'}• Filter by distance/rating
          </Text>
        </View>
      </View>

      {/* Nearby BRCs List */}
      <View style={styles.nearbyContainer}>
        <View style={styles.nearbyHeader}>
          <Text style={styles.nearbyTitle}>Nearby Places ({nearbyBRCs.length})</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={16} color={colors.primary} />
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>

        {nearbyBRCs.map((brc) => (
          <TouchableOpacity
            key={brc.id}
            style={styles.brcItem}
            onPress={() => handleBRCPress(brc)}
          >
            <View style={styles.brcInfo}>
              <Text style={styles.brcName}>{brc.name}</Text>
              <Text style={styles.brcType}>{brc.type} • {brc.cuisine || 'Various'}</Text>
              <View style={styles.brcMeta}>
                <Text style={styles.brcDistance}>📍 {brc.distance}km away</Text>
                <Text style={styles.brcRating}>⭐ {brc.rating}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.navigateButton}
              onPress={() => handleNavigateToBRC(brc)}
            >
              <Navigation size={16} color={colors.white} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    marginLeft: 12,
    flex: 1,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  locationAddress: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.backgroundLight,
  },
  mapContainer: {
    height: 300,
    backgroundColor: colors.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  mapPlaceholderText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  implementationNote: {
    fontSize: 12,
    color: colors.primary,
    textAlign: 'center',
    lineHeight: 18,
    backgroundColor: colors.accent,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  nearbyContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  nearbyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  nearbyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 4,
    fontWeight: '500',
  },
  brcItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
  },
  brcInfo: {
    flex: 1,
  },
  brcName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  brcType: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  brcMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brcDistance: {
    fontSize: 12,
    color: colors.textLight,
    marginRight: 16,
  },
  brcRating: {
    fontSize: 12,
    color: colors.textLight,
  },
  navigateButton: {
    backgroundColor: colors.primary,
    padding: 8,
    borderRadius: 8,
    marginLeft: 12,
  },
});