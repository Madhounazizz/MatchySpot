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
    <TouchableOpacity style={styles.reservationCard} activeOpacity={0.95} testID={`reservation-${reservation.id}`}>
      <View style={styles.cardHeader}>
        <View style={styles.statusIndicatorBar}>
          <View style={[
            styles.statusIndicator,
            { backgroundColor: getStatusColor(reservation.status) }
          ]} />
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(reservation.status) }
          ]}>
            <Text style={styles.statusText}>
              {reservation.status.toUpperCase()}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <MoreVertical size={18} color={colors.textLight} strokeWidth={2} />
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
                <Users size={24} color={colors.white} strokeWidth={2.5} />
              </View>
            )}
          </View>
          <View style={styles.customerDetails}>
            <Text style={styles.customerName}>{reservation.customerName}</Text>
            <View style={styles.reservationMeta}>
              <View style={styles.metaItem}>
                <Clock size={16} color={colors.primary} strokeWidth={2.5} />
                <Text style={styles.reservationTime}>{reservation.time}</Text>
              </View>
              <View style={styles.metaItem}>
                <Users size={16} color={colors.secondary} strokeWidth={2.5} />
                <Text style={styles.partySize}>Party of {reservation.partySize}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {reservation.specialRequests && (
        <View style={styles.specialRequestsCard}>
          <View style={styles.specialRequestsHeader}>
            <MessageSquare size={16} color={colors.accent} strokeWidth={2.5} />
            <Text style={styles.specialRequestsLabel}>Special Requests</Text>
          </View>
          <Text style={styles.specialRequestsText}>{reservation.specialRequests}</Text>
        </View>
      )}

      <View style={styles.contactSection}>
        <View style={styles.contactGrid}>
          <View style={styles.contactItem}>
            <View style={styles.contactIcon}>
              <Phone size={16} color={colors.primary} strokeWidth={2.5} />
            </View>
            <Text style={styles.contactText}>{reservation.customerPhone}</Text>
          </View>
          <View style={styles.contactItem}>
            <View style={styles.contactIcon}>
              <Mail size={16} color={colors.secondary} strokeWidth={2.5} />
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
      <LinearGradient
        colors={[colors.white, colors.backgroundLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View>
          <Text style={styles.title}>Reservations</Text>
          <Text style={styles.subtitle}>{filteredReservations.length} reservations today</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.calendarButton} testID="reservations-calendar-btn" activeOpacity={0.8}>
            <Calendar size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterIcon} testID="reservations-filter-btn" activeOpacity={0.8}>
            <Filter size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} testID="reservations-add-btn" activeOpacity={0.9}>
            <Plus size={20} color={colors.white} />
            <Text style={styles.addButtonText}>New</Text>
          </TouchableOpacity>
        </View>
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
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
    elevation: 6,
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
  filterIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.secondary + '12',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
    elevation: 6,
    borderWidth: 1,
    borderColor: colors.secondary + '20',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 20,
    gap: 8,
    ...shadows.large,
    elevation: 10,
    borderWidth: 1,
    borderColor: colors.primaryDark,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 0.3,
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
    padding: 28,
    marginBottom: 24,
    ...shadows.large,
    elevation: 15,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusIndicatorBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusIndicator: {
    width: 4,
    height: 32,
    borderRadius: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    ...shadows.small,
    elevation: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 0.5,
  },
  moreButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: colors.backgroundLight,
  },
  reservationHeader: {
    marginBottom: 20,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 16,
  },
  customerAvatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: colors.white,
    ...shadows.large,
    elevation: 10,
  },
  avatarPlaceholder: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.large,
    elevation: 10,
    borderWidth: 3,
    borderColor: colors.white,
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 10,
    letterSpacing: -0.4,
  },
  reservationMeta: {
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  reservationTime: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '700',
  },
  partySize: {
    fontSize: 15,
    color: colors.secondary,
    fontWeight: '700',
  },
  specialRequestsCard: {
    backgroundColor: colors.accent + '40',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  specialRequestsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  specialRequestsLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: -0.1,
  },
  specialRequestsText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    fontWeight: '500',
  },
  contactSection: {
    marginBottom: 20,
  },
  contactGrid: {
    gap: 12,
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactText: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '600',
    flex: 1,
  },
  tableInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    padding: 16,
    borderRadius: 16,
  },
  tableLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  tableNumberBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    ...shadows.small,
    elevation: 4,
  },
  tableNumber: {
    fontSize: 14,
    fontWeight: '800',
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
    paddingVertical: 20,
    borderRadius: 24,
    gap: 12,
    ...shadows.large,
    elevation: 8,
  },
  confirmButton: {
    backgroundColor: colors.success,
  },
  confirmButtonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  rejectButton: {
    backgroundColor: colors.error,
  },
  rejectButtonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  seatButton: {
    backgroundColor: colors.primary,
  },
  seatButtonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  completeButton: {
    backgroundColor: colors.success,
  },
  completeButtonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.2,
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