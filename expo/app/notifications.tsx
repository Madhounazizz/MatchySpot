import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Bell, 
  BellRing, 
  Calendar, 
  Gift, 
  Star, 
  DollarSign, 
  CheckCircle2, 
  X,
  Settings
} from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import { useLanguage } from '@/store/useLanguageStore';
import { useTokens } from '@/store/useTokenStore';

interface NotificationItem {
  id: string;
  type: 'booking' | 'event' | 'promo' | 'token' | 'review' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  data?: any;
  icon: React.ReactNode;
  color: string;
}

const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'booking',
    title: 'Booking Confirmed! 🎉',
    message: 'Your table at Coastal Breeze is confirmed for tonight at 7:00 PM',
    timestamp: '2 minutes ago',
    isRead: false,
    data: { brcId: '1', reservationId: 'res_123' },
    icon: <CheckCircle2 size={20} color={colors.success} />,
    color: colors.success
  },
  {
    id: '2',
    type: 'token',
    title: 'Tokens Earned! 🪙',
    message: 'You earned 20 tokens for reviewing Neon Lounge',
    timestamp: '1 hour ago',
    isRead: false,
    data: { amount: 20, brcId: '3' },
    icon: <DollarSign size={20} color={colors.warning} />,
    color: colors.warning
  },
  {
    id: '3',
    type: 'promo',
    title: 'Special Offer! 🔥',
    message: '20% off all cocktails at Neon Lounge until midnight',
    timestamp: '3 hours ago',
    isRead: true,
    data: { discount: 20, brcId: '3', expiresAt: '2025-07-15T23:59:59Z' },
    icon: <Gift size={20} color={colors.primary} />,
    color: colors.primary
  },
  {
    id: '4',
    type: 'event',
    title: 'Event Reminder 📅',
    message: 'Wine & Cheese Night starts in 2 hours at Coastal Breeze',
    timestamp: '4 hours ago',
    isRead: true,
    data: { eventId: '1', brcId: '1' },
    icon: <Calendar size={20} color={colors.info} />,
    color: colors.info
  },
  {
    id: '5',
    type: 'review',
    title: 'Review Request ⭐',
    message: 'How was your experience at Rustic Table? Share your review!',
    timestamp: '1 day ago',
    isRead: true,
    data: { brcId: '4' },
    icon: <Star size={20} color={colors.secondary} />,
    color: colors.secondary
  }
];

