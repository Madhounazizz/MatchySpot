import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, Stack } from 'expo-router';
import { Settings, Heart, Wallet, Star, Calendar, LogOut, ChevronRight, Users, Edit, ChefHat, Globe } from 'lucide-react-native';
import { colors, shadows, typography, borderRadius, spacing } from '@/constants/colors';
import Button from '@/components/Button';
import { useUserStore } from '@/store/useUserStore';
import { useTranslation } from '@/store/useLanguageStore';
import { brcs } from '@/mocks/brcs';
import { walletSummary } from '@/mocks/wallet';
import LanguageSelector from '@/components/LanguageSelector';

export default function ProfileScreen() {
  const router = useRouter();
  const { currentUser, favorites, logout } = useUserStore();
  const { t } = useTranslation();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  
  const handleLogout = () => {
    Alert.alert(
      t('logout'),
      'Are you sure you want to log out?',
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('logout'),
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };
  
  if (!currentUser) {
    return (
      <View style={styles.container}>
        <View style={styles.loginPrompt}>
          <Text style={styles.loginPromptTitle}>Please log in</Text>
          <Button
            title="Go to Login"
            onPress={() => router.push('/auth/login')}
            style={styles.loginButton}
          />
        </View>
      </View>
    );
  }

  const favoriteBRCs = brcs.filter(brc => favorites.includes(brc.id));

  const navigateToWallet = () => {
    router.push('/wallet');
  };

  const navigateToReviews = () => {
    router.push('/reviews');
  };

  const navigateToEvents = () => {
    router.push('/(tabs)/discover');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
      />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Enhanced Header with Gradient */}
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>{t('profile')}</Text>
            <TouchableOpacity style={styles.settingsButton} hitSlop={10}>
              <Settings size={24} color={colors.textInverse} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: currentUser.avatar }}
                style={styles.avatar}
                contentFit="cover"
                transition={200}
              />
              <TouchableOpacity style={styles.editAvatarButton}>
                <Edit size={16} color={colors.textInverse} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{currentUser.name}</Text>
              <Text style={styles.bio}>{currentUser.bio}</Text>
            </View>
          </View>
        </LinearGradient>
      
        {/* Enhanced Stats Container */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Heart size={20} color={colors.primary} />
            </View>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Matches</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Users size={20} color={colors.secondary} />
            </View>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Meetups</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Star size={20} color={colors.warning} />
            </View>
            <Text style={styles.statValue}>{favorites.length}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
        </View>
        
        <View style={styles.interestsContainer}>
          <Text style={styles.sectionTitle}>My Interests</Text>
          <View style={styles.interestTags}>
            {currentUser.interests.map((interest, index) => (
              <View key={index} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Enhanced Wallet Card with Gradient */}
        <View style={styles.walletCard}>
          <LinearGradient
            colors={[colors.secondary, colors.secondaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.walletGradient}
          >
            <View style={styles.walletHeader}>
              <Text style={styles.walletTitle}>Matchy Points</Text>
              <Wallet size={24} color={colors.textInverse} />
            </View>
            
            <Text style={styles.pointsValue}>{walletSummary.balance}</Text>
            <Text style={styles.pointsLabel}>Available Points</Text>
            
            <Button
              title="View Wallet"
              variant="ghost"
              onPress={navigateToWallet}
              style={styles.walletButton}
            />
          </LinearGradient>
        </View>
        
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={navigateToWallet}>
            <View style={styles.menuIconContainer}>
              <Wallet size={20} color={colors.white} />
            </View>
            <Text style={styles.menuText}>{t('myWallet')}</Text>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={navigateToReviews}>
            <View style={[styles.menuIconContainer, { backgroundColor: colors.info }]}>
              <Star size={20} color={colors.white} />
            </View>
            <Text style={styles.menuText}>{t('myReviews')}</Text>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={navigateToEvents}>
            <View style={[styles.menuIconContainer, { backgroundColor: colors.warning }]}>
              <Calendar size={20} color={colors.white} />
            </View>
            <Text style={styles.menuText}>{t('myEvents')}</Text>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => {
            router.push('/invite');
          }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <View style={[styles.menuIconContainer, { backgroundColor: colors.secondary }]}>
              <Users size={20} color={colors.white} />
            </View>
            <Text style={styles.menuText}>{t('inviteFriends')}</Text>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => setShowLanguageSelector(true)}>
            <View style={[styles.menuIconContainer, { backgroundColor: colors.accent }]}>
              <Globe size={20} color={colors.primaryDark} />
            </View>
            <Text style={styles.menuText}>{t('language')}</Text>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(restaurant)/reservations')}>
            <View style={[styles.menuIconContainer, { backgroundColor: colors.success }]}>
              <ChefHat size={20} color={colors.white} />
            </View>
            <Text style={styles.menuText}>{t('restaurantDashboard')}</Text>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <View style={[styles.menuIconContainer, { backgroundColor: colors.error }]}>
              <LogOut size={20} color={colors.white} />
            </View>
            <Text style={styles.menuText}>{t('logout')}</Text>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>
        
        {favoriteBRCs.length > 0 && (
          <View style={styles.favoritesContainer}>
            <Text style={styles.sectionTitle}>Favorite Places</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.favoritesScroll}
            >
              {favoriteBRCs.map((brc) => (
                <TouchableOpacity 
                  key={brc.id} 
                  style={styles.favoriteItem}
                  onPress={() => router.push(`/brc/${brc.id}`)}
                >
                  <Image
                    source={{ uri: brc.image }}
                    style={styles.favoriteImage}
                    contentFit="cover"
                    transition={200}
                  />
                  <View style={styles.favoriteOverlay}>
                    <Heart size={16} color={colors.primary} fill={colors.primary} />
                  </View>
                  <Text style={styles.favoriteName} numberOfLines={1}>{brc.name}</Text>
                  <Text style={styles.favoriteType}>{brc.type}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
      
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
    backgroundColor: colors.backgroundSecondary,
  },
  
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    paddingBottom: 100,
  },
  
  headerGradient: {
    paddingTop: 60,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.md,
    borderBottomLeftRadius: borderRadius['3xl'],
    borderBottomRightRadius: borderRadius['3xl'],
  },
  
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  
  headerTitle: {
    fontSize: typography.sizes['4xl'],
    fontWeight: typography.weights.extrabold,
    color: colors.textInverse,
  },
  
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: colors.textInverse,
  },
  
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.secondary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.textInverse,
    ...shadows.medium,
  },
  
  nameContainer: {
    flex: 1,
  },
  
  name: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.textInverse,
    marginBottom: spacing.xs,
  },
  
  bio: {
    fontSize: typography.sizes.base,
    color: colors.textInverse,
    opacity: 0.9,
  },
  
  settingsButton: {
    padding: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: borderRadius.full,
  },
  
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius['2xl'],
    marginHorizontal: spacing.md,
    marginTop: -spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    ...shadows.large,
  },
  
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  
  statValue: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.extrabold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  
  statLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textLight,
    fontWeight: typography.weights.medium,
  },
  
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: colors.borderLight,
    alignSelf: 'center',
  },
  
  interestsContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius['2xl'],
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    ...shadows.medium,
  },
  
  sectionTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  
  interestTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  
  interestTag: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  
  interestText: {
    fontSize: typography.sizes.sm,
    color: colors.primaryDark,
    fontWeight: typography.weights.medium,
  },
  
  walletCard: {
    borderRadius: borderRadius['2xl'],
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    ...shadows.large,
  },
  
  walletGradient: {
    padding: spacing.lg,
  },
  
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  
  walletTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textInverse,
  },
  
  pointsValue: {
    fontSize: typography.sizes['4xl'],
    fontWeight: typography.weights.extrabold,
    color: colors.textInverse,
    marginBottom: spacing.xs,
  },
  
  pointsLabel: {
    fontSize: typography.sizes.base,
    color: colors.textInverse,
    opacity: 0.9,
    marginBottom: spacing.lg,
  },
  
  walletButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: colors.textInverse,
  },
  
  menuContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius['2xl'],
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    ...shadows.medium,
  },
  
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    ...shadows.small,
  },
  
  menuText: {
    flex: 1,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.text,
  },
  
  favoritesContainer: {
    marginHorizontal: spacing.md,
    marginBottom: spacing['2xl'],
  },
  
  favoritesScroll: {
    paddingRight: spacing.md,
  },
  
  favoriteItem: {
    width: 120,
    marginRight: spacing.sm,
  },
  
  favoriteImage: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  
  favoriteOverlay: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
    ...shadows.small,
  },
  
  favoriteName: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  
  favoriteType: {
    fontSize: typography.sizes.xs,
    color: colors.textLight,
    textTransform: 'capitalize',
  },
  
  loginPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  
  loginPromptTitle: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  
  loginButton: {
    width: 200,
  },
});