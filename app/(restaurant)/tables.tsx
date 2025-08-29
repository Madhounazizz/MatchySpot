import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  PanResponder,
  LayoutChangeEvent,
  Dimensions,
} from 'react-native';
import {
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Utensils,
  MapPin,
  Move,
} from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { mockTables } from '@/mocks/tables';
import { mockReservations } from '@/mocks/reservations';
import { Table, Reservation } from '@/types';

type TableFilter = 'all' | 'available' | 'occupied' | 'reserved' | 'cleaning';

type TableWithPos = Table & { x: number; y: number };

type ReservationDrag = { type: 'reservation'; id: string; x: number; y: number; width: number; height: number };
type DragState = ReservationDrag | null;

function isReservationDrag(d: DragState): d is ReservationDrag {
  return !!d && d.type === 'reservation';
}

export default function TablesScreen() {
  const [selectedFilter, setSelectedFilter] = useState<TableFilter>('all');
  const [tables, setTables] = useState<TableWithPos[]>(() =>
    mockTables.map((t, idx) => ({ ...t, x: 40 + (idx % 4) * 80, y: 40 + Math.floor(idx / 4) * 90 }))
  );
  const [drag, setDrag] = useState<DragState>(null);
  const tableFrames = useRef<Record<string, { x: number; y: number; w: number; h: number }>>({});
  const floorSize = useMemo(() => ({ width: Dimensions.get('window').width - 32, height: 420 }), []);

  const activeReservations = useMemo(
    () =>
      mockReservations
        .filter(r => r.status === 'confirmed')
        .slice(0, 12),
    []
  );

  const filteredTables = useMemo(() => {
    return tables.filter((table) => selectedFilter === 'all' || table.status === selectedFilter);
  }, [tables, selectedFilter]);

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
    const table = tables.find(t => t.id === tableId);
    if (table?.reservationId) {
      return mockReservations.find(r => r.id === table.reservationId) ?? null;
    }
    return null;
  };

  const updateTable = (tableId: string, patch: Partial<TableWithPos>) => {
    setTables(prev => prev.map(t => (t.id === tableId ? { ...t, ...patch } : t)));
  };

  const handleTableAction = (table: TableWithPos) => {
    const actions: Array<{ text: string; onPress?: () => void; style?: 'default' | 'cancel' | 'destructive' }> = [];
    switch (table.status) {
      case 'available':
        actions.push(
          { text: 'Mark as Cleaning', onPress: () => updateTable(table.id, { status: 'cleaning' }) },
          { text: 'Seat Guests', onPress: () => updateTable(table.id, { status: 'occupied' }) }
        );
        break;
      case 'occupied':
        actions.push({ text: 'Clear Table', onPress: () => updateTable(table.id, { status: 'cleaning', reservationId: undefined }) });
        break;
      case 'cleaning':
        actions.push({ text: 'Mark Available', onPress: () => updateTable(table.id, { status: 'available' }) });
        break;
      case 'reserved':
        actions.push(
          { text: 'Seat Guests', onPress: () => updateTable(table.id, { status: 'occupied' }) },
          { text: 'Cancel Reservation', onPress: () => updateTable(table.id, { status: 'available', reservationId: undefined }) }
        );
        break;
    }
    actions.push({ text: 'Cancel', style: 'cancel' });
    Alert.alert(`Table ${table.number}`, `Current status: ${table.status}`, actions);
  };

  const onTableLayout = (id: string, e: LayoutChangeEvent) => {
    const { x, y, width, height } = e.nativeEvent.layout;
    tableFrames.current[id] = { x, y, w: width, h: height };
  };

  const startReservationDrag = (res: Reservation) => {
    setDrag({ type: 'reservation', id: res.id, x: 0, y: 0, width: 72, height: 40 });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !!drag,
      onMoveShouldSetPanResponder: () => !!drag,
      onPanResponderMove: (_, gesture) => {
        if (!drag) return;
        setDrag({ ...drag, x: gesture.moveX - drag.width / 2, y: gesture.moveY - drag.height / 2 });
      },
      onPanResponderRelease: (_, gesture) => {
        const d = drag as ReservationDrag | null;
        if (!d) return setDrag(null);
        const dropX = gesture.moveX;
        const dropY = gesture.moveY;
        let droppedOnId: string | null = null;
        Object.entries(tableFrames.current).forEach(([id, frame]) => {
          const withinX = dropX >= frame.x && dropX <= frame.x + frame.w;
          const withinY = dropY >= frame.y && dropY <= frame.y + frame.h;
          if (withinX && withinY) {
            const t = tables.find(tb => tb.id === id) || null;
            if (t) droppedOnId = t.id;
          }
        });
        if (droppedOnId !== null && d.type === 'reservation') {
          console.log('Dropping reservation on table', droppedOnId, 'reservation', d.id);
          updateTable(droppedOnId, { status: 'reserved', reservationId: d.id });
        }
        setDrag(null);
      },
    })
  ).current;

  const FilterButton = ({ status, label, count }: { status: TableFilter; label: string; count: number }) => (
    <TouchableOpacity
      style={[styles.filterButton, selectedFilter === status && styles.filterButtonActive]}
      onPress={() => setSelectedFilter(status)}
      testID={`filter-${status}`}
    >
      <Text style={[styles.filterButtonText, selectedFilter === status && styles.filterButtonTextActive]}>
        {label} ({count})
      </Text>
    </TouchableOpacity>
  );

  const TableNode = ({ table }: { table: TableWithPos }) => {
    const StatusIcon = getStatusIcon(table.status);
    const statusColor = getStatusColor(table.status);
    const reservation = getReservationInfo(table.id);

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleTableAction(table)}
        onLayout={(e) => onTableLayout(table.id, e)}
        style={[styles.tableNode, { left: table.x, top: table.y, borderColor: statusColor }]}
        testID={`floor-table-${table.id}`}
      >
        <View style={[styles.nodeIconContainer, { backgroundColor: statusColor + '15' }]}>
          <StatusIcon size={16} color={statusColor} />
        </View>
        <Text style={styles.nodeLabel}>T{table.number}</Text>
        <View style={styles.nodeFooter}>
          <Users size={12} color={colors.textLight} />
          <Text style={styles.nodeCap}>{table.capacity}</Text>
        </View>
        {reservation ? (
          <View style={styles.nodeBadge}>
            <Clock size={10} color={colors.white} />
            <Text style={styles.nodeBadgeText}>{reservation.time}</Text>
          </View>
        ) : null}
      </TouchableOpacity>
    );
  };

  const getFilterCounts = () => {
    return {
      all: tables.length,
      available: tables.filter(t => t.status === 'available').length,
      occupied: tables.filter(t => t.status === 'occupied').length,
      reserved: tables.filter(t => t.status === 'reserved').length,
      cleaning: tables.filter(t => t.status === 'cleaning').length,
    };
  };

  const filterCounts = getFilterCounts();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Tables</Text>
            <Text style={styles.subtitle}>{Math.round(((filterCounts.occupied + filterCounts.reserved) / filterCounts.all) * 100)}% occupied</Text>
          </View>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: getStatusColor('available') }]} />
              <Text style={styles.legendText}>Free</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: getStatusColor('reserved') }]} />
              <Text style={styles.legendText}>Reserved</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: getStatusColor('occupied') }]} />
              <Text style={styles.legendText}>Occupied</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer} contentContainerStyle={styles.filterContent}>
        <FilterButton status={'all'} label={'All'} count={filterCounts.all} />
        <FilterButton status={'available'} label={'Available'} count={filterCounts.available} />
        <FilterButton status={'occupied'} label={'Occupied'} count={filterCounts.occupied} />
        <FilterButton status={'reserved'} label={'Reserved'} count={filterCounts.reserved} />
        <FilterButton status={'cleaning'} label={'Cleaning'} count={filterCounts.cleaning} />
      </ScrollView>

      <View style={styles.floorWrapper}>
        <View style={[styles.floor, { width: floorSize.width, height: floorSize.height }]} {...panResponder.panHandlers}>
          {filteredTables.map((t) => (
            <TableNode key={t.id} table={t} />
          ))}
          {drag && drag.type === 'reservation' ? (
            <View style={[styles.dragChip, { left: drag.x, top: drag.y }]} pointerEvents="none">
              <Clock size={12} color={colors.white} />
              <Text style={styles.dragChipText}>Assign</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.resTray}>
        <View style={styles.trayHeader}>
          <Text style={styles.trayTitle}>Incoming</Text>
          <Text style={styles.traySubtitle}>{activeReservations.length} reservations</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trayContent}>
          {activeReservations.map((r) => (
            <DraggableReservation key={r.id} res={r} onDragStart={startReservationDrag} />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function DraggableReservation({ res, onDragStart }: { res: Reservation; onDragStart: (r: Reservation) => void }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPressIn={() => onDragStart(res)}
      style={styles.trayChip}
      testID={`res-chip-${res.id}`}
    >
      <Move size={14} color={colors.primary} />
      <Text style={styles.trayChipText}>{res.time}</Text>
      <Text style={styles.trayChipDot}>•</Text>
      <Text style={styles.trayChipTextSmall}>{res.partySize}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.backgroundLight 
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
    fontWeight: '500' 
  },
  legend: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12,
  },
  legendItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4 
  },
  legendDot: { 
    width: 8, 
    height: 8, 
    borderRadius: 4,
  },
  legendText: { 
    fontSize: 11, 
    color: colors.textLight, 
    fontWeight: '500' 
  },
  filterContainer: { 
    paddingLeft: 16, 
    marginTop: 16,
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
    color: colors.textLight 
  },
  filterButtonTextActive: { 
    color: colors.white,
    fontWeight: '600',
  },
  floorWrapper: { 
    paddingHorizontal: 16, 
    alignItems: 'center',
    marginBottom: 16,
  },
  floor: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  tableNode: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
    elevation: 2,
  },
  nodeIconContainer: { 
    position: 'absolute', 
    top: 4, 
    left: 4, 
    width: 20, 
    height: 20, 
    borderRadius: 10, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  nodeLabel: { 
    fontSize: 12, 
    fontWeight: '600', 
    color: colors.text,
  },
  nodeFooter: { 
    position: 'absolute', 
    bottom: 4, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 2,
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 8,
  },
  nodeCap: { 
    fontSize: 10, 
    color: colors.textLight, 
    fontWeight: '500' 
  },
  nodeBadge: { 
    position: 'absolute', 
    right: 4, 
    top: 4, 
    backgroundColor: colors.primary, 
    borderRadius: 8, 
    paddingHorizontal: 4, 
    paddingVertical: 2, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 2,
  },
  nodeBadgeText: { 
    color: colors.white, 
    fontSize: 8, 
    fontWeight: '600' 
  },
  resTray: { 
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    ...shadows.small,
    elevation: 4,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  trayHeader: { 
    paddingHorizontal: 16, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  trayTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: colors.text,
  },
  traySubtitle: { 
    fontSize: 12, 
    color: colors.textLight, 
    fontWeight: '500' 
  },
  trayContent: { 
    paddingHorizontal: 16, 
    paddingVertical: 8,
    paddingBottom: 16,
  },
  trayChip: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: colors.backgroundLight, 
    borderRadius: 16, 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    marginRight: 8, 
    borderWidth: 1, 
    borderColor: colors.border, 
  },
  trayChipText: { 
    fontSize: 12, 
    fontWeight: '600', 
    color: colors.primary, 
    marginLeft: 4,
  },
  trayChipTextSmall: { 
    fontSize: 12, 
    fontWeight: '500', 
    color: colors.textLight 
  },
  trayChipDot: { 
    color: colors.textLight, 
    marginHorizontal: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  dragChip: { 
    position: 'absolute', 
    backgroundColor: colors.primary, 
    borderRadius: 12, 
    paddingHorizontal: 8, 
    paddingVertical: 6, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4, 
    zIndex: 20,
    ...shadows.medium,
    elevation: 8,
  },
  dragChipText: { 
    color: colors.white, 
    fontSize: 12, 
    fontWeight: '600',
  },
});