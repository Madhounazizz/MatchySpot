import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Alert, Modal, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Send, LogOut, Users, MessageCircle, Menu, Plus, Minus, ShoppingCart, X, Star } from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import { brcs } from '@/mocks/brcs';
import { useBRCChat } from '@/store/useBRCChatStore';
import { BRCChatMessage } from '@/types';
import { menuItems, MenuItem } from '@/mocks/menu';

type OrderItem = {
  menuItem: MenuItem;
  quantity: number;
};

export default function BRCChatroomScreen() {
  const { brcId } = useLocalSearchParams<{ brcId: string }>();
  const router = useRouter();
  const { currentSession, sendMessage, leaveRoom, getCurrentChatroom } = useBRCChat();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<BRCChatMessage[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const flatListRef = useRef<FlatList>(null);
  
  const brc = brcs.find((b) => b.id === brcId);
  const chatroom = getCurrentChatroom();
  const brcMenu = menuItems.filter(item => item.brcId === brcId);
  const categories = ['all', ...Array.from(new Set(brcMenu.map(item => item.category)))];
  const filteredMenu = selectedCategory === 'all' ? brcMenu : brcMenu.filter(item => item.category === selectedCategory);
  const cartTotal = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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

  const addToCart = (menuItem: MenuItem) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.menuItem.id === menuItem.id);
      if (existingItem) {
        return prev.map(item => 
          item.menuItem.id === menuItem.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { menuItem, quantity: 1 }];
    });
  };

  const removeFromCart = (menuItemId: string) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.menuItem.id === menuItemId);
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(item => 
          item.menuItem.id === menuItemId 
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter(item => item.menuItem.id !== menuItemId);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = () => {
    if (cart.length === 0) return;
    
    const orderMessage = `🍽️ Order placed:\n${cart.map(item => 
      `${item.quantity}x ${item.menuItem.name} - ${(item.menuItem.price * item.quantity).toFixed(2)}`
    ).join('\n')}\n\nTotal: ${cartTotal.toFixed(2)}`;
    
    sendMessage(brcId!, orderMessage);
    clearCart();
    setShowMenu(false);
    
    Alert.alert(
      'Order Placed!',
      'Your order has been sent to the kitchen. You can track it in the chat.',
      [{ text: 'OK' }]
    );
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => {
    const cartItem = cart.find(cartItem => cartItem.menuItem.id === item.id);
    const quantity = cartItem?.quantity || 0;

    return (
      <View style={styles.menuItem}>
        <Image
          source={{ uri: item.image }}
          style={styles.menuItemImage}
          contentFit="cover"
        />
        <View style={styles.menuItemContent}>
          <View style={styles.menuItemHeader}>
            <Text style={styles.menuItemName}>{item.name}</Text>
            <View style={styles.ratingContainer}>
              <Star size={12} color={colors.warning} fill={colors.warning} />
              <Text style={styles.rating}>{item.rating}</Text>
            </View>
          </View>
          <Text style={styles.menuItemDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.menuItemFooter}>
            <Text style={styles.menuItemPrice}>${item.price}</Text>
            <View style={styles.quantityControls}>
              {quantity > 0 && (
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => removeFromCart(item.id)}
                >
                  <Minus size={16} color={colors.white} />
                </TouchableOpacity>
              )}
              {quantity > 0 && (
                <Text style={styles.quantityText}>{quantity}</Text>
              )}
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => addToCart(item)}
              >
                <Plus size={16} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderCategoryPill = (category: string) => {
    const isSelected = selectedCategory === category;
    return (
      <TouchableOpacity
        key={category}
        style={[
          styles.categoryPill,
          isSelected && styles.selectedCategoryPill
        ]}
        onPress={() => setSelectedCategory(category)}
      >
        <Text style={[
          styles.categoryPillText,
          isSelected && styles.selectedCategoryPillText
        ]}>
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Text>
      </TouchableOpacity>
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
              <TouchableOpacity 
                style={styles.menuButton} 
                onPress={() => setShowMenu(true)}
              >
                <Menu size={20} color={colors.primary} />
                {cartItemsCount > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{cartItemsCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
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

      <Modal
        visible={showMenu}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.menuModal}>
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle}>{brc.name} Menu</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowMenu(false)}
            >
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
            contentContainerStyle={styles.categoriesContent}
          >
            {categories.map(renderCategoryPill)}
          </ScrollView>

          <FlatList
            data={filteredMenu}
            keyExtractor={(item) => item.id}
            renderItem={renderMenuItem}
            contentContainerStyle={styles.menuList}
            showsVerticalScrollIndicator={false}
          />

          {cart.length > 0 && (
            <View style={styles.cartSummary}>
              <View style={styles.cartInfo}>
                <Text style={styles.cartTotal}>${cartTotal.toFixed(2)}</Text>
                <Text style={styles.cartItems}>{cartItemsCount} items</Text>
              </View>
              <View style={styles.cartActions}>
                <TouchableOpacity
                  style={styles.clearCartButton}
                  onPress={clearCart}
                >
                  <Text style={styles.clearCartText}>Clear</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.orderButton}
                  onPress={placeOrder}
                >
                  <ShoppingCart size={20} color={colors.white} />
                  <Text style={styles.orderButtonText}>Order Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    gap: 12,
  },
  menuButton: {
    position: 'relative',
    padding: 4,
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  activeUsersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    ...shadows.small,
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
    borderRadius: 24,
    padding: 16,
    ...shadows.medium,
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: 8,
  },
  otherUserMessage: {
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    borderBottomLeftRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  messageAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  anonymousAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
    borderTopColor: '#e9ecef',
    ...shadows.small,
  },
  input: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
    fontSize: 16,
    color: colors.text,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    ...shadows.small,
  },
  sendButton: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
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
  menuModal: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    ...shadows.medium,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  categoriesContainer: {
    maxHeight: 60,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  categoryPill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    ...shadows.small,
  },
  selectedCategoryPill: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...shadows.medium,
  },
  categoryPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  selectedCategoryPillText: {
    color: colors.white,
  },
  menuList: {
    padding: 20,
    paddingBottom: 100,
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 20,
    marginBottom: 16,
    ...shadows.medium,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.03)',
  },
  menuItemImage: {
    width: 110,
    height: 110,
  },
  menuItemContent: {
    flex: 1,
    padding: 16,
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  menuItemDescription: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
    marginBottom: 12,
  },
  menuItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    minWidth: 20,
    textAlign: 'center',
  },
  cartSummary: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    ...shadows.large,
  },
  cartInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cartTotal: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  cartItems: {
    fontSize: 14,
    color: colors.textLight,
  },
  cartActions: {
    flexDirection: 'row',
    gap: 12,
  },
  clearCartButton: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    ...shadows.small,
  },
  clearCartText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  orderButton: {
    flex: 2,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...shadows.large,
  },
  orderButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});