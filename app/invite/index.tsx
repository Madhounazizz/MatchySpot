import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Share,
  Platform,
  Linking,
} from 'react-native';

import * as Clipboard from 'expo-clipboard';
import { Stack, router } from 'expo-router';
import {
  ArrowLeft,
  Share2,
  Copy,
  MessageCircle,
  Mail,
  Users,
  Gift,
  Star,
  Check,
} from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import Button from '@/components/Button';

const INVITE_METHODS = [
  {
    id: 'share',
    title: 'Share Link',
    subtitle: 'Share via any app',
    icon: Share2,
    color: colors.primary,
  },
  {
    id: 'message',
    title: 'Text Message',
    subtitle: 'Send via SMS',
    icon: MessageCircle,
    color: colors.secondary,
  },
  {
    id: 'email',
    title: 'Email',
    subtitle: 'Send via email',
    icon: Mail,
    color: colors.info,
  },
  {
    id: 'copy',
    title: 'Copy Link',
    subtitle: 'Copy to clipboard',
    icon: Copy,
    color: colors.textLight,
  },
];

const BENEFITS = [
  {
    icon: Gift,
    title: 'Earn Rewards',
    description: 'Get $10 credit for each friend who joins',
  },
  {
    icon: Users,
    title: 'Build Community',
    description: 'Create your local network of trusted members',
  },
  {
    icon: Star,
    title: 'Unlock Features',
    description: 'Access premium features with more referrals',
  },
];

