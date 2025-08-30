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
        <View style={styles.customerInfo}>
          <View style={styles.avatarContainer}>
            {reservation.customerAvatar ? (
              <Image
                source={{ uri: reservation.customerAvatar }}
                style={styles.customerAvatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Users size={16} color={colors.white} strokeWidth={2} />
              </View>
            )}
          </View>
          <View style={styles.customerDetails}>
            <Text style={styles.customerName}>{reservation.customerName}</Text>
            <View style={styles.reservationMeta}>
              <View style={styles.metaItem}>
                <Clock size={12} color={colors.primary} strokeWidth={2} />
                <Text style={styles.reservationTime}>{reservation.time}</Text>
              </View>
              <View style={styles.metaItem}>
                <Users size={12} color={colors.secondary} strokeWidth={2} />
                <Text style={styles.partySize}>{reservation.partySize} guests</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.cardRight}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(reservation.status) + '15' }
          ]}>
            <Text style={[styles.statusText, { color: getStatusColor(reservation.status) }]}>
              {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
            </Text>
          </View>
          {reservation.tableNumber && (
            <View style={styles.tableNumberBadge}>
              <Text style={styles.tableNumber}>#{reservation.tableNumber}</Text>
            </View>
          )}
        </View>
      </View>

      {reservation.specialRequests && (
        <View style={styles.specialRequestsCard}>
          <MessageSquare size={12} color={colors.primary} strokeWidth={2} />
          <Text style={styles.specialRequestsText}>{reservation.specialRequests}</Text>
        </View>
      )}

      <View style={styles.actionButtons}>
        {reservation.status === 'pending' && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.confirmButton]}
              onPress={() => handleStatusUpdate(reservation.id, 'confirmed')}
            >
              <Check size={14} color={colors.white} strokeWidth={2} />
              <Text style={styles.actionButtonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => handleStatusUpdate(reservation.id, 'cancelled')}
            >
              <X size={14} color={colors.white} strokeWidth={2} />
              <Text style={styles.actionButtonText}>Cancel</Text>
            </TouchableOpacity>
          </>
        )}
        {reservation.status === 'confirmed' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.seatButton]}
            onPress={() => handleStatusUpdate(reservation.id, 'seated')}
          >
            <Users size={14} color={colors.white} strokeWidth={2} />
            <Text style={styles.actionButtonText}>Seat Guests</Text>
          </TouchableOpacity>
        )}
        {reservation.status === 'seated' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.completeButton]}
            onPress={() => handleStatusUpdate(reservation.id, 'completed')}
          >
            <Check size={14} color={colors.white} strokeWidth={2} />
            <Text style={styles.actionButtonText}>Complete</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.contactButton}>
          <Phone size={14} color={colors.primary} strokeWidth={2} />
        </TouchableOpacity>
      </View>
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
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 2,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
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
    borderRadius: 14,
    padding: 12,
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
  filterContainer: {
    paddingLeft: 16,
    marginBottom: 16,
  },
  filterContent: {
    paddingRight: 20,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.backgroundLight,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textLight,
  },
  filterButtonTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  reservationsList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  reservationCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    ...shadows.small,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
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
    marginRight: 12,
  },
  customerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
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
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
  partySize: {
    fontSize: 11,
    color: colors.secondary,
    fontWeight: '600',
  },
  specialRequestsCard: {
    backgroundColor: colors.backgroundLight,
    padding: 6,
    borderRadius: 6,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  specialRequestsText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
    flex: 1,
  },
  tableNumberBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tableNumber: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.white,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 8,
    gap: 3,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 12,
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
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
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