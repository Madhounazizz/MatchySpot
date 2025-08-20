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
import { colors } from '@/constants/colors';
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
        <Text style={styles.title}>Reservations</Text>
        <TouchableOpacity style={styles.filterIcon}>
          <Filter size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.dateSelector}>
        <Text style={styles.selectedDate}>Today - January 20, 2025</Text>
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
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  filterIcon: {
    padding: 8,
  },
  dateSelector: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  selectedDate: {
    fontSize: 16,
    color: colors.textLight,
  },
  filterContainer: {
    paddingLeft: 20,
    marginBottom: 16,
  },
  filterContent: {
    paddingRight: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  filterButtonTextActive: {
    color: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  reservationsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  reservationCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  reservationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reservationTime: {
    fontSize: 14,
    color: colors.textLight,
    marginRight: 8,
  },
  partySize: {
    fontSize: 14,
    color: colors.textLight,
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
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
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
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  confirmButton: {
    backgroundColor: colors.success,
  },
  confirmButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  rejectButton: {
    backgroundColor: colors.error,
  },
  rejectButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  seatButton: {
    backgroundColor: colors.primary,
  },
  seatButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: colors.success,
  },
  completeButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
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