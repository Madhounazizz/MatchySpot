import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import { X, Copy, MessageCircle } from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import Button from './Button';
import * as Clipboard from 'expo-clipboard';

interface AccessCodeModalProps {
  visible: boolean;
  onClose: () => void;
  onJoinChatroom: () => void;
  accessCode: string;
  brcName: string;
}

export default function AccessCodeModal({ 
  visible, 
  onClose, 
  onJoinChatroom, 
  accessCode, 
  brcName 
}: AccessCodeModalProps) {
  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(accessCode);
    Alert.alert('Copied!', 'Access code copied to clipboard');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Payment Successful!</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={colors.textLight} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.successIcon}>
              <MessageCircle size={48} color={colors.primary} />
            </View>

            <Text style={styles.subtitle}>
              Your order at {brcName} has been processed
            </Text>

            <View style={styles.codeContainer}>
              <Text style={styles.codeLabel}>Your Access Code</Text>
              <View style={styles.codeBox}>
                <Text style={styles.code}>{accessCode}</Text>
                <TouchableOpacity style={styles.copyButton} onPress={handleCopyCode}>
                  <Copy size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Use this code to join the chatroom and connect with other customers at {brcName}
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Button
              title="Join Chatroom"
              onPress={onJoinChatroom}
              style={styles.joinButton}
              icon={<MessageCircle size={20} color={colors.white} />}
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: 24,
    width: '100%',
    maxWidth: 400,
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
    alignItems: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  codeContainer: {
    width: '100%',
    marginBottom: 20,
  },
  codeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
  },
  code: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 2,
    marginRight: 12,
  },
  copyButton: {
    padding: 4,
  },
  infoBox: {
    backgroundColor: colors.accent,
    padding: 16,
    borderRadius: 12,
    width: '100%',
  },
  infoText: {
    fontSize: 14,
    color: colors.primaryDark,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
  },
  joinButton: {
    marginTop: 8,
  },
});