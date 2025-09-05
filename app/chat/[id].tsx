import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Send, MapPin, Image as ImageIcon } from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import { conversations, chatMessages } from '@/mocks/conversations';
import { brcs } from '@/mocks/brcs';
import { useUserStore } from '@/store/useUserStore';

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { currentUser } = useUserStore();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(chatMessages[id as string] || []);
  const flatListRef = useRef<FlatList>(null);
  
  const conversation = conversations.find((c) => c.id === id);
  const otherUser = conversation?.participants.find(
    (user) => user.id !== currentUser?.id
  );

  useEffect(() => {
    // Scroll to bottom when messages change
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);
  
  if (!conversation || !currentUser) {
    return (
      <View style={styles.errorContainer}>
        <Stack.Screen
          options={{
            title: 'Chat',
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
          }}
        />
        <View style={styles.errorContent}>
          <Text style={styles.errorTitle}>Conversation not found</Text>
          <Text style={styles.errorText}>
            This conversation may have been deleted or you don't have access to it.
          </Text>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleSend = () => {
    if (message.trim() === '') return;
    
    const newMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: otherUser?.id || '',
      text: message,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
  };

  const handleSuggestBRC = () => {
    // Randomly suggest a BRC
    const randomBRC = brcs[Math.floor(Math.random() * brcs.length)];
    
    const newMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: otherUser?.id || '',
      text: `Let's meet at ${randomBRC.name}!`,
      timestamp: new Date().toISOString(),
      isRead: false,
      brcSuggestion: {
        id: randomBRC.id,
        name: randomBRC.name,
        image: randomBRC.image,
      },
    };
    
    setMessages([...messages, newMessage]);
  };

  const renderMessage = ({ item }: { item: typeof messages[0] }) => {
    const isCurrentUser = item.senderId === currentUser.id;
    
    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
        ]}
      >
        {item.brcSuggestion ? (
          <TouchableOpacity
            style={styles.brcSuggestion}
            onPress={() => router.push(`/brc/${item.brcSuggestion?.id}`)}
          >
            <Image
              source={{ uri: item.brcSuggestion.image }}
              style={styles.brcImage}
              contentFit="cover"
            />
            <View style={styles.brcInfo}>
              <Text style={styles.brcName}>{item.brcSuggestion.name}</Text>
              <Text style={styles.messageText}>{item.text}</Text>
              <View style={styles.brcButton}>
                <Text style={styles.brcButtonText}>View Place</Text>
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <Text
            style={[
              styles.messageText,
              isCurrentUser ? styles.currentUserText : styles.otherUserText,
            ]}
          >
            {item.text}
          </Text>
        )}
        
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Stack.Screen
        options={{
          title: otherUser?.name || 'Chat',
          headerRight: () => (
            <Image
              source={{ uri: otherUser?.avatar }}
              style={styles.headerAvatar}
              contentFit="cover"
            />
          ),
        }}
      />
      
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      />
      
      <View style={styles.suggestionBar}>
        <TouchableOpacity style={styles.suggestionButton} onPress={handleSuggestBRC}>
          <MapPin size={20} color={colors.primary} />
          <Text style={styles.suggestionText}>Suggest Place</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <ImageIcon size={24} color={colors.primary} />
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={colors.textExtraLight}
          value={message}
          onChangeText={setMessage}
          multiline
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
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    maxWidth: '80%',
    marginBottom: 12,
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
  brcSuggestion: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    width: 250,
  },
  brcImage: {
    width: 80,
    height: 80,
  },
  brcInfo: {
    flex: 1,
    padding: 8,
  },
  brcName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  brcButton: {
    backgroundColor: colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  brcButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
  suggestionBar: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.backgroundLight,
  },
  suggestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
  },
  suggestionText: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.backgroundLight,
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 16,
    color: colors.text,
  },
  sendButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  disabledSendButton: {
    backgroundColor: colors.backgroundDark,
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
    marginBottom: 12,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    ...shadows.medium,
  },
  backButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});