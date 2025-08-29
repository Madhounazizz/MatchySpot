import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
} from 'react-native';
import {
  Bell,
  Calendar,
  Users,
  AlertCircle,
  CheckCircle,
  X,

  DollarSign,
} from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';

type NotificationType = 'reservation' | 'order' | 'staff' | 'system' | 'payment';

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actionRequired?: boolean;
};

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'reservation',
    title: 'New Reservation',
    message: 'Sarah Johnson booked a table for 4 at 7:00 PM',
    timestamp: '2 minutes ago',
    isRead: false,
    priority: 'high',
    actionRequired: true,
  },
  {
    id: '2',
    type: 'order',
    title: 'Order Ready',
    message: 'Table 12 order is ready for service',
    timestamp: '5 minutes ago',
    isRead: false,
    priority: 'medium',
  },
  {
    id: '3',
    type: 'staff',
    title: 'Staff Check-in',
    message: 'Alex Thompson clocked in for evening shift',
    timestamp: '15 minutes ago',
    isRead: true,
    priority: 'low',
  },
  {
    id: '4',
    type: 'payment',
    title: 'Payment Received',
    message: 'Table 8 payment of $127.50 processed successfully',
    timestamp: '20 minutes ago',
    isRead: true,
    priority: 'low',
  },
  {
    id: '5',
    type: 'system',
    title: 'System Update',
    message: 'Menu items updated successfully',
    timestamp: '1 hour ago',
    isRead: true,
    priority: 'low',
  },
];

interface NotificationCenterProps {
  visible: boolean;
  onClose: () => void;
}

export default function NotificationCenter({ visible, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [slideAnim] = useState(new Animated.Value(300));

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: 300,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    }
  }, [visible, slideAnim]);

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'reservation':
        return Calendar;
      case 'order':
        return Users;
      case 'staff':
        return Users;
      case 'payment':
        return DollarSign;
      case 'system':
        return AlertCircle;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'reservation':
        return colors.primary;
      case 'order':
        return colors.success;
      case 'staff':
        return colors.secondary;
      case 'payment':
        return colors.warning;
      case 'system':
        return colors.info;
      default:
        return colors.textLight;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return colors.error;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.success;
      default:
        return colors.textLight;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const NotificationItem = ({ notification }: { notification: Notification }) => {
    const Icon = getNotificationIcon(notification.type);
    const iconColor = getNotificationColor(notification.type);
    const priorityColor = getPriorityColor(notification.priority);

    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          !notification.isRead && styles.unreadNotification,
        ]}
        onPress={() => markAsRead(notification.id)}
        activeOpacity={0.8}
      >
        <View style={styles.notificationLeft}>
          <View style={[styles.notificationIcon, { backgroundColor: iconColor + '15' }]}>
            <Icon size={20} color={iconColor} strokeWidth={2.5} />
          </View>
          <View style={styles.notificationContent}>
            <View style={styles.notificationHeader}>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
            </View>
            <Text style={styles.notificationMessage} numberOfLines={2}>
              {notification.message}
            </Text>
            <Text style={styles.notificationTime}>{notification.timestamp}</Text>
          </View>
        </View>
        {notification.actionRequired && (
          <View style={styles.actionRequired}>
            <AlertCircle size={16} color={colors.error} />
          </View>
        )}
        {!notification.isRead && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.overlayTouch} onPress={onClose} />
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Bell size={24} color={colors.primary} strokeWidth={2.5} />
              <Text style={styles.title}>Notifications</Text>
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
            <View style={styles.headerActions}>
              {unreadCount > 0 && (
                <TouchableOpacity
                  style={styles.markAllButton}
                  onPress={markAllAsRead}
                >
                  <CheckCircle size={18} color={colors.success} />
                  <Text style={styles.markAllText}>Mark All</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={20} color={colors.textLight} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            style={styles.notificationsList}
            showsVerticalScrollIndicator={false}
          >
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Bell size={48} color={colors.textLight} />
                <Text style={styles.emptyStateText}>No notifications</Text>
                <Text style={styles.emptyStateSubtext}>
                  You&apos;re all caught up!
                </Text>
              </View>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  overlayTouch: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    width: 380,
    height: '100%',
    backgroundColor: colors.white,
    ...shadows.large,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.backgroundLight,
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
  badge: {
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 11,
    color: colors.white,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  markAllText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  notificationsList: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + '30',
  },
  unreadNotification: {
    backgroundColor: colors.primary + '05',
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  notificationMessage: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
    marginBottom: 6,
  },
  notificationTime: {
    fontSize: 12,
    color: colors.textExtraLight,
    fontWeight: '500',
  },
  actionRequired: {
    marginLeft: 12,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
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