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
        let droppedOn: TableWithPos | null = null;
        Object.entries(tableFrames.current).forEach(([id, frame]) => {
          const withinX = dropX >= frame.x && dropX <= frame.x + frame.w;
          const withinY = dropY >= frame.y && dropY <= frame.y + frame.h;
          if (withinX && withinY) {
            const t = tables.find(tb => tb.id === id) || null;
            if (t) droppedOn = t;
          }
        });
        if (droppedOn && d.type === 'reservation') {
          updateTable(droppedOn.id, { status: 'reserved', reservationId: d.id });
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
      <LinearGradient
        colors={[colors.white, colors.backgroundLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
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
      </LinearGradient>

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
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 24,
    backgroundColor: colors.white,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    ...shadows.large,
    elevation: 12,
  },
  title: { fontSize: 32, fontWeight: '900', color: colors.text, letterSpacing: -0.8 },
  subtitle: { fontSize: 14, color: colors.textLight, marginTop: 6, fontWeight: '700' },
  legend: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, color: colors.textLight, fontWeight: '700' },
  filterContainer: { paddingLeft: 28, marginBottom: 12, marginTop: 8 },
  filterContent: { paddingRight: 20 },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: colors.white,
    marginRight: 10,
    borderWidth: 0,
    ...shadows.card,
    elevation: 6,
  },
  filterButtonActive: { backgroundColor: colors.primary, ...shadows.large, elevation: 8 },
  filterButtonText: { fontSize: 14, fontWeight: '700', color: colors.text },
  filterButtonTextActive: { color: colors.white },
  floorWrapper: { paddingHorizontal: 16, alignItems: 'center' },
  floor: {
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.large,
    elevation: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  tableNode: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: colors.backgroundLight,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeIconContainer: { position: 'absolute', top: 6, left: 6, width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  nodeLabel: { fontSize: 14, fontWeight: '900', color: colors.text },
  nodeFooter: { position: 'absolute', bottom: 6, flexDirection: 'row', alignItems: 'center', gap: 4 },
  nodeCap: { fontSize: 12, color: colors.textLight, fontWeight: '700' },
  nodeBadge: { position: 'absolute', right: 6, bottom: 6, backgroundColor: colors.primary, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 4, flexDirection: 'row', alignItems: 'center', gap: 4 },
  nodeBadgeText: { color: colors.white, fontSize: 10, fontWeight: '800' },
  resTray: { marginTop: 14 },
  trayHeader: { paddingHorizontal: 28, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  trayTitle: { fontSize: 18, fontWeight: '900', color: colors.text },
  traySubtitle: { fontSize: 12, color: colors.textLight, fontWeight: '700' },
  trayContent: { paddingHorizontal: 20, paddingVertical: 10 },
  trayChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 10, marginRight: 10, borderWidth: 1, borderColor: colors.border, ...shadows.card },
  trayChipText: { fontSize: 13, fontWeight: '800', color: colors.primary, marginLeft: 6 },
  trayChipTextSmall: { fontSize: 12, fontWeight: '800', color: colors.textLight },
  trayChipDot: { color: colors.textLight, marginHorizontal: 6 },
  dragChip: { position: 'absolute', backgroundColor: colors.primary, borderRadius: 16, paddingHorizontal: 10, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 6, zIndex: 20 },
  dragChipText: { color: colors.white, fontSize: 12, fontWeight: '800' },
});