export default function NotificationsScreen() {
  const router = useRouter();
  useLanguage();
  useTokens();
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);

  const scheduleTestNotification = () => {
    const newNotification: NotificationItem = {
      id: Date.now().toString(),
      type: 'booking',
      title: 'Test Notification 🧪',
      message: 'This is a test notification from your BRC app!',
      timestamp: 'Just now',
      isRead: false,
      data: { type: 'test' },
      icon: <Bell size={20} color={colors.primary} />,
      color: colors.primary,
    };
    setNotifications(prev => [newNotification, ...prev]);
    Alert.alert('Simulated', 'Added a test notification locally. Push is disabled in Expo Go SDK 53.');
  };

  const scheduleBookingReminder = (brcName: string, time: string) => {
    const n: NotificationItem = {
      id: Date.now().toString(),
      type: 'event',
      title: 'Booking Reminder 📅',
      message: `Your reservation at ${brcName} is in 1 hour (${time})`,
      timestamp: 'Just now',
      isRead: false,
      data: { type: 'booking_reminder', brcName, time },
      icon: <Calendar size={20} color={colors.info} />,
      color: colors.info,
    };
    setNotifications(prev => [n, ...prev]);
  };

  const schedulePromoAlert = (brcName: string, discount: number) => {
    const n: NotificationItem = {
      id: Date.now().toString(),
      type: 'promo',
      title: 'Special Offer! 🔥',
      message: `${discount}% off at ${brcName}! Limited time only.`,
      timestamp: 'Just now',
      isRead: false,
      data: { type: 'promo', brcName, discount },
      icon: <Gift size={20} color={colors.primary} />,
      color: colors.primary,
    };
    setNotifications(prev => [n, ...prev]);
  };

  const handleNotificationPress = (notification: NotificationItem) => {
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
    );

    switch (notification.type) {
      case 'booking':
        if (notification.data?.brcId) {
          router.push(`/brc/${notification.data.brcId}`);
        }
        break;
      case 'token':
        router.push('/wallet');
        break;
      case 'promo':
        if (notification.data?.brcId) {
          router.push(`/brc/${notification.data.brcId}`);
        }
        break;
      case 'event':
        if (notification.data?.eventId) {
          router.push(`/events/${notification.data.eventId}`);
        }
        break;
      case 'review':
        if (notification.data?.brcId) {
          router.push(`/brc/${notification.data.brcId}`);
        }
        break;
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <BellRing size={24} color={colors.primary} />
            <Text style={styles.title}>Notifications</Text>
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => router.push('/settings')}
          >
            <Settings size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        <View style={styles.permissionCard}>
          <Bell size={24} color={colors.warning} />
          <View style={styles.permissionText}>
            <Text style={styles.permissionTitle}>Push unavailable in Expo Go</Text>
            <Text style={styles.permissionSubtitle}>
              In-app notifications work here. For real push, use a development build.
            </Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            testID="mark-all-read"
            style={styles.actionButton}
            onPress={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCircle2 size={16} color={unreadCount > 0 ? colors.primary : colors.textLight} />
            <Text style={[
              styles.actionButtonText,
              { color: unreadCount > 0 ? colors.primary : colors.textLight }
            ]}>
              Mark All Read
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            testID="schedule-test"
            style={styles.actionButton}
            onPress={scheduleTestNotification}
          >
            <Bell size={16} color={colors.primary} />
            <Text style={styles.actionButtonText}>Test Notification</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.notificationsContainer}>
          {notifications.length === 0 ? (
            <View style={styles.emptyState}>
              <Bell size={48} color={colors.textLight} />
              <Text style={styles.emptyTitle}>No Notifications</Text>
              <Text style={styles.emptySubtitle}>
                You&apos;ll see booking confirmations, event reminders, and special offers here
              </Text>
            </View>
          ) : (
            notifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                testID={`notification-${notification.id}`}
                style={[
                  styles.notificationItem,
                  !notification.isRead && styles.unreadNotification
                ]}
                onPress={() => handleNotificationPress(notification)}
                activeOpacity={0.7}
              >
                <View style={styles.notificationContent}>
                  <View style={[styles.iconContainer, { backgroundColor: notification.color + '20' }]}>
                    {notification.icon}
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={[
                      styles.notificationTitle,
                      !notification.isRead && styles.unreadText
                    ]}>
                      {notification.title}
                    </Text>
                    <Text style={styles.notificationMessage}>
                      {notification.message}
                    </Text>
                    <Text style={styles.notificationTime}>
                      {notification.timestamp}
                    </Text>
                  </View>
                  <TouchableOpacity
                    testID={`clear-${notification.id}`}
                    style={styles.closeButton}
                    onPress={() => clearNotification(notification.id)}
                  >
                    <X size={16} color={colors.textLight} />
                  </TouchableOpacity>
                </View>
                {!notification.isRead && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.demoContainer}>
          <Text style={styles.demoTitle}>🧪 Demo Notification Types</Text>
          <View style={styles.demoButtons}>
            <TouchableOpacity
              testID="demo-booking-reminder"
              style={styles.demoButton}
              onPress={() => scheduleBookingReminder('Coastal Breeze', '19:00')}
            >
              <Calendar size={16} color={colors.white} />
              <Text style={styles.demoButtonText}>Booking Reminder</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              testID="demo-promo-alert"
              style={[styles.demoButton, { backgroundColor: colors.warning }]}
              onPress={() => schedulePromoAlert('Neon Lounge', 25)}
            >
              <Gift size={16} color={colors.white} />
              <Text style={styles.demoButtonText}>Promo Alert</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.implementationContainer}>
          <Text style={styles.implementationTitle}>📱 Notification Features</Text>
          <Text style={styles.implementationText}>
            ✅ In-app notifications list
            {'\n'}
            ✅ Unread count & management
            {'\n'}
            🔄 Server push requires a dev build (outside Expo Go)
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 12,
  },
  badge: {
    backgroundColor: colors.error,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  settingsButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.backgroundLight,
  },
  permissionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '10',
    borderColor: colors.warning + '30',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  permissionText: {
    flex: 1,
    marginLeft: 12,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  permissionSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
    marginLeft: 6,
  },
  notificationsContainer: {
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
  notificationItem: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
    position: 'relative',
  },
  unreadNotification: {
    borderColor: colors.primary + '30',
    backgroundColor: colors.primary + '05',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  unreadText: {
    color: colors.primary,
  },
  notificationMessage: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: colors.textExtraLight,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
  unreadDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  demoContainer: {
    margin: 20,
    padding: 16,
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  demoButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  demoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  demoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
    marginLeft: 6,
  },
  implementationContainer: {
    margin: 20,
    padding: 16,
    backgroundColor: colors.accent,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  implementationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  implementationText: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 22,
  },
});