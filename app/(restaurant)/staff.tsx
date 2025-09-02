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
  Star,
  Phone,
  Mail,
  Calendar,
  Plus,
  Edit3,
  UserCheck,
  UserX,
  Award,
  TrendingUp,
} from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

type StaffRole = 'manager' | 'chef' | 'waiter' | 'host' | 'bartender';
type StaffStatus = 'active' | 'on-break' | 'off-duty' | 'sick';

type StaffMember = {
  id: string;
  name: string;
  role: StaffRole;
  status: StaffStatus;
  avatar?: string;
  email: string;
  phone: string;
  rating: number;
  hoursWorked: number;
  ordersServed: number;
  joinDate: string;
  shift: string;
  performance: number;
};

const mockStaff: StaffMember[] = [
  {
    id: '1',
    name: 'Alex Thompson',
    role: 'waiter',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    email: 'alex@restaurant.com',
    phone: '+1 (555) 123-4567',
    rating: 4.8,
    hoursWorked: 42,
    ordersServed: 156,
    joinDate: '2023-03-15',
    shift: '5:00 PM - 11:00 PM',
    performance: 92,
  },
  {
    id: '2',
    name: 'Maria Garcia',
    role: 'chef',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    email: 'maria@restaurant.com',
    phone: '+1 (555) 234-5678',
    rating: 4.9,
    hoursWorked: 45,
    ordersServed: 89,
    joinDate: '2022-08-20',
    shift: '4:00 PM - 12:00 AM',
    performance: 96,
  },
  {
    id: '3',
    name: 'James Wilson',
    role: 'manager',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    email: 'james@restaurant.com',
    phone: '+1 (555) 345-6789',
    rating: 4.7,
    hoursWorked: 50,
    ordersServed: 0,
    joinDate: '2021-11-10',
    shift: '2:00 PM - 10:00 PM',
    performance: 88,
  },
  {
    id: '4',
    name: 'Sarah Kim',
    role: 'bartender',
    status: 'on-break',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    email: 'sarah@restaurant.com',
    phone: '+1 (555) 456-7890',
    rating: 4.6,
    hoursWorked: 38,
    ordersServed: 78,
    joinDate: '2023-01-05',
    shift: '6:00 PM - 2:00 AM',
    performance: 85,
  },
];

