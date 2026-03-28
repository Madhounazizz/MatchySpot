import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { User } from '@/types';
import { colors, shadows } from '@/constants/colors';

type UserCardProps = {
  user: User;
  onPress?: () => void;
  showMatchPercentage?: boolean;
};

export default function UserCard({ user, onPress, showMatchPercentage = true }: UserCardProps) {
  return (
    <TouchableOpacity 
      style={[styles.container, shadows.small]} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: user.avatar }}
          style={styles.avatar}
          contentFit="cover"
          transition={200}
        />
        {user.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{user.name}</Text>
        
        {user.lastActive && (
          <Text style={styles.lastActive}>Active {user.lastActive}</Text>
        )}
        
        {user.interests && (
          <View style={styles.interestsContainer}>
            {user.interests.slice(0, 2).map((interest, index) => (
              <View key={index} style={styles.interestTag}>
                <Text style={styles.interestText} numberOfLines={1}>{interest}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      
      {showMatchPercentage && user.matchPercentage && (
        <View style={styles.matchContainer}>
          <Text style={styles.matchText}>{user.matchPercentage}%</Text>
          <Text style={styles.matchLabel}>match</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.white,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  lastActive: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 6,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestTag: {
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 6,
    marginBottom: 4,
  },
  interestText: {
    fontSize: 11,
    color: colors.textLight,
  },
  matchContainer: {
    alignItems: 'center',
    marginLeft: 8,
  },
  matchText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  matchLabel: {
    fontSize: 11,
    color: colors.textLight,
  },
});