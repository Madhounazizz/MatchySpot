import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { X, CreditCard, DollarSign } from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import Button from './Button';

interface OrderPaymentModalProps {
  visible: boolean;
  onClose: () => void;
  onPaymentComplete: (accessCode: string) => void;
  brcName: string;
}

export default function OrderPaymentModal({ 
  visible, 
  onClose, 
  onPaymentComplete, 
  brcName 
}: OrderPaymentModalProps) {
  const [orderTotal, setOrderTotal] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!orderTotal || parseFloat(orderTotal) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid order amount.');
      return;
    }

    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const accessCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      onPaymentComplete(accessCode);
      setOrderTotal('');
    } catch {
      Alert.alert('Payment Failed', 'Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setOrderTotal('');
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Place Order</Text>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={handleClose}
              disabled={isProcessing}
            >
              <X size={24} color={colors.textLight} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.brcInfo}>
              <Text style={styles.brcName}>{brcName}</Text>
              <Text style={styles.subtitle}>Cash payment only</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Order Total</Text>
              <View style={styles.amountInput}>
                <DollarSign size={20} color={colors.textLight} />
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor={colors.textExtraLight}
                  value={orderTotal}
                  onChangeText={setOrderTotal}
                  keyboardType="decimal-pad"
                  editable={!isProcessing}
                />
              </View>
            </View>

            <View style={styles.infoBox}>
              <CreditCard size={20} color={colors.primary} />
              <Text style={styles.infoText}>
                After payment, you&apos;ll receive a unique code to join the chatroom
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Button
              title={isProcessing ? 'Processing...' : 'Pay with Cash'}
              onPress={handlePayment}
              disabled={isProcessing || !orderTotal}
              style={styles.payButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    ...shadows.large,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundLight,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  brcInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  brcName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.primaryDark,
    marginLeft: 12,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 20,
  },
  payButton: {
    marginTop: 8,
  },
});