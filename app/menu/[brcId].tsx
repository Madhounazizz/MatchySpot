import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Plus, Minus, ShoppingCart, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useBRCChatStore } from '@/store/useBRCChatStore';
import { menuItems } from '@/mocks/menu';
import { brcs } from '@/mocks/brcs';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function MenuScreen() {
  const { brcId } = useLocalSearchParams<{ brcId: string }>();
  const router = useRouter();
  const { createSession } = useBRCChatStore();
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  
  const brc = brcs.find(b => b.id === brcId);
  const categories = ['All', 'Appetizer', 'Main', 'Dessert', 'Drink'];
  
  const brcMenuItems = menuItems.filter(item => item.brcId === brcId);
  const filteredMenu = selectedCategory === 'All' 
    ? brcMenuItems 
    : brcMenuItems.filter(item => item.category === selectedCategory.toLowerCase());

  const addToCart = (item: typeof menuItems[0]) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image,
      }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta;
          if (newQuantity <= 0) return null;
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean) as CartItem[];
      return updated;
    });
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleCheckout = useCallback(async () => {
    if (!customerName.trim() || !tableNumber.trim()) {
      Alert.alert('Missing Information', 'Please enter your name and table number');
      return;
    }

    try {
      console.log('Creating session for brcId:', brcId);
      // Generate access code for chatroom
      const code = await createSession(brcId || '', false, customerName);
      console.log('Session created with code:', code);
    
      Alert.alert(
        '✅ Order Placed Successfully!',
        `Your access code: ${code}\n\nTap OK to join the chatroom and track your order!`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Clear form and navigate
              setShowCheckout(false);
              setShowCart(false);
              setCart([]);
              setCustomerName('');
              setTableNumber('');
              
              // Navigate to chatroom
              router.push(`/brc/chatroom/${brcId}`);
            },
          },
        ]
      );
    } catch (error) {
      console.error('Failed to create session:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      Alert.alert('Error', `Failed to place order: ${errorMessage}. Please try again.`);
    }
  }, [brcId, createSession, router, customerName, tableNumber]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#FF6B6B', '#FF8E53']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.restaurantName}>{brc?.name || 'Restaurant'}</Text>
            <Text style={styles.menuTitle}>Menu</Text>
          </View>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => setShowCart(true)}
          >
            <ShoppingCart size={24} color="#FFF" />
            {getTotalItems() > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{getTotalItems()}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryPill,
              selectedCategory === category && styles.categoryPillActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Menu Items */}
      <ScrollView
        style={styles.menuList}
        contentContainerStyle={styles.menuContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredMenu.map(item => (
          <View key={item.id} style={styles.menuItem}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <View style={styles.itemFooter}>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => addToCart(item)}
                >
                  <Plus size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Cart Modal */}
      <Modal
        visible={showCart}
        animationType="slide"
        transparent
        onRequestClose={() => setShowCart(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.cartModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Your Cart</Text>
              <TouchableOpacity onPress={() => setShowCart(false)}>
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.cartItems}>
              {cart.map(item => (
                <View key={item.id} style={styles.cartItem}>
                  <Image source={{ uri: item.image }} style={styles.cartItemImage} />
                  <View style={styles.cartItemInfo}>
                    <Text style={styles.cartItemName}>{item.name}</Text>
                    <Text style={styles.cartItemPrice}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, -1)}
                    >
                      <Minus size={16} color="#FF6B6B" />
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, 1)}
                    >
                      <Plus size={16} color="#4ECDC4" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.cartFooter}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalPrice}>${getTotalPrice().toFixed(2)}</Text>
              </View>
              <TouchableOpacity
                style={[styles.checkoutButton, cart.length === 0 && styles.disabledButton]}
                onPress={() => cart.length > 0 && setShowCheckout(true)}
                disabled={cart.length === 0}
              >
                <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Checkout Modal */}
      <Modal
        visible={showCheckout}
        animationType="slide"
        transparent
        onRequestClose={() => setShowCheckout(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.checkoutModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Complete Order</Text>
              <TouchableOpacity onPress={() => setShowCheckout(false)}>
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.checkoutContent}>
              <Text style={styles.inputLabel}>Your Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={customerName}
                onChangeText={setCustomerName}
              />

              <Text style={styles.inputLabel}>Table Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter table number"
                value={tableNumber}
                onChangeText={setTableNumber}
                keyboardType="numeric"
              />

              <View style={styles.orderSummary}>
                <Text style={styles.summaryTitle}>Order Summary</Text>
                <Text style={styles.summaryText}>Items: {getTotalItems()}</Text>
                <Text style={styles.summaryTotal}>Total: ${getTotalPrice().toFixed(2)}</Text>
                <Text style={styles.paymentNote}>💵 Cash payment only</Text>
              </View>

              <TouchableOpacity
                style={styles.placeOrderButton}
                onPress={handleCheckout}
              >
                <Text style={styles.placeOrderButtonText}>Place Order & Get Chatroom Code</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    marginHorizontal: 20,
  },
  restaurantName: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#FFF',
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#4ECDC4',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  cartBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600' as const,
  },
  categoriesContainer: {
    maxHeight: 60,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  categoriesContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  categoryPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 12,
  },
  categoryPillActive: {
    backgroundColor: '#FF6B6B',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#666',
  },
  categoryTextActive: {
    color: '#FFF',
  },
  menuList: {
    flex: 1,
  },
  menuContent: {
    padding: 20,
    gap: 16,
  },
  menuItem: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  itemImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  itemInfo: {
    padding: 16,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#333',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemPrice: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#FF6B6B',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4ECDC4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  cartModal: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  checkoutModal: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#333',
  },
  cartItems: {
    maxHeight: 400,
    padding: 20,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  cartItemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: '#333',
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600' as const,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#333',
    minWidth: 20,
    textAlign: 'center',
  },
  cartFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '500' as const,
    color: '#666',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#FF6B6B',
  },
  checkoutButton: {
    backgroundColor: '#4ECDC4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFF',
  },
  checkoutContent: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#666',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  orderSummary: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#333',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  summaryTotal: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FF6B6B',
    marginTop: 8,
  },
  paymentNote: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
    fontStyle: 'italic',
  },
  placeOrderButton: {
    backgroundColor: '#4ECDC4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  placeOrderButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#FFF',
  },
});