import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Switch, Alert, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Bell, 
  Lock, 
  Globe, 
  Moon, 
  HelpCircle, 
  FileText, 
  Shield,
  ChevronRight,
  Trash2,
  Settings as SettingsIcon,
  User,
  CreditCard
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, shadows } from '@/constants/colors';
import { useTranslation } from '@/store/useLanguageStore';
import LanguageSelector from '@/components/LanguageSelector';

export default function SettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [scrollY] = useState(new Animated.Value(0));

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const headerScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.95],
    extrapolate: 'clamp',
  });

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            console.log('Account deleted');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <Animated.View style={{ opacity: headerOpacity, transform: [{ scale: headerScale }] }}>
        <LinearGradient
          colors={['#4facfe', '#00f2fe', '#43e97b']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.headerGradient, { paddingTop: insets.top + 16 }]}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ArrowLeft size={24} color={colors.white} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.headerContent}>
            <View style={styles.iconBadgeContainer}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.iconBadge}
              >
                <SettingsIcon size={28} color={colors.white} strokeWidth={2.5} />
              </LinearGradient>
              <View style={styles.iconGlow} />
            </View>
            <Text style={styles.headerTitle}>Settings</Text>
            <Text style={styles.headerSubtitle}>
              ⚙️ Customize your experience
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PREFERENCES</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <LinearGradient
                colors={['#FF6B6B', '#FF8E53']}
                style={styles.iconContainer}
              >
                <Bell size={20} color={colors.white} strokeWidth={2.5} />
              </LinearGradient>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Notifications</Text>
                <Text style={styles.settingSubtitle}>Receive push notifications</Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E5E7EB', true: '#FF6B6B' }}
              thumbColor={colors.white}
              ios_backgroundColor="#E5E7EB"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.iconContainer}
              >
                <Moon size={20} color={colors.white} strokeWidth={2.5} />
              </LinearGradient>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Dark Mode</Text>
                <Text style={styles.settingSubtitle}>Enable dark theme</Text>
              </View>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: '#E5E7EB', true: '#667eea' }}
              thumbColor={colors.white}
              ios_backgroundColor="#E5E7EB"
            />
          </View>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setShowLanguageSelector(true)}
          >
            <View style={styles.settingLeft}>
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                style={styles.iconContainer}
              >
                <Globe size={20} color={colors.white} strokeWidth={2.5} />
              </LinearGradient>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>{t('language')}</Text>
                <Text style={styles.settingSubtitle}>Change app language</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textLight} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <LinearGradient
                colors={['#f093fb', '#f5576c']}
                style={styles.iconContainer}
              >
                <User size={20} color={colors.white} strokeWidth={2.5} />
              </LinearGradient>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Edit Profile</Text>
                <Text style={styles.settingSubtitle}>Update your information</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textLight} strokeWidth={2.5} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <LinearGradient
                colors={['#FFD93D', '#FFA94D']}
                style={styles.iconContainer}
              >
                <CreditCard size={20} color={colors.white} strokeWidth={2.5} />
              </LinearGradient>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Payment Methods</Text>
                <Text style={styles.settingSubtitle}>Manage your cards</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textLight} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PRIVACY & SECURITY</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.iconContainer}
              >
                <Lock size={20} color={colors.white} strokeWidth={2.5} />
              </LinearGradient>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Change Password</Text>
                <Text style={styles.settingSubtitle}>Update your password</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textLight} strokeWidth={2.5} />
          </TouchableOpacity>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <LinearGradient
                colors={['#43e97b', '#38f9d7']}
                style={styles.iconContainer}
              >
                <Shield size={20} color={colors.white} strokeWidth={2.5} />
              </LinearGradient>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Location Services</Text>
                <Text style={styles.settingSubtitle}>Allow location access</Text>
              </View>
            </View>
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: '#E5E7EB', true: '#43e97b' }}
              thumbColor={colors.white}
              ios_backgroundColor="#E5E7EB"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ABOUT</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                style={styles.iconContainer}
              >
                <HelpCircle size={20} color={colors.white} strokeWidth={2.5} />
              </LinearGradient>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Help & Support</Text>
                <Text style={styles.settingSubtitle}>Get help with the app</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textLight} strokeWidth={2.5} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <LinearGradient
                colors={['#a8edea', '#fed6e3']}
                style={styles.iconContainer}
              >
                <FileText size={20} color={colors.text} strokeWidth={2.5} />
              </LinearGradient>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Terms & Conditions</Text>
                <Text style={styles.settingSubtitle}>Read our terms</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textLight} strokeWidth={2.5} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <LinearGradient
                colors={['#ffecd2', '#fcb69f']}
                style={styles.iconContainer}
              >
                <Shield size={20} color={colors.text} strokeWidth={2.5} />
              </LinearGradient>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Privacy Policy</Text>
                <Text style={styles.settingSubtitle}>Read our privacy policy</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textLight} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DANGER ZONE</Text>
          
          <TouchableOpacity 
            style={[styles.settingItem, styles.dangerItem]}
            onPress={handleDeleteAccount}
          >
            <View style={styles.settingLeft}>
              <LinearGradient
                colors={['#ff6b6b', '#ee5a6f']}
                style={styles.iconContainer}
              >
                <Trash2 size={20} color={colors.white} strokeWidth={2.5} />
              </LinearGradient>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: colors.error, fontWeight: '700' }]}>Delete Account</Text>
                <Text style={styles.settingSubtitle}>Permanently delete your account</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.error} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </Animated.ScrollView>

      <LanguageSelector
        visible={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FD',
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: {
    marginBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  },
  headerContent: {
    alignItems: 'center',
  },
  iconBadgeContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  iconBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.large,
  },
  iconGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#667eea',
    opacity: 0.3,
    transform: [{ scale: 1.3 }],
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.white,
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 20,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
    marginTop: -24,
  },
  contentContainer: {
    paddingTop: 24,
    paddingBottom: 100,
  },
  section: {
    backgroundColor: colors.white,
    marginBottom: 20,
    marginHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 8,
    ...shadows.medium,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textLight,
    letterSpacing: 1.2,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FD',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    ...shadows.small,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 18,
  },
  dangerItem: {
    borderBottomWidth: 0,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  versionText: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500',
  },
});
