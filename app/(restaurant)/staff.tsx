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
import { LinearGradient } from 'expo-linear-gradient';
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
        activeOpacity={0.9}
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
              <View style={[styles.roleBadge, { backgroundColor: roleColor + '15' }]}>
                <RoleIcon size={12} color={roleColor} strokeWidth={2} />
                <Text style={[styles.roleText, { color: roleColor }]}>
                  {staff.role.charAt(0).toUpperCase() + staff.role.slice(1)}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <MoreVertical size={16} color={colors.textLight} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <View style={styles.contactSection}>
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <View style={styles.contactIcon}>
                <Phone size={14} color={colors.primary} strokeWidth={2} />
              </View>
              <Text style={styles.contactText}>{staff.phone}</Text>
            </View>
            <View style={styles.contactItem}>
              <View style={styles.contactIcon}>
                <Mail size={14} color={colors.secondary} strokeWidth={2} />
              </View>
              <Text style={styles.contactText}>{staff.email}</Text>
            </View>
          </View>
        </View>

        <View style={styles.scheduleCard}>
          <View style={styles.scheduleHeader}>
            <View style={styles.scheduleIcon}>
              <Clock size={14} color={colors.primary} strokeWidth={2} />
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
            <Calendar size={12} color={colors.textLight} strokeWidth={2} />
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
            { backgroundColor: staff.isActive ? colors.success + '15' : colors.error + '15' }
          ]}>
            <Text style={[styles.statusText, { color: staff.isActive ? colors.success : colors.error }]}>
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
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Staff Management</Text>
            <Text style={styles.subtitle}>{filteredStaff.length} staff members</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton} activeOpacity={0.8}>
              <Filter size={18} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} activeOpacity={0.9}>
              <Plus size={16} color={colors.white} />
              <Text style={styles.addButtonText}>Add Staff</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: colors.white,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: colors.white,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    gap: 6,
    ...shadows.medium,
  },
  filterContainer: {
    paddingLeft: 16,
    marginBottom: 16,
  },
  filterContent: {
    paddingRight: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.backgroundLight,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 13,
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
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  staffCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...shadows.medium,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inactiveCard: {
    opacity: 0.7,
  },
  staffHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  staffInfo: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  staffAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.border,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.white,
  },
  staffDetails: {
    flex: 1,
  },
  staffName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  moreButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: colors.backgroundLight,
  },
  contactSection: {
    marginBottom: 16,
  },
  contactInfo: {
    gap: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactText: {
    fontSize: 13,
    color: colors.textLight,
    fontWeight: '500',
    flex: 1,
  },
  scheduleCard: {
    backgroundColor: colors.backgroundLight,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  scheduleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  scheduleDetails: {
    paddingLeft: 32,
  },
  scheduleTime: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  scheduleDays: {
    fontSize: 13,
    color: colors.textLight,
    fontWeight: '500',
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
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
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
  addButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
});