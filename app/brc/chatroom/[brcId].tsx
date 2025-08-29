import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Send, LogOut, Users, MessageCircle } from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import { brcs } from '@/mocks/brcs';
import { useBRCChat } from '@/store/useBRCChatStore';
import { BRCChatMessage } from '@/types';

export default function BRCChatroomScreen() {
  const { brcId } = useLocalSearchParams<{ brcId: string }>();
  const router = useRouter();
  const { currentSession, sendMessage, leaveRoom, getCurrentChatroom } = useBRCChat();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<BRCChatMessage[]>([]);
  const flatListRef = useRef<FlatList>(null);
  
  const brc = brcs.find((b) => b.id === brcId);
  const chatroom = getCurrentChatroom();

  useEffect(() => {
    if (!currentSession || currentSession.brcId !== brcId) {
      Alert.alert(
        'Access Denied',
        'You need an active session to access this chatroom.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
      return;
    }

    if (chatroom) {
      setMessages(chatroom.messages);
    }
  }, [currentSession, brcId, chatroom, router]);

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  if (!brc || !currentSession || currentSession.brcId !== brcId) {
    return (
      <View style={styles.errorContainer}>
        <Stack.Screen
          options={{
            title: 'Chatroom',
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
          }}
        />
        <View style={styles.errorContent}>
          <MessageCircle size={64} color={colors.textExtraLight} />
          <Text style={styles.errorTitle}>Access Required</Text>
          <Text style={styles.errorText}>
            You need to place an order to access this chatroom.
          </Text>
        </View>
      </View>
    );
  }

  const handleSend = async () => {
    if (message.trim() === '') return;
    
    try {
      await sendMessage(brcId!, message);
      setMessage('');
      
      if (chatroom) {
        setMessages([...chatroom.messages]);
      }
    } catch {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const handleLeaveRoom = () => {
    Alert.alert(
      'Leave Chatroom',
      'Are you sure you want to leave? You\'ll need to place a new order to rejoin.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Leave', 
          style: 'destructive',
          onPress: async () => {
            await leaveRoom();
            router.back();
          }
        }
      ]
    );
  };

  const renderMessage = ({ item }: { item: BRCChatMessage }) => {
    const isCurrentUser = item.sessionId === currentSession.id;
    
    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
        ]}
      >
        {!isCurrentUser && (
          <View style={styles.messageHeader}>
            {item.avatar ? (
              <Image
                source={{ uri: item.avatar }}
                style={styles.messageAvatar}
                contentFit="cover"
              />
            ) : (
              <View style={styles.anonymousAvatar}>
                <Text style={styles.anonymousAvatarText}>
                  {item.displayName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <Text style={styles.displayName}>
              {item.displayName}
              {item.isAnonymous && <Text style={styles.anonymousLabel}> (Anonymous)</Text>}
            </Text>
          </View>
        )}
        
        <Text
          style={[
            styles.messageText,
            isCurrentUser ? styles.currentUserText : styles.otherUserText,
          ]}
        >
          {item.text}
        </Text>
        
        <Text
          style={[
            styles.timestamp,
            isCurrentUser ? styles.currentUserTimestamp : styles.otherUserTimestamp,
          ]}
        >
          {formatTime(item.timestamp)}
        </Text>
      </View>
    );
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const activeSessions = chatroom?.activeSessions || [];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Stack.Screen
        options={{
          title: `${brc.name} Chat`,
          headerRight: () => (
            <View style={styles.headerActions}>
              <View style={styles.activeUsersContainer}>
                <Users size={16} color={colors.primary} />
                <Text style={styles.activeUsersText}>{activeSessions.length}</Text>
              </View>
              <TouchableOpacity style={styles.leaveButton} onPress={handleLeaveRoom}>
                <LogOut size={20} color={colors.error} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      
      <View style={styles.sessionInfo}>
        <Text style={styles.sessionText}>
          Joined as: <Text style={styles.displayNameText}>{currentSession.displayName}</Text>
          {currentSession.isAnonymous && <Text style={styles.anonymousLabel}> (Anonymous)</Text>}
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <MessageCircle size={48} color={colors.textExtraLight} />
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptyText}>
              Be the first to start a conversation!
            </Text>
          </View>
        )}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={colors.textExtraLight}
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={500}
        />
        
        <TouchableOpacity
          style={[
            styles.sendButton,
            message.trim() === '' && styles.disabledSendButton,
          ]}
          onPress={handleSend}
          disabled={message.trim() === ''}
        >
          <Send size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  activeUsersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  activeUsersText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 4,
  },
  leaveButton: {
    padding: 4,
  },
  sessionInfo: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundLight,
  },
  sessionText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
  displayNameText: {
    fontWeight: '600',
    color: colors.text,
  },
  anonymousLabel: {
    fontSize: 12,
    color: colors.textLight,
    fontStyle: 'italic',
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 20,
    flexGrow: 1,
  },
  messageContainer: {
    maxWidth: '85%',
    marginBottom: 16,
    borderRadius: 16,
    padding: 12,
    ...shadows.small,
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  otherUserMessage: {
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    borderBottomLeftRadius: 4,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  messageAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  anonymousAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  anonymousAvatarText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  displayName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textLight,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  currentUserText: {
    color: colors.white,
  },
  otherUserText: {
    color: colors.text,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  currentUserTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherUserTimestamp: {
    color: colors.textLight,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.backgroundLight,
  },
  input: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
    fontSize: 16,
    color: colors.text,
    marginRight: 12,
  },
  sendButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledSendButton: {
    backgroundColor: colors.backgroundDark,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  errorContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
  },
});