import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  TextInput,
  Alert,
} from 'react-native';
import {
  User,
  Bell,
  Clock,
  DollarSign,
  Smartphone,
  Mail,
  MapPin,
  Phone,
  Globe,
  Camera,
  Save,
  LogOut,
  Shield,
  CreditCard,
  Settings as SettingsIcon,
  BarChart3,
  TrendingUp,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { colors, shadows } from '@/constants/colors';


type SettingsSection = {
  title: string;
  items: SettingItem[];
};

type SettingItem = {
  id: string;
  title: string;
  subtitle?: string;
  icon: any;
  type: 'toggle' | 'input' | 'action' | 'navigation';
  value?: any;
  onPress?: () => void;
  onValueChange?: (value: any) => void;
};

export default function RestaurantSettings() {
  const [restaurantName, setRestaurantName] = useState<string>('Bella Vista Restaurant');
  const [email, setEmail] = useState<string>('contact@bellavista.com');
  const [phone, setPhone] = useState<string>('+1 (555) 123-4567');
  const [address, setAddress] = useState<string>('123 Ocean Drive, Miami, FL 33139');
  const [website, setWebsite] = useState<string>('www.bellavista.com');
  const [notifications, setNotifications] = useState<boolean>(true);
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [smsNotifications, setSmsNotifications] = useState<boolean>(false);
  const [autoConfirm, setAutoConfirm] = useState<boolean>(false);

  const settingsSections: SettingsSection[] = [
    {
      title: 'Restaurant Profile',
      items: [
        {
          id: 'name',
          title: 'Restaurant Name',
          subtitle: restaurantName,
          icon: User,
          type: 'input',
          value: restaurantName,
          onValueChange: setRestaurantName,
        },
        {
          id: 'email',
          title: 'Email Address',
          subtitle: email,
          icon: Mail,
          type: 'input',
          value: email,
          onValueChange: setEmail,
        },
        {
          id: 'phone',
          title: 'Phone Number',
          subtitle: phone,
          icon: Phone,
          type: 'input',
          value: phone,
          onValueChange: setPhone,
        },
        {
          id: 'address',
          title: 'Address',
          subtitle: address,
          icon: MapPin,
          type: 'input',
          value: address,
          onValueChange: setAddress,
        },
        {
          id: 'website',
          title: 'Website',
          subtitle: website,
          icon: Globe,
          type: 'input',
          value: website,
          onValueChange: setWebsite,
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          id: 'push_notifications',
          title: 'Push Notifications',
          subtitle: 'Receive notifications for new reservations',
          icon: Bell,
          type: 'toggle',
          value: notifications,
          onValueChange: setNotifications,
        },
        {
          id: 'email_notifications',
          title: 'Email Notifications',
          subtitle: 'Get reservation updates via email',
          icon: Mail,
          type: 'toggle',
          value: emailNotifications,
          onValueChange: setEmailNotifications,
        },
        {
          id: 'sms_notifications',
          title: 'SMS Notifications',
          subtitle: 'Receive text messages for urgent updates',
          icon: Smartphone,
          type: 'toggle',
          value: smsNotifications,
          onValueChange: setSmsNotifications,
        },
      ],
    },
    {
      title: 'Reservation Settings',
      items: [
        {
          id: 'auto_confirm',
          title: 'Auto-confirm Reservations',
          subtitle: 'Automatically confirm new reservations',
          icon: Clock,
          type: 'toggle',
          value: autoConfirm,
          onValueChange: setAutoConfirm,
        },
        {
          id: 'operating_hours',
          title: 'Operating Hours',
          subtitle: 'Set your restaurant hours',
          icon: Clock,
          type: 'navigation',
          onPress: () => Alert.alert('Coming Soon', 'Operating hours management will be available soon.'),
        },
      ],
    },
    {
      title: 'Business',
      items: [
        {
          id: 'payment_settings',
          title: 'Payment Settings',
          subtitle: 'Manage payment methods and billing',
          icon: CreditCard,
          type: 'navigation',
          onPress: () => Alert.alert('Coming Soon', 'Payment settings will be available soon.'),
        },
        {
          id: 'analytics',
          title: 'Analytics & Reports',
          subtitle: 'View detailed business insights',
          icon: BarChart3,
          type: 'navigation',
          onPress: () => router.push('/(restaurant)/analytics'),
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          id: 'privacy',
          title: 'Privacy & Security',
          subtitle: 'Manage your account security',
          icon: Shield,
          type: 'navigation',
          onPress: () => Alert.alert('Coming Soon', 'Privacy settings will be available soon.'),
        },
        {
          id: 'logout',
          title: 'Sign Out',
          subtitle: 'Sign out of your account',
          icon: LogOut,
          type: 'action',
          onPress: () => {
            Alert.alert(
              'Sign Out',
              'Are you sure you want to sign out?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Sign Out', style: 'destructive', onPress: () => console.log('Signing out...') },
              ]
            );
          },
        },
      ],
    },
  ];

  const saveSettings = () => {
    Alert.alert('Settings Saved', 'Your restaurant settings have been updated successfully.');
  };

  const SettingItemComponent = ({ item }: { item: SettingItem }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [tempValue, setTempValue] = useState<string>(item.value || '');

    const handleSave = () => {
      if (item.onValueChange) {
        item.onValueChange(tempValue);
      }
      setIsEditing(false);
    };

    return (
      <View style={styles.settingItem}>
        <View style={styles.settingIcon}>
          <item.icon size={16} color={colors.primary} />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          {item.type === 'input' && isEditing ? (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.settingInput}
                value={tempValue}
                onChangeText={setTempValue}
                placeholder={item.title}
                placeholderTextColor={colors.textLight}
              />
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Save size={12} color={colors.white} />
              </TouchableOpacity>
            </View>
          ) : (
            item.subtitle && (
              <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
            )
          )}
        </View>
        <View style={styles.settingAction}>
          {item.type === 'toggle' && (
            <Switch
              value={item.value}
              onValueChange={item.onValueChange}
              trackColor={{ false: colors.border, true: colors.primary + '40' }}
              thumbColor={item.value ? colors.primary : colors.textLight}
            />
          )}
          {item.type === 'input' && !isEditing && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                setTempValue(item.value || '');
                setIsEditing(true);
              }}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
          {(item.type === 'navigation' || item.type === 'action') && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                item.type === 'action' && item.id === 'logout' && { backgroundColor: colors.error + '15' }
              ]}
              onPress={item.onPress}
            >
              <Text style={[
                styles.actionButtonText,
                item.type === 'action' && item.id === 'logout' && { color: colors.error }
              ]}>
                {item.id === 'analytics' ? 'View' : item.type === 'navigation' ? 'Configure' : 'Action'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <TouchableOpacity style={styles.saveAllButton} onPress={saveSettings}>
          <Save size={14} color={colors.white} />
          <Text style={styles.saveAllButtonText}>Save All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <View key={item.id}>
                  <SettingItemComponent item={item} />
                  {itemIndex < section.items.length - 1 && <View style={styles.separator} />}
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>MatchySpot Restaurant Management</Text>
          <Text style={styles.footerVersion}>Version 1.0.0</Text>
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
  saveAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  saveAllButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 12,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionContent: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    borderRadius: 16,
    ...shadows.small,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  settingIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 11,
    color: colors.textLight,
  },
  settingAction: {
    alignItems: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  settingInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 12,
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: 6,
    borderRadius: 4,
  },
  editButton: {
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  editButtonText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  actionButtonText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 56,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  footerVersion: {
    fontSize: 12,
    color: colors.textLight,
  },
});