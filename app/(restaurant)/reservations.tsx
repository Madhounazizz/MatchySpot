import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
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
} from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { mockReservations } from '@/mocks/reservations';
import { Reservation } from '@/types';

type FilterStatus = 'all' | 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled';

export default function ReservationsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<FilterStatus>('all');
  const [selectedDate, setSelectedDate] = useState('2025-01-20');

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

  const FilterButton = ({ status, label }: { status: FilterStatus; label: string }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === status && styles.filterButtonActive,
      ]}
      onPress={() => setSelectedFilter(status)}
    >
      <Text
        style={[
          styles.filterButtonText,
          selectedFilter === status && styles.filterButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const ReservationCard = ({ reservation }: { reservation: Reservation }) => (
    <TouchableOpacity style={styles.reservationCard} activeOpacity={0.9} testID={`reservation-${reservation.id}`}>
      <View style={styles.cardHeader}>
        <View style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(reservation.status) + '15' }
        ]}>
          <Text style={[styles.statusText, { color: getStatusColor(reservation.status) }]}>
            {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
          </Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <MoreVertical size={16} color={colors.textLight} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <View style={styles.reservationHeader}>
        <View style={styles.customerInfo}>
          <View style={styles.avatarContainer}>
            {reservation.customerAvatar ? (
              <Image
                source={{ uri: reservation.customerAvatar }}
                style={styles.customerAvatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Users size={20} color={colors.white} strokeWidth={2} />
              </View>
            )}
          </View>
          <View style={styles.customerDetails}>
            <Text style={styles.customerName}>{reservation.customerName}</Text>
            <View style={styles.reservationMeta}>
              <View style={styles.metaItem}>
                <Clock size={14} color={colors.primary} strokeWidth={2} />
                <Text style={styles.reservationTime}>{reservation.time}</Text>
              </View>
              <View style={styles.metaItem}>
                <Users size={14} color={colors.secondary} strokeWidth={2} />
                <Text style={styles.partySize}>Party of {reservation.partySize}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {reservation.specialRequests && (
        <View style={styles.specialRequestsCard}>
          <View style={styles.specialRequestsHeader}>
            <MessageSquare size={14} color={colors.primary} strokeWidth={2} />
            <Text style={styles.specialRequestsLabel}>Special Requests</Text>
          </View>
          <Text style={styles.specialRequestsText}>{reservation.specialRequests}</Text>
        </View>
      )}

      <View style={styles.contactSection}>
        <View style={styles.contactGrid}>
          <View style={styles.contactItem}>
            <View style={styles.contactIcon}>
              <Phone size={14} color={colors.primary} strokeWidth={2} />
            </View>
            <Text style={styles.contactText}>{reservation.customerPhone}</Text>
          </View>
          <View style={styles.contactItem}>
            <View style={styles.contactIcon}>
              <Mail size={14} color={colors.secondary} strokeWidth={2} />
            </View>
            <Text style={styles.contactText}>{reservation.customerEmail}</Text>
          </View>
        </View>
        {reservation.tableNumber && (
          <View style={styles.tableInfo}>
            <Text style={styles.tableLabel}>Assigned Table</Text>
            <View style={styles.tableNumberBadge}>
              <Text style={styles.tableNumber}>#{reservation.tableNumber}</Text>
            </View>
          </View>
        )}
      </View>

      {reservation.status === 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.confirmButton]}
            onPress={() => handleStatusUpdate(reservation.id, 'confirmed')}
          >
            <Check size={18} color={colors.white} strokeWidth={2.5} />
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => handleStatusUpdate(reservation.id, 'cancelled')}
          >
            <X size={18} color={colors.white} strokeWidth={2.5} />
            <Text style={styles.rejectButtonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}

      {reservation.status === 'confirmed' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.seatButton]}
            onPress={() => handleStatusUpdate(reservation.id, 'seated')}
          >
            <Users size={18} color={colors.white} strokeWidth={2.5} />
            <Text style={styles.seatButtonText}>Seat Guests</Text>
          </TouchableOpacity>
        </View>
      )}

      {reservation.status === 'seated' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.completeButton]}
            onPress={() => handleStatusUpdate(reservation.id, 'completed')}
          >
            <Check size={18} color={colors.white} strokeWidth={2.5} />
            <Text style={styles.completeButtonText}>Complete</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Reservations</Text>
            <Text style={styles.subtitle}>{filteredReservations.length} reservations today</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton} testID="reservations-calendar-btn" activeOpacity={0.8}>
              <Calendar size={18} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} testID="reservations-filter-btn" activeOpacity={0.8}>
              <Filter size={18} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} testID="reservations-add-btn" activeOpacity={0.9}>
              <Plus size={16} color={colors.white} />
              <Text style={styles.addButtonText}>New</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        <FilterButton status={"all"} label={`All (${mockReservations.filter(r => r.date === selectedDate).length})`} />
        <FilterButton status={"pending"} label={`Pending (${mockReservations.filter(r => r.date === selectedDate && r.status === 'pending').length})`} />
        <FilterButton status={"confirmed"} label={`Confirmed (${mockReservations.filter(r => r.date === selectedDate && r.status === 'confirmed').length})`} />
        <FilterButton status={"seated"} label={`Seated (${mockReservations.filter(r => r.date === selectedDate && r.status === 'seated').length})`} />
        <FilterButton status={"completed"} label={`Completed (${mockReservations.filter(r => r.date === selectedDate && r.status === 'completed').length})`} />
        <FilterButton status={"cancelled"} label={`Cancelled (${mockReservations.filter(r => r.date === selectedDate && r.status === 'cancelled').length})`} />
      </ScrollView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.reservationsList}>
          {filteredReservations.length > 0 ? (
            filteredReservations.map((reservation) => (
              <ReservationCard key={reservation.id} reservation={reservation} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Calendar size={48} color={colors.textLight} />
              <Text style={styles.emptyStateText}>No reservations found</Text>
              <Text style={styles.emptyStateSubtext}>
                {selectedFilter === 'all'
                  ? 'No reservations for this date'
                  : `No ${selectedFilter} reservations for this date`}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 32,
    backgroundColor: colors.white,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    ...shadows.large,
    elevation: 12,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -1.5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 6,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.secondary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
    elevation: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 20,
    gap: 10,
    ...shadows.card,
    elevation: 8,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 16,
  },
  dateSelector: {
    paddingHorizontal: 28,
    paddingVertical: 24,
  },
  selectedDate: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 32,
    padding: 28,
    ...shadows.large,
    elevation: 18,
    borderLeftWidth: 6,
    borderLeftColor: colors.primary,
    borderWidth: 0,
    transform: [{ scale: 1 }],
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 6,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  filterContainer: {
    paddingLeft: 28,
    marginBottom: 24,
  },
  filterContent: {
    paddingRight: 20,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: colors.white,
    ...shadows.card,
    elevation: 6,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    ...shadows.large,
    elevation: 8,
  },
  filterButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textLight,
  },
  filterButtonTextActive: {
    color: colors.white,
    fontWeight: '800',
  },
  scrollView: {
    flex: 1,
  },
  reservationsList: {
    paddingHorizontal: 28,
    paddingBottom: 32,
  },
  reservationCard: {
    backgroundColor: colors.white,
    borderRadius: 36,
    padding: 32,
    marginBottom: 32,
    ...shadows.large,
    elevation: 20,
    borderWidth: 0,
    transform: [{ scale: 1 }],
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  moreButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: colors.backgroundLight,
  },
  reservationHeader: {
    marginBottom: 16,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 20,
  },
  customerAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: colors.white,
    ...shadows.medium,
    elevation: 8,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
    elevation: 8,
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  reservationMeta: {
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  reservationTime: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  partySize: {
    fontSize: 14,
    color: colors.secondary,
    fontWeight: '600',
  },
  specialRequestsCard: {
    backgroundColor: colors.backgroundLight,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  specialRequestsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  specialRequestsLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  specialRequestsText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
    fontWeight: '500',
  },
  contactSection: {
    marginBottom: 24,
    backgroundColor: colors.backgroundLight,
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contactGrid: {
    gap: 16,
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
    elevation: 4,
  },
  contactText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
  },
  tableInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    padding: 12,
    borderRadius: 12,
  },
  tableLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  tableNumberBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tableNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 20,
    gap: 8,
    ...shadows.large,
    elevation: 10,
  },
  confirmButton: {
    backgroundColor: colors.success,
  },
  confirmButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  rejectButton: {
    backgroundColor: colors.error,
  },
  rejectButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  seatButton: {
    backgroundColor: colors.primary,
  },
  seatButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  completeButton: {
    backgroundColor: colors.success,
  },
  completeButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
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