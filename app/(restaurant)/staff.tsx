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
    backgroundColor: '#f8fafc',
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
  headerContent: {
    flex: 1,
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
  headerButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.secondary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
    elevation: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 20,
    gap: 10,
    ...shadows.card,
    elevation: 8,
  },
  filterContainer: {
    paddingLeft: 28,
    marginTop: 28,
    marginBottom: 24,
  },
  filterContent: {
    paddingRight: 20,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: colors.white,
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
    color: colors.textLight,
  },
  filterButtonTextActive: {
    color: colors.white,
    fontWeight: '800',
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
    borderRadius: 36,
    padding: 32,
    marginBottom: 32,
    ...shadows.large,
    elevation: 18,
    borderWidth: 0,
    transform: [{ scale: 1 }],
    position: 'relative',
  },
  inactiveCard: {
    opacity: 0.7,
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
    borderWidth: 4,
    borderColor: colors.white,
    ...shadows.medium,
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
    fontSize: 28,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 12,
    letterSpacing: -0.7,
    lineHeight: 32,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'transparent',
    ...shadows.small,
    elevation: 4,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'capitalize',
    letterSpacing: 0.3,
  },
  moreButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
    elevation: 4,
  },
  contactSection: {
    marginBottom: 24,
    backgroundColor: colors.backgroundLight,
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contactInfo: {
    gap: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
    elevation: 4,
  },
  contactText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
  },
  scheduleCard: {
    backgroundColor: colors.primary + '12',
    padding: 24,
    borderRadius: 24,
    marginBottom: 24,
    borderLeftWidth: 6,
    borderLeftColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary + '20',
    ...shadows.medium,
    elevation: 8,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  scheduleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
    elevation: 4,
  },
  scheduleLabel: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
  },
  scheduleDetails: {
    paddingLeft: 60,
  },
  scheduleTime: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.primary,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  scheduleDays: {
    fontSize: 16,
    color: colors.textLight,
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
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinedText: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'transparent',
    ...shadows.small,
    elevation: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateText: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginTop: 20,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    fontWeight: '500',
  },
  addButtonText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 16,
  },
});