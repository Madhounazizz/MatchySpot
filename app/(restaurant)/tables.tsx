import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import {
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Utensils,
  MapPin,
} from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import { mockTables } from '@/mocks/tables';
import { mockReservations } from '@/mocks/reservations';
import { Table } from '@/types';

type TableFilter = 'all' | 'available' | 'occupied' | 'reserved' | 'cleaning';

export default function TablesScreen() {
  const [selectedFilter, setSelectedFilter] = useState<TableFilter>('all');

  const filteredTables = mockTables.filter((table) => {
    return selectedFilter === 'all' || table.status === selectedFilter;
  });

  const getStatusIcon = (status: Table['status']) => {
    switch (status) {
      case 'available':
        return CheckCircle;
      case 'occupied':
        return Users;
      case 'reserved':
        return Clock;
      case 'cleaning':
        return AlertCircle;
      default:
        return XCircle;
    }
  };

  const getStatusColor = (status: Table['status']): string => {
    switch (status) {
      case 'available':
        return colors.success;
      case 'occupied':
        return colors.primary;
      case 'reserved':
        return colors.warning;
      case 'cleaning':
        return colors.accent;
      default:
        return colors.error;
    }
  };

  const getReservationInfo = (tableId: string) => {
    const table = mockTables.find(t => t.id === tableId);
    if (table?.reservationId) {
      return mockReservations.find(r => r.id === table.reservationId);
    }
    return null;
  };

  const handleTableAction = (table: Table) => {
    const actions = [];
    
    switch (table.status) {
      case 'available':
        actions.push(
          { text: 'Mark as Cleaning', onPress: () => updateTableStatus(table.id, 'cleaning') },
          { text: 'Seat Guests', onPress: () => updateTableStatus(table.id, 'occupied') }
        );
        break;
      case 'occupied':
        actions.push(
          { text: 'Clear Table', onPress: () => updateTableStatus(table.id, 'cleaning') }
        );
        break;
      case 'cleaning':
        actions.push(
          { text: 'Mark Available', onPress: () => updateTableStatus(table.id, 'available') }
        );
        break;
      case 'reserved':
        actions.push(
          { text: 'Seat Guests', onPress: () => updateTableStatus(table.id, 'occupied') },
          { text: 'Cancel Reservation', onPress: () => updateTableStatus(table.id, 'available') }
        );
        break;
    }

    actions.push({ text: 'Cancel', style: 'cancel' as const });

    Alert.alert(
      `Table ${table.number}`,
      `Current status: ${table.status}`,
      actions
    );
  };

  const updateTableStatus = (tableId: string, newStatus: Table['status']) => {
    console.log(`Updating table ${tableId} to ${newStatus}`);
  };

  const FilterButton = ({ status, label, count }: { 
    status: TableFilter; 
    label: string; 
    count: number;
  }) => (
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
        {label} ({count})
      </Text>
    </TouchableOpacity>
  );

  const TableCard = ({ table }: { table: Table }) => {
    const StatusIcon = getStatusIcon(table.status);
    const statusColor = getStatusColor(table.status);
    const reservation = getReservationInfo(table.id);

    return (
      <TouchableOpacity
        style={[
          styles.tableCard,
          { borderLeftColor: statusColor, borderLeftWidth: 4 }
        ]}
        onPress={() => handleTableAction(table)}
        activeOpacity={0.7}
      >
        <View style={styles.tableHeader}>
          <View style={styles.tableInfo}>
            <Text style={styles.tableNumber}>{table.number}</Text>
            <View style={styles.tableCapacity}>
              <Users size={16} color={colors.textLight} />
              <Text style={styles.capacityText}>{table.capacity} seats</Text>
            </View>
          </View>
          <View style={[styles.statusContainer, { backgroundColor: statusColor + '15' }]}>
            <StatusIcon size={20} color={statusColor} />
          </View>
        </View>

        <View style={styles.tableDetails}>
          <View style={styles.locationInfo}>
            <MapPin size={14} color={colors.textLight} />
            <Text style={styles.locationText}>{table.location}</Text>
          </View>
          
          <View style={styles.statusInfo}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
            </Text>
          </View>
        </View>

        {reservation && (
          <View style={styles.reservationInfo}>
            <View style={styles.reservationHeader}>
              <Clock size={14} color={colors.primary} />
              <Text style={styles.reservationLabel}>Reserved</Text>
            </View>
            <Text style={styles.reservationDetails}>
              {reservation.customerName} • {reservation.time} • Party of {reservation.partySize}
            </Text>
            {reservation.specialRequests && (
              <Text style={styles.specialRequests} numberOfLines={1}>
                Note: {reservation.specialRequests}
              </Text>
            )}
          </View>
        )}

        {table.status === 'occupied' && !reservation && (
          <View style={styles.occupiedInfo}>
            <Utensils size={14} color={colors.primary} />
            <Text style={styles.occupiedText}>Currently serving guests</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const getFilterCounts = () => {
    return {
      all: mockTables.length,
      available: mockTables.filter(t => t.status === 'available').length,
      occupied: mockTables.filter(t => t.status === 'occupied').length,
      reserved: mockTables.filter(t => t.status === 'reserved').length,
      cleaning: mockTables.filter(t => t.status === 'cleaning').length,
    };
  };

  const filterCounts = getFilterCounts();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Table Management</Text>
        <View style={styles.occupancyRate}>
          <Text style={styles.occupancyText}>
            {Math.round(((filterCounts.occupied + filterCounts.reserved) / filterCounts.all) * 100)}% occupied
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        <FilterButton status={'all'} label={'All'} count={filterCounts.all} />
        <FilterButton status={'available'} label={'Available'} count={filterCounts.available} />
        <FilterButton status={'occupied'} label={'Occupied'} count={filterCounts.occupied} />
        <FilterButton status={'reserved'} label={'Reserved'} count={filterCounts.reserved} />
        <FilterButton status={'cleaning'} label={'Cleaning'} count={filterCounts.cleaning} />
      </ScrollView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.tableGrid}>
          {filteredTables.map((table) => (
            <TableCard key={table.id} table={table} />
          ))}
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
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: colors.white,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    ...shadows.card,
    elevation: 6,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.8,
  },
  occupancyRate: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  occupancyText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  filterContainer: {
    paddingLeft: 24,
    marginBottom: 20,
  },
  filterContent: {
    paddingRight: 20,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: colors.white,
    marginRight: 10,
    borderWidth: 0,
    ...shadows.small,
    elevation: 2,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    ...shadows.card,
    elevation: 4,
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
  tableGrid: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  tableCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    ...shadows.card,
    elevation: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tableInfo: {
    flex: 1,
  },
  tableNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  tableCapacity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  capacityText: {
    fontSize: 14,
    color: colors.textLight,
  },
  statusContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 14,
    color: colors.textLight,
  },
  statusInfo: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  reservationInfo: {
    backgroundColor: colors.backgroundLight,
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  reservationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  reservationLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  reservationDetails: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  specialRequests: {
    fontSize: 12,
    color: colors.textLight,
    fontStyle: 'italic',
  },
  occupiedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  occupiedText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
});