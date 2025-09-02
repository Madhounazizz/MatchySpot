import React, { useState } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { MessageSquare, Users } from 'lucide-react-native';
import { conversations } from '@/mocks/conversations';
import ConversationItem from '@/components/ConversationItem';
import { colors, shadows, typography, borderRadius, spacing } from '@/constants/colors';
import SearchBar from '@/components/SearchBar';

export default function ChatScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredConversations = conversations.filter(conversation =>
    conversation.participants[1].name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <MessageSquare size={80} color={colors.primary} />
      </View>
      <Text style={styles.emptyTitle}>No conversations yet</Text>
      <Text style={styles.emptyText}>
        Match with people and start chatting to plan your next meetup!
      </Text>
      <TouchableOpacity style={styles.exploreButton}>
        <Users size={20} color={colors.textInverse} />
        <Text style={styles.exploreButtonText}>Find People</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={styles.conversationBadge}>
          <Text style={styles.conversationCount}>
            {conversations.length}
          </Text>
        </View>
      </View>
      <Text style={styles.headerSubtitle}>
        Stay connected with your matches
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
      />
      
      {renderHeader()}
      
      <View style={styles.searchContainer}>
        <SearchBar 
          placeholder="Search conversations..." 
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ConversationItem conversation={item} />}
        contentContainerStyle={[
          styles.listContent,
          filteredConversations.length === 0 && styles.emptyListContent
        ]}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  
  headerContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: 60,
    paddingBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomLeftRadius: borderRadius['2xl'],
    borderBottomRightRadius: borderRadius['2xl'],
    ...shadows.medium,
  },
  
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  
  headerTitle: {
    fontSize: typography.sizes['4xl'],
    fontWeight: typography.weights.extrabold,
    color: colors.text,
  },
  
  conversationBadge: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    minWidth: 32,
    alignItems: 'center',
  },
  
  conversationCount: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textInverse,
  },
  
  headerSubtitle: {
    fontSize: typography.sizes.base,
    color: colors.textLight,
  },
  
  searchContainer: {
    backgroundColor: colors.surface,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
    marginTop: -spacing.sm,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  listContent: {
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  
  emptyListContent: {
    flexGrow: 1,
  },
  
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  
  emptyIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    ...shadows.large,
  },
  
  emptyTitle: {
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.extrabold,
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  
  emptyText: {
    fontSize: typography.sizes.lg,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: typography.sizes.lg * typography.lineHeights.relaxed,
    marginBottom: spacing['2xl'],
    paddingHorizontal: spacing.md,
  },
  
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    ...shadows.primary,
  },
  
  exploreButtonText: {
    color: colors.textInverse,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    marginLeft: spacing.sm,
  },
});