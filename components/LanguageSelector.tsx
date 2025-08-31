import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Globe, Check } from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import { useLanguage } from '@/store/useLanguageStore';
import { Language } from '@/constants/translations';

type LanguageSelectorProps = {
  visible: boolean;
  onClose: () => void;
};

export default function LanguageSelector({ visible, onClose }: LanguageSelectorProps) {
  const { currentLanguage, changeLanguage, t } = useLanguage();

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  const handleLanguageSelect = async (language: Language) => {
    await changeLanguage(language);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Globe size={24} color={colors.primary} />
            <Text style={styles.title}>{t('changeLanguage')}</Text>
          </View>
          
          <View style={styles.languageList}>
            {languages.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageItem,
                  currentLanguage === language.code && styles.selectedLanguageItem
                ]}
                onPress={() => handleLanguageSelect(language.code)}
              >
                <View style={styles.languageInfo}>
                  <Text style={styles.flag}>{language.flag}</Text>
                  <Text style={[
                    styles.languageName,
                    currentLanguage === language.code && styles.selectedLanguageName
                  ]}>
                    {language.name}
                  </Text>
                </View>
                
                {currentLanguage === language.code && (
                  <Check size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Pressable>
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
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 300,
    ...shadows.large,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
  },
  languageList: {
    gap: 12,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.backgroundLight,
  },
  selectedLanguageItem: {
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  selectedLanguageName: {
    color: colors.primary,
    fontWeight: '600',
  },
});