export default function InviteFriendsScreen() {
  const [email, setEmail] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [invitesSent, setInvitesSent] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const inviteLink = 'https://brcapp.com/invite/user123';
  const inviteMessage = `Hey! I've been using this amazing BRC app to find and book local experiences. Join me and get $10 credit when you sign up! ${inviteLink}`;

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: inviteMessage,
        url: Platform.OS === 'ios' ? inviteLink : undefined,
      });
      
      if (result.action === Share.sharedAction) {
        setInvitesSent(prev => prev + 1);
      }
    } catch (error) {
      console.error('Share error:', error);
      alert('Unable to share at this time');
    }
  };

  const handleCopyLink = async () => {
    try {
      if (Platform.OS === 'web') {
        // Web clipboard implementation
        if (typeof navigator !== 'undefined' && navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(inviteLink);
        } else if (typeof document !== 'undefined') {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = inviteLink;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }
      } else {
        // Mobile clipboard
        await Clipboard.setStringAsync(inviteLink);
      }
      
      setCopiedLink(true);
      setShowCopySuccess(true);
      
      setTimeout(() => {
        setCopiedLink(false);
        setShowCopySuccess(false);
      }, 2000);
      
      if (Platform.OS !== 'web') {
        alert('Invite link copied to clipboard!');
      }
    } catch (error) {
      console.error('Copy error:', error);
      alert('Unable to copy link');
    }
  };

  const handleSendEmail = async () => {
    if (!email.trim()) {
      alert('Please enter an email address');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      alert('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setInvitesSent(prev => prev + 1);
      setEmail('');
      alert('Invitation sent successfully!');
    } catch (error) {
      alert('Failed to send invitation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMethodPress = async (method: typeof INVITE_METHODS[0]) => {
    console.log('Method pressed:', method.id);
    
    try {
      switch (method.id) {
        case 'share':
          await handleShare();
          break;
        case 'copy':
          await handleCopyLink();
          break;
        case 'message':
          const smsUrl = `sms:?body=${encodeURIComponent(inviteMessage)}`;
          if (Platform.OS === 'web') {
            if (typeof window !== 'undefined') {
              window.open(smsUrl, '_blank');
            }
          } else {
            // On mobile, try to open SMS app
            try {
              const supported = await Linking.canOpenURL(smsUrl);
              if (supported) {
                await Linking.openURL(smsUrl);
              } else {
                alert('SMS not available on this device');
                return;
              }
            } catch (linkError) {
              alert('Unable to open messages app');
              return;
            }
          }
          setInvitesSent(prev => prev + 1);
          break;
        case 'email':
          const emailUrl = `mailto:?subject=${encodeURIComponent('Join me on BRC!')}&body=${encodeURIComponent(inviteMessage)}`;
          if (Platform.OS === 'web') {
            if (typeof window !== 'undefined') {
              window.open(emailUrl, '_blank');
            }
          } else {
            // On mobile, try to open email app
            try {
              const supported = await Linking.canOpenURL(emailUrl);
              if (supported) {
                await Linking.openURL(emailUrl);
              } else {
                alert('Email not available on this device');
                return;
              }
            } catch (linkError) {
              alert('Unable to open email app');
              return;
            }
          }
          setInvitesSent(prev => prev + 1);
          break;
        default:
          console.log('Unknown method:', method.id);
      }
    } catch (error) {
      console.error('Error handling method press:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Invite Friends',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }} 
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Users size={32} color={colors.primary} />
          </View>
          <Text style={styles.title}>Invite Your Friends</Text>
          <Text style={styles.subtitle}>
            Share BRC with friends and earn rewards together
          </Text>
          
          {invitesSent > 0 && (
            <View style={styles.statsContainer}>
              <Text style={styles.statsText}>
                🎉 {invitesSent} invitation{invitesSent > 1 ? 's' : ''} sent!
              </Text>
            </View>
          )}
        </View>

        {/* Benefits Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Invite Friends?</Text>
          <View style={styles.benefitsContainer}>
            {BENEFITS.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <benefit.icon size={20} color={colors.primary} />
                </View>
                <View style={styles.benefitContent}>
                  <Text style={styles.benefitTitle}>{benefit.title}</Text>
                  <Text style={styles.benefitDescription}>
                    {benefit.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Invite Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose How to Invite</Text>
          <View style={styles.methodsContainer}>
            {INVITE_METHODS.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={styles.methodItem}
                onPress={() => handleMethodPress(method)}
                activeOpacity={0.7}
              >
                <View style={[styles.methodIcon, { backgroundColor: `${method.color}15` }]}>
                  <method.icon size={24} color={method.color} />
                </View>
                <View style={styles.methodContent}>
                  <Text style={styles.methodTitle}>{method.title}</Text>
                  <Text style={styles.methodSubtitle}>{method.subtitle}</Text>
                </View>
                {method.id === 'copy' && copiedLink && (
                  <View style={styles.copiedIndicator}>
                    <Check size={16} color={colors.success} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Email Invite */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Send Direct Invitation</Text>
          <View style={styles.emailContainer}>
            <TextInput
              style={styles.emailInput}
              placeholder="Enter friend's email address"
              placeholderTextColor={colors.textLight}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Button
              title={isLoading ? "Sending..." : "Send Invite"}
              onPress={handleSendEmail}
              style={styles.sendButton}
              disabled={!email.trim() || isLoading}
            />
          </View>
        </View>

        {/* Invite Link */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Invite Link</Text>
          <View style={styles.linkContainer}>
            <Text style={styles.linkText} numberOfLines={1}>
              {inviteLink}
            </Text>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={handleCopyLink}
              activeOpacity={0.7}
            >
              {copiedLink ? (
                <Check size={18} color={colors.success} />
              ) : (
                <Copy size={18} color={colors.primary} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Terms */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            By inviting friends, you agree to our Terms of Service and Privacy Policy.
            Rewards are subject to terms and conditions.
          </Text>
        </View>
      </ScrollView>
      
      {/* Copy Success Toast */}
      {showCopySuccess && (
        <View style={styles.toast}>
          <View style={styles.toastContent}>
            <Check size={16} color={colors.success} />
            <Text style={styles.toastText}>Link copied to clipboard!</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  statsContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.accent,
    borderRadius: 20,
  },
  statsText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  benefitsContainer: {
    gap: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 20,
    backgroundColor: colors.card,
    borderRadius: 16,
    ...shadows.card,
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  methodsContainer: {
    gap: 12,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.card,
    borderRadius: 16,
    ...shadows.card,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  methodContent: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  methodSubtitle: {
    fontSize: 14,
    color: colors.textLight,
  },
  copiedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: `${colors.success}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailContainer: {
    gap: 12,
  },
  emailInput: {
    height: 56,
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: colors.text,
    ...shadows.card,
  },
  sendButton: {
    height: 56,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    ...shadows.card,
  },
  linkText: {
    flex: 1,
    fontSize: 14,
    color: colors.textLight,
    marginRight: 12,
  },
  copyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  termsContainer: {
    paddingVertical: 20,
    paddingBottom: 40,
  },
  termsText: {
    fontSize: 12,
    color: colors.textExtraLight,
    textAlign: 'center',
    lineHeight: 18,
  },
  toast: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
    ...shadows.medium,
  },
  toastText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    marginLeft: 8,
  },
});