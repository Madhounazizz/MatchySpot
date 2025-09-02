import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import {
  Calendar,
  Clock,
  Users,
  Phone,
  Mail,
  MessageSquare,
  Check,
  X,
  MoreVertical,
  Filter,
  Plus,
  Star,
  MapPin,
  Sparkles,
} from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { mockReservations } from '@/mocks/reservations';
import { Reservation } from '@/types';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

type FilterStatus = 'all' | 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled';

export default function ReservationsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<FilterStatus>('all');
  const [selectedDate, setSelectedDate] = useState('2025-01-20');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
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
    ]).start();
  }, []);

  const filteredReservations = mockReservations.filter((reservation) => {
    const matchesDate = reservation.date === selectedDate;
    const matchesStatus = selectedFilter === 'all' || reservation.status === selectedFilter;
    return matchesDate && matchesStatus;
  });

  const handleStatusUpdate = (reservationId: string, newStatus: Reservation['status']) => {
    Alert.alert(
      'Update Status',
      `Change reservation status to ${newStatus}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => console.log(`Updated ${reservationId} to ${newStatus}`) },
      ]
    );
  };

  const getStatusColor = (status: Reservation['status']): string => {
    switch (status) {
      case 'confirmed':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'seated':
        return colors.primary;
      case 'completed':
        return colors.textLight;
      case 'cancelled':
      case 'no-show':
        return colors.error;
      default:
        return colors.textLight;
    }
  };



  const ReservationCard = ({ reservation, index }: { reservation: Reservation; index: number }) => {
    const cardAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;

    React.useEffect(() => {
      Animated.sequence([
        Animated.delay(index * 100),
        Animated.parallel([
          Animated.timing(cardAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }, [index]);

    return (
      <Animated.View
        style={[
          styles.reservationCard,
          {
            opacity: cardAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <TouchableOpacity activeOpacity={0.95} testID={`reservation-${reservation.id}`}>
          <LinearGradient
            colors={['#FFFFFF', '#FAFBFC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}
          >
            <View style={styles.cardHeader}>
              <View style={styles.customerInfo}>
                <View style={styles.avatarContainer}>
                  {reservation.customerAvatar ? (
                    <Image
                      source={{ uri: reservation.customerAvatar }}
                      style={styles.customerAvatar}
                    />
                  ) : (
                    <LinearGradient
                      colors={['#FF6B6B', '#FF8E8E']}
                      style={styles.avatarPlaceholder}
                    >
                      <Users size={18} color={colors.white} strokeWidth={2.5} />
                    </LinearGradient>
                  )}
                  <View style={styles.onlineIndicator} />
                </View>
                <View style={styles.customerDetails}>
                  <View style={styles.nameRow}>
                    <Text style={styles.customerName}>{reservation.customerName}</Text>
                    <View style={styles.vipBadge}>
                      <Star size={10} color="#FFD700" fill="#FFD700" />
                    </View>
                  </View>
                  <View style={styles.reservationMeta}>
                    <View style={styles.metaItem}>
                      <Clock size={14} color="#FF6B6B" strokeWidth={2} />
                      <Text style={styles.reservationTime}>{reservation.time}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Users size={14} color="#4ECDC4" strokeWidth={2} />
                      <Text style={styles.partySize}>{reservation.partySize} guests</Text>
                    </View>
                  </View>
                  <View style={styles.locationRow}>
                    <MapPin size={12} color={colors.textLight} strokeWidth={2} />
                    <Text style={styles.locationText}>Main Dining Area</Text>
                  </View>
                </View>
              </View>
              <View style={styles.cardRight}>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(reservation.status) + '20' }
                ]}>
                  <View style={[styles.statusDot, { backgroundColor: getStatusColor(reservation.status) }]} />
                  <Text style={[styles.statusText, { color: getStatusColor(reservation.status) }]}>
                    {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                  </Text>
                </View>
                {reservation.tableNumber && (
                  <LinearGradient
                    colors={['#4ECDC4', '#44A08D']}
                    style={styles.tableNumberBadge}
                  >
                    <Text style={styles.tableNumber}>T{reservation.tableNumber}</Text>
                  </LinearGradient>
                )}
              </View>
            </View>

            {reservation.specialRequests && (
              <View style={styles.specialRequestsCard}>
                <LinearGradient
                  colors={['#FFF3E0', '#FFE0B2']}
                  style={styles.requestsGradient}
                >
                  <Sparkles size={14} color="#FF9800" strokeWidth={2} />
                  <Text style={styles.specialRequestsText}>{reservation.specialRequests}</Text>
                </LinearGradient>
              </View>
            )}

            <View style={styles.actionButtons}>
              {reservation.status === 'pending' && (
                <>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.confirmButton]}
                    onPress={() => handleStatusUpdate(reservation.id, 'confirmed')}
                  >
                    <LinearGradient
                      colors={['#4CAF50', '#45A049']}
                      style={styles.buttonGradient}
                    >
                      <Check size={16} color={colors.white} strokeWidth={2.5} />
                      <Text style={styles.actionButtonText}>Confirm</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => handleStatusUpdate(reservation.id, 'cancelled')}
                  >
                    <LinearGradient
                      colors={['#F44336', '#E53935']}
                      style={styles.buttonGradient}
                    >
                      <X size={16} color={colors.white} strokeWidth={2.5} />
                      <Text style={styles.actionButtonText}>Decline</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              )}
              {reservation.status === 'confirmed' && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.seatButton]}
                  onPress={() => handleStatusUpdate(reservation.id, 'seated')}
                >
                  <LinearGradient
                    colors={['#FF6B6B', '#FF5252']}
                    style={styles.buttonGradient}
                  >
                    <Users size={16} color={colors.white} strokeWidth={2.5} />
                    <Text style={styles.actionButtonText}>Seat Guests</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
              {reservation.status === 'seated' && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.completeButton]}
                  onPress={() => handleStatusUpdate(reservation.id, 'completed')}
                >
                  <LinearGradient
                    colors={['#4CAF50', '#45A049']}
                    style={styles.buttonGradient}
                  >
                    <Check size={16} color={colors.white} strokeWidth={2.5} />
                    <Text style={styles.actionButtonText}>Complete</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.contactButton}>
                <Phone size={16} color="#FF6B6B" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FF6B6B', '#FF8E8E', '#FFAB91']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Animated.View 
          style={[
            styles.headerContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View>
            <Text style={styles.title}>Reservations</Text>
            <Text style={styles.subtitle}>{filteredReservations.length} reservations today</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton} testID="reservations-calendar-btn" activeOpacity={0.8}>
              <Calendar size={20} color={colors.white} strokeWidth={2.5} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} testID="reservations-filter-btn" activeOpacity={0.8}>
              <Filter size={20} color={colors.white} strokeWidth={2.5} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.addButton} 
              testID="reservations-add-btn" 
              activeOpacity={0.9}
              onPress={() => router.push('/(restaurant)/new-reservation')}
            >
              <LinearGradient
                colors={['#FFFFFF', '#F5F5F5']}
                style={styles.addButtonGradient}
              >
                <Plus size={18} color="#FF6B6B" strokeWidth={2.5} />
                <Text style={styles.addButtonText}>New</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>

      <View style={styles.dateSelector}>
        <Text style={styles.selectedDate}>Today - January 20, 2025</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{mockReservations.filter(r => r.status === 'pending').length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{mockReservations.filter(r => r.status === 'confirmed').length}</Text>
            <Text style={styles.statLabel}>Confirmed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{mockReservations.filter(r => r.status === 'seated').length}</Text>
            <Text style={styles.statLabel}>Seated</Text>
          </View>
        </View>
      </View>

      <View style={styles.filterTabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabsContent}
        >
          <TouchableOpacity
            style={[
              styles.filterTab,
              selectedFilter === 'all' && styles.filterTabActive,
            ]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text
              style={[
                styles.filterTabText,
                selectedFilter === 'all' && styles.filterTabTextActive,
              ]}
            >
              All ({mockReservations.filter(r => r.date === selectedDate).length})
            </Text>
            {selectedFilter === 'all' && <View style={styles.filterTabIndicator} />}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterTab,
              selectedFilter === 'pending' && styles.filterTabActive,
            ]}
            onPress={() => setSelectedFilter('pending')}
          >
            <Text
              style={[
                styles.filterTabText,
                selectedFilter === 'pending' && styles.filterTabTextActive,
              ]}
            >
              Pending ({mockReservations.filter(r => r.date === selectedDate && r.status === 'pending').length})
            </Text>
            {selectedFilter === 'pending' && <View style={styles.filterTabIndicator} />}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterTab,
              selectedFilter === 'confirmed' && styles.filterTabActive,
            ]}
            onPress={() => setSelectedFilter('confirmed')}
          >
            <Text
              style={[
                styles.filterTabText,
                selectedFilter === 'confirmed' && styles.filterTabTextActive,
              ]}
            >
              Confirmed ({mockReservations.filter(r => r.date === selectedDate && r.status === 'confirmed').length})
            </Text>
            {selectedFilter === 'confirmed' && <View style={styles.filterTabIndicator} />}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterTab,
              selectedFilter === 'seated' && styles.filterTabActive,
            ]}
            onPress={() => setSelectedFilter('seated')}
          >
            <Text
              style={[
                styles.filterTabText,
                selectedFilter === 'seated' && styles.filterTabTextActive,
              ]}
            >
              Seated ({mockReservations.filter(r => r.date === selectedDate && r.status === 'seated').length})
            </Text>
            {selectedFilter === 'seated' && <View style={styles.filterTabIndicator} />}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterTab,
              selectedFilter === 'completed' && styles.filterTabActive,
            ]}
            onPress={() => setSelectedFilter('completed')}
          >
            <Text
              style={[
                styles.filterTabText,
                selectedFilter === 'completed' && styles.filterTabTextActive,
              ]}
            >
              Completed ({mockReservations.filter(r => r.date === selectedDate && r.status === 'completed').length})
            </Text>
            {selectedFilter === 'completed' && <View style={styles.filterTabIndicator} />}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterTab,
              selectedFilter === 'cancelled' && styles.filterTabActive,
            ]}
            onPress={() => setSelectedFilter('cancelled')}
          >
            <Text
              style={[
                styles.filterTabText,
                selectedFilter === 'cancelled' && styles.filterTabTextActive,
              ]}
            >
              Cancelled ({mockReservations.filter(r => r.date === selectedDate && r.status === 'cancelled').length})
            </Text>
            {selectedFilter === 'cancelled' && <View style={styles.filterTabIndicator} />}
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.reservationsList}>
          {filteredReservations.length > 0 ? (
            filteredReservations.map((reservation, index) => (
              <ReservationCard key={reservation.id} reservation={reservation} index={index} />
            ))
          ) : (
            <Animated.View 
              style={[
                styles.emptyState,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={['#E3F2FD', '#BBDEFB']}
                style={styles.emptyStateGradient}
              >
                <Calendar size={64} color="#2196F3" strokeWidth={1.5} />
                <Text style={styles.emptyStateText}>No reservations found</Text>
                <Text style={styles.emptyStateSubtext}>
                  {selectedFilter === 'all'
                    ? 'No reservations for this date'
                    : `No ${selectedFilter} reservations for this date`}
                </Text>
              </LinearGradient>
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.white,
    ...shadows.small,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
  },
  addButton: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    gap: 8,
  },
  addButtonText: {
    color: '#FF6B6B',
    fontWeight: '700',
    fontSize: 15,
  },
  dateSelector: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  selectedDate: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 10,
    ...shadows.small,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
    fontWeight: '500',
  },
  filterTabsContainer: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 16,
  },
  filterTabsContent: {
    paddingHorizontal: 16,
    gap: 24,
  },
  filterTab: {
    paddingVertical: 8,
    position: 'relative',
  },
  filterTabActive: {
    // Active state handled by indicator
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textLight,
  },
  filterTabTextActive: {
    color: '#FF7060',
    fontWeight: '600',
  },
  filterTabIndicator: {
    position: 'absolute',
    bottom: -8,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#FF7060',
    borderRadius: 1,
  },
  scrollView: {
    flex: 1,
  },
  reservationsList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  reservationCard: {
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  cardGradient: {
    padding: 16,
    borderRadius: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 6,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 10,
  },
  customerAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: colors.white,
  },
  customerDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginRight: 8,
  },
  vipBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    fontSize: 11,
    color: colors.textLight,
    marginLeft: 4,
    fontWeight: '500',
  },
  reservationMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reservationTime: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '600',
  },
  partySize: {
    fontSize: 10,
    color: colors.secondary,
    fontWeight: '600',
  },
  specialRequestsCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  requestsGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  specialRequestsText: {
    fontSize: 11,
    color: colors.text,
    fontWeight: '500',
    flex: 1,
  },
  tableNumberBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableNumber: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.white,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: colors.success,
  },
  rejectButton: {
    backgroundColor: colors.error,
  },
  seatButton: {
    backgroundColor: colors.primary,
  },
  completeButton: {
    backgroundColor: colors.success,
  },
  contactButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,107,107,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.2)',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  emptyStateGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    width: '100%',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
});