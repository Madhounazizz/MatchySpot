import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Image } from 'expo-image';
import { X, User, UserX, Shuffle } from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import Button from './Button';
import { useUserStore } from '@/store/useUserStore';

interface JoinChatroomModalProps {
  visible: boolean;
  onClose: () => void;
  onJoin: (isAnonymous: boolean, customNickname?: string) => void;
  brcName: string;
  generateAnonymousName: () => string;
}

export default function JoinChatroomModal({ 
  visible, 
  onClose, 
  onJoin, 
  brcName,
  generateAnonymousName
}: JoinChatroomModalProps) {
  const { currentUser } = useUserStore();
  const [selectedMode, setSelectedMode] = useState<'profile' | 'anonymous'>('profile');
  const [customNickname, setCustomNickname] = useState('');
  const [suggestedName, setSuggestedName] = useState(generateAnonymousName());

  const handleJoin = () => {
    if (selectedMode === 'anonymous' && customNickname.trim() === '') {
      Alert.alert('Nickname Required', 'Please enter a nickname or use the suggested one.');
      return;
    }

    const nickname = selectedMode === 'anonymous' 
      ? (customNickname.trim() || suggestedName)
      : undefined;

    onJoin(selectedMode === 'anonymous', nickname);
  };

  const generateNewName = () => {
    setSuggestedName(generateAnonymousName());
  };

  const useSuggestedName = () => {
    setCustomNickname(suggestedName);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Join Chatroom</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={colors.textLight} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.subtitle}>
              Choose how you&apos;d like to appear in the {brcName} chatroom
            </Text>

            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[
                  styles.option,
                  selectedMode === 'profile' && styles.selectedOption,
                ]}
                onPress={() => setSelectedMode('profile')}
              >
                <View style={styles.optionHeader}>
                  <User size={24} color={selectedMode === 'profile' ? colors.primary : colors.textLight} />
                  <Text style={[
                    styles.optionTitle,
                    selectedMode === 'profile' && styles.selectedOptionTitle,
                  ]}>
                    Use My Profile
                  </Text>
                </View>
                
                {currentUser && (
                  <View style={styles.profilePreview}>
                    <Image
                      source={{ uri: currentUser.avatar }}
                      style={styles.avatar}
                      contentFit="cover"
                    />
                    <Text style={styles.profileName}>{currentUser.name}</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.option,
                  selectedMode === 'anonymous' && styles.selectedOption,
                ]}
                onPress={() => setSelectedMode('anonymous')}
              >
                <View style={styles.optionHeader}>
                  <UserX size={24} color={selectedMode === 'anonymous' ? colors.primary : colors.textLight} />
                  <Text style={[
                    styles.optionTitle,
                    selectedMode === 'anonymous' && styles.selectedOptionTitle,
                  ]}>
                    Join Anonymously
                  </Text>
                </View>

                {selectedMode === 'anonymous' && (
                  <View style={styles.nicknameContainer}>
                    <Text style={styles.nicknameLabel}>Choose a nickname:</Text>
                    
                    <View style={styles.suggestedNameContainer}>
                      <Text style={styles.suggestedLabel}>Suggested:</Text>
                      <TouchableOpacity style={styles.suggestedName} onPress={useSuggestedName}>
                        <Text style={styles.suggestedNameText}>{suggestedName}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.shuffleButton} onPress={generateNewName}>
                        <Shuffle size={16} color={colors.primary} />
                      </TouchableOpacity>
                    </View>

                    <TextInput
                      style={styles.nicknameInput}
                      placeholder="Or type your own..."
                      placeholderTextColor={colors.textExtraLight}
                      value={customNickname}
                      onChangeText={setCustomNickname}
                      maxLength={20}
                    />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Button
              title="Join Chatroom"
              onPress={handleJoin}
              style={styles.joinButton}
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
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  optionsContainer: {
    gap: 16,
  },
  option: {
    borderWidth: 2,
    borderColor: colors.backgroundLight,
    borderRadius: 16,
    padding: 16,
  },
  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: colors.accent,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
  },
  selectedOptionTitle: {
    color: colors.primary,
  },
  profilePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    padding: 12,
    borderRadius: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  profileName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  nicknameContainer: {
    gap: 12,
  },
  nicknameLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  suggestedNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  suggestedLabel: {
    fontSize: 12,
    color: colors.textLight,
  },
  suggestedName: {
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  suggestedNameText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  shuffleButton: {
    padding: 4,
  },
  nicknameInput: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  footer: {
    paddingHorizontal: 20,
  },
  joinButton: {
    marginTop: 8,
  },
});