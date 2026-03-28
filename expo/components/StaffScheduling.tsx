import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Alert,
} from 'react-native';
import {
  Calendar,
  Clock,
  Users,
  Plus,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';

import { Staff } from '@/types';

type ShiftSchedule = {
  id: string;
  staffId: string;
  staffName: string;
  staffAvatar: string;
  role: Staff['role'];
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'absent';
};

const mockSchedules: ShiftSchedule[] = [
  {
    id: '1',
    staffId: '1',
    staffName: 'James Wilson',
    staffAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    role: 'manager',
    date: '2025-01-20',
    startTime: '09:00',
    endTime: '18:00',
    status: 'confirmed',
  },
  {
    id: '2',
    staffId: '2',
    staffName: 'Maria Garcia',
    staffAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    role: 'host',
    date: '2025-01-20',
    startTime: '17:00',
    endTime: '23:00',
    status: 'scheduled',
  },
  {
    id: '3',
    staffId: '3',
    staffName: 'Alex Thompson',
    staffAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    role: 'waiter',
    date: '2025-01-20',
    startTime: '16:00',
    endTime: '22:00',
    status: 'confirmed',
  },
  {
    id: '4',
    staffId: '4',
    staffName: 'Chef Roberto',
    staffAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    role: 'chef',
    date: '2025-01-20',
    startTime: '14:00',
    endTime: '23:00',
    status: 'confirmed',
  },
];

interface StaffSchedulingProps {
  visible: boolean;
  onClose: () => void;
}

export default function StaffScheduling({ visible, onClose }: StaffSchedulingProps) {
  const [selectedDate, setSelectedDate] = useState<string>('2025-01-20');
  const [schedules, setSchedules] = useState<ShiftSchedule[]>(mockSchedules);
  const [, setShowAddModal] = useState<boolean>(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: ShiftSchedule['status']) => {
    switch (status) {
      case 'confirmed':
        return colors.success;
      case 'scheduled':
        return colors.warning;
      case 'completed':
        return colors.primary;
      case 'absent':
        return colors.error;
      default:
        return colors.textLight;
    }
  };

  const getRoleColor = (role: Staff['role']) => {
    switch (role) {
      case 'manager':
        return colors.primary;
      case 'chef':
        return colors.error;
      case 'waiter':
        return colors.success;
      case 'host':
        return colors.warning;
      case 'bartender':
        return colors.accent;
      default:
        return colors.textLight;
    }
  };

  const filteredSchedules = schedules.filter(schedule => schedule.date === selectedDate);

  const handleDeleteShift = (shiftId: string) => {
    Alert.alert(
      'Delete Shift',
      'Are you sure you want to delete this shift?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setSchedules(prev => prev.filter(s => s.id !== shiftId));
          },
        },
      ]
    );
  };

  const ShiftCard = ({ shift }: { shift: ShiftSchedule }) => {
    const statusColor = getStatusColor(shift.status);
    const roleColor = getRoleColor(shift.role);

    return (
      <View style={[styles.shiftCard, { borderLeftColor: statusColor }]}>
        <View style={styles.shiftHeader}>
          <View style={styles.staffInfo}>
            <View style={styles.avatarContainer}>
              <View style={[styles.roleIndicator, { backgroundColor: roleColor }]} />
            </View>
            <View style={styles.staffDetails}>
              <Text style={styles.staffName}>{shift.staffName}</Text>
              <Text style={[styles.staffRole, { color: roleColor }]}>
                {shift.role.charAt(0).toUpperCase() + shift.role.slice(1)}
              </Text>
            </View>
          </View>
          <View style={styles.shiftActions}>
            <TouchableOpacity style={styles.editButton}>
              <Edit3 size={16} color={colors.primary} strokeWidth={2.5} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteShift(shift.id)}
            >
              <Trash2 size={16} color={colors.error} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.shiftDetails}>
          <View style={styles.timeContainer}>
            <Clock size={16} color={colors.primary} strokeWidth={2.5} />
            <Text style={styles.shiftTime}>
              {shift.startTime} - {shift.endTime}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {shift.status.charAt(0).toUpperCase() + shift.status.slice(1)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedDate);
    const newDate = new Date(currentDate);
    
    if (direction === 'prev') {
      newDate.setDate(currentDate.getDate() - 1);
    } else {
      newDate.setDate(currentDate.getDate() + 1);
    }
    
    setSelectedDate(newDate.toISOString().split('T')[0]);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Calendar size={24} color={colors.primary} strokeWidth={2.5} />
            <Text style={styles.title}>Staff Scheduling</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={colors.textLight} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <View style={styles.dateNavigation}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigateDate('prev')}
          >
            <ChevronLeft size={20} color={colors.primary} strokeWidth={2.5} />
          </TouchableOpacity>
          <View style={styles.dateContainer}>
            <Text style={styles.selectedDate}>{formatDate(selectedDate)}</Text>
            <Text style={styles.scheduleCount}>
              {filteredSchedules.length} staff scheduled
            </Text>
          </View>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigateDate('next')}
          >
            <ChevronRight size={20} color={colors.primary} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <View style={styles.quickStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {filteredSchedules.filter(s => s.status === 'confirmed').length}
            </Text>
            <Text style={styles.statLabel}>Confirmed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {filteredSchedules.filter(s => s.status === 'scheduled').length}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {filteredSchedules.reduce((total, shift) => {
                const start = parseInt(shift.startTime.split(':')[0]);
                const end = parseInt(shift.endTime.split(':')[0]);
                return total + (end - start);
              }, 0)}h
            </Text>
            <Text style={styles.statLabel}>Total Hours</Text>
          </View>
        </View>

        <ScrollView style={styles.schedulesList} showsVerticalScrollIndicator={false}>
          {filteredSchedules.length > 0 ? (
            filteredSchedules.map((shift) => (
              <ShiftCard key={shift.id} shift={shift} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Users size={48} color={colors.textLight} />
              <Text style={styles.emptyStateText}>No shifts scheduled</Text>
              <Text style={styles.emptyStateSubtext}>
                Add staff shifts for this date
              </Text>
            </View>
          )}
        </ScrollView>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={20} color={colors.white} strokeWidth={2.5} />
          <Text style={styles.addButtonText}>Add Shift</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
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
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.small,
    elevation: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: colors.white,
    marginBottom: 16,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateContainer: {
    alignItems: 'center',
  },
  selectedDate: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  scheduleCount: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500',
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...shadows.card,
    elevation: 6,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '600',
  },
  schedulesList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  shiftCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    ...shadows.card,
    elevation: 6,
  },
  shiftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  staffInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  roleIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  staffDetails: {
    flex: 1,
  },
  staffName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  staffRole: {
    fontSize: 14,
    fontWeight: '600',
  },
  shiftActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.error + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shiftDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shiftTime: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    marginHorizontal: 24,
    marginBottom: 24,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    ...shadows.button,
    elevation: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
});