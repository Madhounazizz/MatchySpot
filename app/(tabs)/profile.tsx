import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useRouter, Stack } from 'expo-router';
import { Settings, Heart, Wallet, Star, Calendar, LogOut, ChevronRight, Users, Edit, ChefHat } from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import Button from '@/components/Button';
import { useUserStore } from '@/store/useUserStore';
import { brcs } from '@/mocks/brcs';
import { walletSummary } from '@/mocks/wallet';

export default function ProfileScreen() {
  const router = useRouter();
  const { currentUser, favorites, logout } = useUserStore();
  
  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
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
    router.push('/wallet/index');
  };

  const navigateToReviews = () => {
    router.push('/reviews/index');
  };

  const navigateToEvents = () => {
    router.push('/events/index');
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
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity style={styles.settingsButton} hitSlop={10}>
              <Settings size={24} color={colors.text} />
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
                <Edit size={16} color={colors.white} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{currentUser.name}</Text>
              <Text style={styles.bio}>{currentUser.bio}</Text>
            </View>
          </View>
        </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Matches</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>8</Text>
          <Text style={styles.statLabel}>Meetups</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
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
      
      <View style={styles.walletCard}>
        <View style={styles.walletHeader}>
          <Text style={styles.walletTitle}>Matchy Points</Text>
          <Wallet size={20} color={colors.primary} />
        </View>
        
        <Text style={styles.pointsValue}>{walletSummary.balance}</Text>
        <Text style={styles.pointsLabel}>Available Points</Text>
        
        <Button
          title="View Wallet"
          variant="outline"
          onPress={navigateToWallet}
          style={styles.walletButton}
        />
      </View>
      
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={navigateToWallet}>
          <View style={styles.menuIconContainer}>
            <Wallet size={20} color={colors.white} />
          </View>
          <Text style={styles.menuText}>My Wallet</Text>
          <ChevronRight size={20} color={colors.textLight} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={navigateToReviews}>
          <View style={[styles.menuIconContainer, { backgroundColor: colors.info }]}>
            <Star size={20} color={colors.white} />
          </View>
          <Text style={styles.menuText}>My Reviews</Text>
          <ChevronRight size={20} color={colors.textLight} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={navigateToEvents}>
          <View style={[styles.menuIconContainer, { backgroundColor: colors.warning }]}>
            <Calendar size={20} color={colors.white} />
          </View>
          <Text style={styles.menuText}>My Events</Text>
          <ChevronRight size={20} color={colors.textLight} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => {
          // Removed Alert for direct navigation
          router.push('/invite/index');
        }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <View style={[styles.menuIconContainer, { backgroundColor: colors.secondary }]}>
            <Users size={20} color={colors.white} />
          </View>
          <Text style={styles.menuText}>Invite Friends</Text>
          <ChevronRight size={20} color={colors.textLight} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(restaurant)/reservations')}>
          <View style={[styles.menuIconContainer, { backgroundColor: colors.success }]}>
            <ChefHat size={20} color={colors.white} />
          </View>
          <Text style={styles.menuText}>Restaurant Dashboard</Text>
          <ChevronRight size={20} color={colors.textLight} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <View style={[styles.menuIconContainer, { backgroundColor: colors.error }]}>
            <LogOut size={20} color={colors.white} />
          </View>
          <Text style={styles.menuText}>Log Out</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    backgroundColor: colors.white,
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundLight,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    color: colors.textLight,
  },
  settingsButton: {
    padding: 8,
    backgroundColor: colors.backgroundLight,
    borderRadius: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    padding: 16,
    ...shadows.small,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: colors.backgroundLight,
  },
  interestsContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    ...shadows.small,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  interestTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestTag: {
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    fontSize: 14,
    color: colors.primaryDark,
    fontWeight: '500',
  },
  walletCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    ...shadows.small,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  walletTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  pointsValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  pointsLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 16,
  },
  walletButton: {
    alignSelf: 'flex-start',
  },
  menuContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    ...shadows.small,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundLight,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  favoritesContainer: {
    marginHorizontal: 16,
    marginBottom: 30,
  },
  favoritesScroll: {
    paddingRight: 16,
  },
  favoriteItem: {
    width: 120,
    marginRight: 12,
  },
  favoriteImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
  },
  favoriteOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 6,
  },
  favoriteName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  favoriteType: {
    fontSize: 12,
    color: colors.textLight,
    textTransform: 'capitalize',
  },
  loginPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loginPromptTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  loginButton: {
    width: 200,
  },
});