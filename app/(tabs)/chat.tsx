import React from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import { conversations } from '@/mocks/conversations';
import ConversationItem from '@/components/ConversationItem';
import { colors } from '@/constants/colors';
import SearchBar from '@/components/SearchBar';

export default function ChatScreen() {
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No conversations yet</Text>
      <Text style={styles.emptyText}>
        Match with people and start chatting to plan your next meetup!
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <SearchBar placeholder="Search conversations..." />
      
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ConversationItem conversation={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
});