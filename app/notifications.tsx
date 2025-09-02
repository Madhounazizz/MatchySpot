import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
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

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

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
  const [permissionStatus, setPermissionStatus] = useState<string>('unknown');

  useEffect(() => {
    const initNotifications = async () => {
      await checkNotificationPermissions();
      setupNotificationListeners();
    };
    initNotifications();
  }, []);

  const checkNotificationPermissions = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      setPermissionStatus(status);
      
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        setPermissionStatus(newStatus);
      }
    } catch (error) {
      console.error('Error checking notification permissions:', error);
    }
  };

  const setupNotificationListeners = () => {
    // Listen for notifications received while app is running
    const notificationListener = Notifications.addNotificationReceivedListener((notification: any) => {
      console.log('Notification received:', notification);
      // Add to notifications list
      const newNotification: NotificationItem = {
        id: Date.now().toString(),
        type: 'booking',
        title: notification.request.content.title || 'New Notification',
        message: notification.request.content.body || '',
        timestamp: 'Just now',
        isRead: false,
        data: notification.request.content.data,
        icon: <Bell size={20} color={colors.primary} />,
        color: colors.primary
      };
      setNotifications(prev => [newNotification, ...prev]);
    });

    // Listen for notification taps
    const responseListener = Notifications.addNotificationResponseReceivedListener((response: any) => {
      console.log('Notification tapped:', response);
      handleNotificationPress(response.notification.request.content.data);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  };

  const scheduleTestNotification = async () => {
    if (permissionStatus !== 'granted') {
      Alert.alert('Permission Required', 'Please enable notifications to receive updates.');
      return;
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Test Notification 🧪',
          body: 'This is a test notification from your BRC app!',
          data: { type: 'test' },
        },
        trigger: null,
      });
      
      Alert.alert('Success', 'Test notification scheduled for 2 seconds from now!');
    } catch (error) {
      console.error('Error scheduling notification:', error);
      Alert.alert('Error', 'Failed to schedule notification');
    }
  };

  const scheduleBookingReminder = async (brcName: string, time: string) => {
    if (permissionStatus !== 'granted') return;

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Booking Reminder 📅',
          body: `Your reservation at ${brcName} is in 1 hour (${time})`,
          data: { type: 'booking_reminder', brcName, time },
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Error scheduling booking reminder:', error);
    }
  };

  const schedulePromoAlert = async (brcName: string, discount: number) => {
    if (permissionStatus !== 'granted') return;

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Special Offer! 🔥',
          body: `${discount}% off at ${brcName}! Limited time only.`,
          data: { type: 'promo', brcName, discount },
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Error scheduling promo alert:', error);
    }
  };

  const handleNotificationPress = (notification: NotificationItem) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
    );

    // Handle different notification types
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
        {/* Header */}
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

        {/* Permission Status */}
        {permissionStatus !== 'granted' && (
          <View style={styles.permissionCard}>
            <Bell size={24} color={colors.warning} />
            <View style={styles.permissionText}>
              <Text style={styles.permissionTitle}>Enable Notifications</Text>
              <Text style={styles.permissionSubtitle}>
                Get notified about bookings, events, and special offers
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.enableButton}
              onPress={checkNotificationPermissions}
            >
              <Text style={styles.enableButtonText}>Enable</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
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
            style={styles.actionButton}
            onPress={scheduleTestNotification}
          >
            <Bell size={16} color={colors.primary} />
            <Text style={styles.actionButtonText}>Test Notification</Text>
          </TouchableOpacity>
        </View>

        {/* Notifications List */}
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

        {/* Demo Actions */}
        <View style={styles.demoContainer}>
          <Text style={styles.demoTitle}>🧪 Demo Notification Types</Text>
          <View style={styles.demoButtons}>
            <TouchableOpacity
              style={styles.demoButton}
              onPress={() => scheduleBookingReminder('Coastal Breeze', '19:00')}
            >
              <Calendar size={16} color={colors.white} />
              <Text style={styles.demoButtonText}>Booking Reminder</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.demoButton, { backgroundColor: colors.warning }]}
              onPress={() => schedulePromoAlert('Neon Lounge', 25)}
            >
              <Gift size={16} color={colors.white} />
              <Text style={styles.demoButtonText}>Promo Alert</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Implementation Notes */}
        <View style={styles.implementationContainer}>
          <Text style={styles.implementationTitle}>📱 Notification Features</Text>
          <Text style={styles.implementationText}>
            ✅ Push notification permissions{'\n'}
            ✅ Local notification scheduling{'\n'}
            ✅ Notification handling & routing{'\n'}
            ✅ Unread count & management{'\n'}
            🔄 Server-side push notifications{'\n'}
            🔄 Notification preferences{'\n'}
            🔄 Rich notifications with images{'\n'}
            🔄 Notification categories & actions
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
  enableButton: {
    backgroundColor: colors.warning,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  enableButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
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