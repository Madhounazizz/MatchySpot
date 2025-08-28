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
import { colors, shadows } from '@/constants/colors';
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
        activeOpacity={0.95}
        testID={`staff-${staff.id}`}
      >
        <View style={styles.staffHeader}>
          <View style={styles.staffInfo}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: staff.avatar }} style={styles.staffAvatar} />
              <View style={[
                styles.statusIndicator,
                { backgroundColor: staff.isActive ? colors.success : colors.error }
              ]} />
            </View>
            <View style={styles.staffDetails}>
              <Text style={styles.staffName}>{staff.name}</Text>
              <View style={[styles.roleBadge, { backgroundColor: roleColor + '12' }]}>
                <RoleIcon size={14} color={roleColor} strokeWidth={2.5} />
                <Text style={[styles.roleText, { color: roleColor }]}>
                  {staff.role.charAt(0).toUpperCase() + staff.role.slice(1)}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <MoreVertical size={20} color={colors.textLight} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <View style={styles.contactSection}>
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <View style={styles.contactIcon}>
                <Phone size={16} color={colors.primary} strokeWidth={2.5} />
              </View>
              <Text style={styles.contactText}>{staff.phone}</Text>
            </View>
            <View style={styles.contactItem}>
              <View style={styles.contactIcon}>
                <Mail size={16} color={colors.secondary} strokeWidth={2.5} />
              </View>
              <Text style={styles.contactText}>{staff.email}</Text>
            </View>
          </View>
        </View>

        <View style={styles.scheduleCard}>
          <View style={styles.scheduleHeader}>
            <View style={styles.scheduleIcon}>
              <Clock size={16} color={colors.white} strokeWidth={2.5} />
            </View>
            <Text style={styles.scheduleLabel}>Work Schedule</Text>
          </View>
          <View style={styles.scheduleDetails}>
            <Text style={styles.scheduleTime}>
              {staff.shift.start} - {staff.shift.end}
            </Text>
            <Text style={styles.scheduleDays}>
              {staff.shift.days.join(' • ')}
            </Text>
          </View>
        </View>

        <View style={styles.staffFooter}>
          <View style={styles.joinedInfo}>
            <Calendar size={14} color={colors.textLight} strokeWidth={2} />
            <Text style={styles.joinedText}>
              Joined {new Date(staff.joinedDate).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </Text>
          </View>
          <View style={[
            styles.statusBadge,
            { backgroundColor: staff.isActive ? colors.success : colors.error }
          ]}>
            <Text style={styles.statusText}>
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
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
    elevation: 8,
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
  staffList: {
    paddingHorizontal: 28,
    paddingBottom: 32,
  },
  staffCard: {
    backgroundColor: colors.white,
    borderRadius: 28,
    padding: 28,
    marginBottom: 20,
    ...shadows.large,
    elevation: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  inactiveCard: {
    opacity: 0.75,
  },
  staffHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  staffInfo: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 20,
  },
  staffAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: colors.white,
    ...shadows.card,
    elevation: 8,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: colors.white,
    ...shadows.small,
    elevation: 4,
  },
  staffDetails: {
    flex: 1,
  },
  staffName: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  moreButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: colors.backgroundLight,
  },
  contactSection: {
    marginBottom: 20,
  },
  contactInfo: {
    gap: 12,
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
    fontSize: 15,
    color: colors.textLight,
    fontWeight: '600',
    flex: 1,
  },
  scheduleCard: {
    backgroundColor: colors.primary,
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    ...shadows.card,
    elevation: 8,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  scheduleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -0.2,
  },
  scheduleDetails: {
    paddingLeft: 42,
  },
  scheduleTime: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.white,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  scheduleDays: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  staffFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  joinedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  joinedText: {
    fontSize: 13,
    color: colors.textLight,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    ...shadows.small,
    elevation: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.white,
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
});