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
} from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
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
    <View style={styles.reservationCard}>
      <View style={styles.reservationHeader}>
        <View style={styles.customerInfo}>
          {reservation.customerAvatar && (
            <Image
              source={{ uri: reservation.customerAvatar }}
              style={styles.customerAvatar}
            />
          )}
          <View style={styles.customerDetails}>
            <Text style={styles.customerName}>{reservation.customerName}</Text>
            <View style={styles.reservationMeta}>
              <Clock size={14} color={colors.textLight} />
              <Text style={styles.reservationTime}>{reservation.time}</Text>
              <Users size={14} color={colors.textLight} />
              <Text style={styles.partySize}>Party of {reservation.partySize}</Text>
            </View>
          </View>
        </View>
        <View style={styles.reservationActions}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(reservation.status) + '15' },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(reservation.status) },
              ]}
            >
              {reservation.status}
            </Text>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <MoreVertical size={16} color={colors.textLight} />
          </TouchableOpacity>
        </View>
      </View>

      {reservation.specialRequests && (
        <View style={styles.specialRequests}>
          <MessageSquare size={14} color={colors.textLight} />
          <Text style={styles.specialRequestsText}>{reservation.specialRequests}</Text>
        </View>
      )}

      <View style={styles.reservationDetails}>
        <View style={styles.detailItem}>
          <Phone size={14} color={colors.textLight} />
          <Text style={styles.detailText}>{reservation.customerPhone}</Text>
        </View>
        <View style={styles.detailItem}>
          <Mail size={14} color={colors.textLight} />
          <Text style={styles.detailText}>{reservation.customerEmail}</Text>
        </View>
        {reservation.tableNumber && (
          <View style={styles.detailItem}>
            <Text style={styles.tableLabel}>Table:</Text>
            <Text style={styles.tableNumber}>{reservation.tableNumber}</Text>
          </View>
        )}
      </View>

      {reservation.status === 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.confirmButton]}
            onPress={() => handleStatusUpdate(reservation.id, 'confirmed')}
          >
            <Check size={16} color={colors.white} />
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => handleStatusUpdate(reservation.id, 'cancelled')}
          >
            <X size={16} color={colors.white} />
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
            <Users size={16} color={colors.white} />
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
            <Check size={16} color={colors.white} />
            <Text style={styles.completeButtonText}>Complete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Reservations</Text>
          <Text style={styles.subtitle}>{filteredReservations.length} reservations today</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.calendarButton}>
            <Calendar size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterIcon}>
            <Filter size={20} color={colors.primary} />
          </TouchableOpacity>
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
        <FilterButton status={"all"} label={"All"} />
        <FilterButton status={"pending"} label={"Pending"} />
        <FilterButton status={"confirmed"} label={"Confirmed"} />
        <FilterButton status={"seated"} label={"Seated"} />
        <FilterButton status={"completed"} label={"Completed"} />
        <FilterButton status={"cancelled"} label={"Cancelled"} />
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
    backgroundColor: '#f1f5f9',
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
  calendarButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
    elevation: 4,
  },
  filterIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.secondary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
    elevation: 4,
  },
  dateSelector: {
    paddingHorizontal: 28,
    paddingVertical: 28,
  },
  selectedDate: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 32,
    padding: 32,
    ...shadows.large,
    elevation: 10,
    marginBottom: 12,
    borderTopWidth: 4,
    borderTopColor: colors.primary,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 8,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  filterContainer: {
    paddingLeft: 28,
    marginBottom: 24,
  },
  filterContent: {
    paddingRight: 20,
  },
  filterButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: colors.white,
    marginRight: 12,
    borderWidth: 0,
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
    color: colors.text,
  },
  filterButtonTextActive: {
    color: colors.white,
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
    borderRadius: 32,
    padding: 32,
    marginBottom: 24,
    ...shadows.large,
    elevation: 10,
    borderLeftWidth: 6,
    borderLeftColor: colors.primary,
  },
  reservationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  customerInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  customerAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginRight: 24,
    borderWidth: 4,
    borderColor: colors.primary + '20',
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  reservationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reservationTime: {
    fontSize: 16,
    color: colors.textLight,
    marginRight: 12,
    fontWeight: '600',
  },
  partySize: {
    fontSize: 16,
    color: colors.textLight,
    fontWeight: '600',
  },
  reservationActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  moreButton: {
    padding: 4,
  },
  specialRequests: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.accent,
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
    gap: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  specialRequestsText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  reservationDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.textLight,
  },
  tableLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  tableNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
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
    paddingVertical: 18,
    borderRadius: 20,
    gap: 10,
    ...shadows.card,
    elevation: 6,
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
    fontSize: 18,
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