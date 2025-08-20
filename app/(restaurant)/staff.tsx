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
  Users,
  Clock,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  MoreVertical,
  Plus,
  Filter,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { mockStaff } from '@/mocks/staff';
import { Staff } from '@/types';

type StaffFilter = 'all' | 'active' | 'inactive' | 'manager' | 'waiter' | 'host' | 'chef' | 'bartender';

export default function StaffScreen() {
  const [selectedFilter, setSelectedFilter] = useState<StaffFilter>('all');

  const filteredStaff = mockStaff.filter((staff) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'active') return staff.isActive;
    if (selectedFilter === 'inactive') return !staff.isActive;
    return staff.role === selectedFilter;
  });

  const getRoleColor = (role: Staff['role']): string => {
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

  const getRoleIcon = (role: Staff['role']) => {
    switch (role) {
      case 'manager':
        return Users;
      case 'chef':
        return Users;
      case 'waiter':
        return Users;
      case 'host':
        return Users;
      case 'bartender':
        return Users;
      default:
        return Users;
    }
  };

  const handleStaffAction = (staff: Staff) => {
    const actions: Array<{text: string; onPress?: () => void; style?: 'default' | 'cancel' | 'destructive'}> = [
      { text: 'View Details', onPress: () => console.log('View details for', staff.name) },
      { text: 'Edit Schedule', onPress: () => console.log('Edit schedule for', staff.name) },
    ];

    if (staff.isActive) {
      actions.push({ text: 'Mark Inactive', onPress: () => toggleStaffStatus(staff.id) });
    } else {
      actions.push({ text: 'Mark Active', onPress: () => toggleStaffStatus(staff.id) });
    }

    actions.push({ text: 'Cancel', style: 'cancel' });

    Alert.alert(
      staff.name,
      `${staff.role} • ${staff.isActive ? 'Active' : 'Inactive'}`,
      actions
    );
  };

  const toggleStaffStatus = (staffId: string) => {
    console.log(`Toggling status for staff ${staffId}`);
  };

  const FilterButton = ({ filter, label, count }: { 
    filter: StaffFilter; 
    label: string; 
    count: number;
  }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.filterButtonActive,
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text
        style={[
          styles.filterButtonText,
          selectedFilter === filter && styles.filterButtonTextActive,
        ]}
      >
        {label} ({count})
      </Text>
    </TouchableOpacity>
  );

  const StaffCard = ({ staff }: { staff: Staff }) => {
    const roleColor = getRoleColor(staff.role);
    const RoleIcon = getRoleIcon(staff.role);

    return (
      <TouchableOpacity
        style={[
          styles.staffCard,
          !staff.isActive && styles.inactiveCard,
        ]}
        onPress={() => handleStaffAction(staff)}
        activeOpacity={0.7}
      >
        <View style={styles.staffHeader}>
          <View style={styles.staffInfo}>
            <Image source={{ uri: staff.avatar }} style={styles.staffAvatar} />
            <View style={styles.staffDetails}>
              <View style={styles.nameRow}>
                <Text style={styles.staffName}>{staff.name}</Text>
                {staff.isActive ? (
                  <CheckCircle size={16} color={colors.success} />
                ) : (
                  <XCircle size={16} color={colors.error} />
                )}
              </View>
              <View style={styles.roleContainer}>
                <View style={[styles.roleBadge, { backgroundColor: roleColor + '15' }]}>
                  <RoleIcon size={12} color={roleColor} />
                  <Text style={[styles.roleText, { color: roleColor }]}>
                    {staff.role.charAt(0).toUpperCase() + staff.role.slice(1)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <MoreVertical size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        <View style={styles.contactInfo}>
          <View style={styles.contactItem}>
            <Phone size={14} color={colors.textLight} />
            <Text style={styles.contactText}>{staff.phone}</Text>
          </View>
          <View style={styles.contactItem}>
            <Mail size={14} color={colors.textLight} />
            <Text style={styles.contactText}>{staff.email}</Text>
          </View>
        </View>

        <View style={styles.scheduleInfo}>
          <View style={styles.scheduleHeader}>
            <Clock size={14} color={colors.primary} />
            <Text style={styles.scheduleLabel}>Schedule</Text>
          </View>
          <Text style={styles.scheduleTime}>
            {staff.shift.start} - {staff.shift.end}
          </Text>
          <Text style={styles.scheduleDays}>
            {staff.shift.days.join(', ')}
          </Text>
        </View>

        <View style={styles.staffFooter}>
          <View style={styles.joinedInfo}>
            <Calendar size={12} color={colors.textLight} />
            <Text style={styles.joinedText}>
              Joined {new Date(staff.joinedDate).toLocaleDateString()}
            </Text>
          </View>
          <View style={[
            styles.statusBadge,
            { backgroundColor: staff.isActive ? colors.success + '15' : colors.error + '15' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: staff.isActive ? colors.success : colors.error }
            ]}>
              {staff.isActive ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const getFilterCounts = () => {
    return {
      all: mockStaff.length,
      active: mockStaff.filter(s => s.isActive).length,
      inactive: mockStaff.filter(s => !s.isActive).length,
      manager: mockStaff.filter(s => s.role === 'manager').length,
      waiter: mockStaff.filter(s => s.role === 'waiter').length,
      host: mockStaff.filter(s => s.role === 'host').length,
      chef: mockStaff.filter(s => s.role === 'chef').length,
      bartender: mockStaff.filter(s => s.role === 'bartender').length,
    };
  };

  const filterCounts = getFilterCounts();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Staff Management</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.filterIcon}>
            <Filter size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        <FilterButton filter={'all'} label={'All'} count={filterCounts.all} />
        <FilterButton filter={'active'} label={'Active'} count={filterCounts.active} />
        <FilterButton filter={'inactive'} label={'Inactive'} count={filterCounts.inactive} />
        <FilterButton filter={'manager'} label={'Managers'} count={filterCounts.manager} />
        <FilterButton filter={'waiter'} label={'Waiters'} count={filterCounts.waiter} />
        <FilterButton filter={'host'} label={'Hosts'} count={filterCounts.host} />
        <FilterButton filter={'chef'} label={'Chefs'} count={filterCounts.chef} />
        <FilterButton filter={'bartender'} label={'Bartenders'} count={filterCounts.bartender} />
      </ScrollView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.staffList}>
          {filteredStaff.length > 0 ? (
            filteredStaff.map((staff) => (
              <StaffCard key={staff.id} staff={staff} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Users size={48} color={colors.textLight} />
              <Text style={styles.emptyStateText}>No staff found</Text>
              <Text style={styles.emptyStateSubtext}>
                {selectedFilter === 'all'
                  ? 'No staff members available'
                  : `No ${selectedFilter} staff members found`}
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterIcon: {
    padding: 8,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
  staffList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  staffCard: {
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
  inactiveCard: {
    opacity: 0.7,
  },
  staffHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  staffInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  staffAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  staffDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  staffName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  moreButton: {
    padding: 4,
  },
  contactInfo: {
    gap: 8,
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactText: {
    fontSize: 14,
    color: colors.textLight,
  },
  scheduleInfo: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  scheduleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  scheduleTime: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  scheduleDays: {
    fontSize: 14,
    color: colors.textLight,
  },
  staffFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  joinedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  joinedText: {
    fontSize: 12,
    color: colors.textLight,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
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