export default function StaffScreen() {
  const [staff, setStaff] = useState<StaffMember[]>(mockStaff);
  const [selectedFilter, setSelectedFilter] = useState<'all' | StaffStatus>('all');

  const filteredStaff = staff.filter(member => 
    selectedFilter === 'all' || member.status === selectedFilter
  );

  const getRoleColor = (role: StaffRole): string => {
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
        return colors.secondary;
      default:
        return colors.textLight;
    }
  };

  const getStatusColor = (status: StaffStatus): string => {
    switch (status) {
      case 'active':
        return colors.success;
      case 'on-break':
        return colors.warning;
      case 'off-duty':
        return colors.textLight;
      case 'sick':
        return colors.error;
      default:
        return colors.textLight;
    }
  };

  const getStatusIcon = (status: StaffStatus) => {
    switch (status) {
      case 'active':
        return UserCheck;
      case 'on-break':
        return Clock;
      case 'off-duty':
        return UserX;
      case 'sick':
        return UserX;
      default:
        return Users;
    }
  };

  const handleStatusChange = (memberId: string, newStatus: StaffStatus) => {
    setStaff(prev => prev.map(member => 
      member.id === memberId ? { ...member, status: newStatus } : member
    ));
  };

  const StaffCard = ({ member }: { member: StaffMember }) => {
    const StatusIcon = getStatusIcon(member.status);
    const roleColor = getRoleColor(member.role);
    const statusColor = getStatusColor(member.status);

    return (
      <TouchableOpacity style={styles.staffCard} activeOpacity={0.9}>
        <View style={styles.cardHeader}>
          <View style={styles.staffInfo}>
            <View style={styles.avatarContainer}>
              {member.avatar ? (
                <Image source={{ uri: member.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Users size={20} color={colors.white} strokeWidth={2} />
                </View>
              )}
              <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
            </View>
            <View style={styles.memberDetails}>
              <Text style={styles.memberName}>{member.name}</Text>
              <View style={[styles.roleBadge, { backgroundColor: roleColor + '15' }]}>
                <Text style={[styles.roleText, { color: roleColor }]}>
                  {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                </Text>
              </View>
              <View style={styles.ratingContainer}>
                <Star size={12} color={colors.warning} fill={colors.warning} />
                <Text style={styles.ratingText}>{member.rating}</Text>
              </View>
            </View>
          </View>
          <View style={styles.cardActions}>
            <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
              <StatusIcon size={12} color={statusColor} strokeWidth={2} />
              <Text style={[styles.statusText, { color: statusColor }]}>
                {member.status === 'on-break' ? 'Break' : 
                 member.status === 'off-duty' ? 'Off' :
                 member.status === 'sick' ? 'Sick' : 'Active'}
              </Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Edit3 size={14} color={colors.primary} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.performanceSection}>
          <View style={styles.performanceBar}>
            <View 
              style={[
                styles.performanceFill, 
                { 
                  width: `${member.performance}%`,
                  backgroundColor: member.performance >= 90 ? colors.success : 
                                 member.performance >= 70 ? colors.warning : colors.error
                }
              ]} 
            />
          </View>
          <Text style={styles.performanceText}>{member.performance}% Performance</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Clock size={14} color={colors.primary} strokeWidth={2} />
            <Text style={styles.statValue}>{member.hoursWorked}h</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
          {member.role !== 'manager' && (
            <View style={styles.statItem}>
              <Award size={14} color={colors.success} strokeWidth={2} />
              <Text style={styles.statValue}>{member.ordersServed}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
          )}
          <View style={styles.statItem}>
            <TrendingUp size={14} color={colors.warning} strokeWidth={2} />
            <Text style={styles.statValue}>+12%</Text>
            <Text style={styles.statLabel}>Growth</Text>
          </View>
        </View>

        <View style={styles.shiftInfo}>
          <Text style={styles.shiftText}>Shift: {member.shift}</Text>
          <View style={styles.contactButtons}>
            <TouchableOpacity style={styles.contactButton}>
              <Phone size={12} color={colors.primary} strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactButton}>
              <Mail size={12} color={colors.primary} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const getStaffStats = () => {
    return {
      total: staff.length,
      active: staff.filter(s => s.status === 'active').length,
      onBreak: staff.filter(s => s.status === 'on-break').length,
      offDuty: staff.filter(s => s.status === 'off-duty').length,
      avgPerformance: Math.round(staff.reduce((sum, s) => sum + s.performance, 0) / staff.length),
    };
  };

  const stats = getStaffStats();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.white, colors.backgroundLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View>
          <Text style={styles.title}>Staff Management</Text>
          <Text style={styles.subtitle}>{stats.active} of {stats.total} staff active</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.scheduleButton}>
            <Calendar size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={20} color={colors.white} />
            <Text style={styles.addButtonText}>Add Staff</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.statsSection}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.active}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: colors.warning }]}>{stats.onBreak}</Text>
            <Text style={styles.statLabel}>On Break</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: colors.textLight }]}>{stats.offDuty}</Text>
            <Text style={styles.statLabel}>Off Duty</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{stats.avgPerformance}%</Text>
            <Text style={styles.statLabel}>Avg Performance</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.staffList}>
          {filteredStaff.map((member) => (
            <StaffCard key={member.id} member={member} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.white,
    ...shadows.small,
    elevation: 4,
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
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scheduleButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  statsSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 10,
    ...shadows.small,
    elevation: 2,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.success,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textLight,
    marginTop: 3,
    fontWeight: '500',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  staffList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  staffCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...shadows.small,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  staffInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.white,
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.warning,
  },
  cardActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  editButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  performanceSection: {
    marginBottom: 12,
  },
  performanceBar: {
    height: 4,
    backgroundColor: colors.backgroundLight,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  performanceFill: {
    height: '100%',
    borderRadius: 2,
  },
  performanceText: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '500',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  shiftInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  shiftText: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '500',
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  contactButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});