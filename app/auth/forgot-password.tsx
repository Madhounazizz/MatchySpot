import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, useWindowDimensions, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, ArrowLeft, Heart, CheckCircle } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import Button from '@/components/Button';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showError, setShowError] = useState('');

  const handleSendResetEmail = async () => {
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail) {
      setShowError('Please enter your email address');
      return;
    }

    if (trimmedEmail.length > 100) {
      setShowError('Email address is too long');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setShowError('Please enter a valid email address');
      return;
    }

    setShowError('');
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise((resolve) => {
        if (resolve) {
          setTimeout(resolve, 2000);
        }
      });
      
      // Navigate to verification screen instead of showing success
      router.push({
        pathname: '/auth/verify-code',
        params: { email: trimmedEmail, type: 'reset' }
      });
    } catch (error) {
      console.error('Reset password error:', error);
      setShowError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (emailToValidate: string) => {
    const trimmedEmail = emailToValidate.trim();
    if (!trimmedEmail || trimmedEmail.length > 100) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(trimmedEmail);
  };

  const handleBackToLogin = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.backgroundContainer, { backgroundColor: colors.primary }]}>
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          style={[styles.backgroundGradient, { height: height * 0.45 }]}
        />
        
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.content}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBackToLogin}
            >
              <ArrowLeft size={24} color={colors.white} />
            </TouchableOpacity>

            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <LinearGradient
                  colors={[colors.white, colors.accent]}
                  style={styles.logoGradient}
                >
                  <Heart size={40} color={colors.primary} fill={colors.primary} />
                </LinearGradient>
              </View>
              <Text style={styles.appName}>MATCHYSPOT</Text>
              <Text style={styles.title}>Forgot Password?</Text>
              <Text style={styles.subtitle}>
                {emailSent 
                  ? 'Check your email for reset instructions'
                  : 'Enter your email address and we&apos;ll send you a link to reset your password'
                }
              </Text>
            </View>

            <View style={styles.formContainer}>
              {emailSent ? (
                <View style={styles.successContainer}>
                  <View style={styles.successIconContainer}>
                    <CheckCircle size={60} color={colors.success} />
                  </View>
                  <Text style={styles.successTitle}>Email Sent!</Text>
                  <Text style={styles.successMessage}>
                    We&apos;ve sent a password reset link to:
                  </Text>
                  <Text style={styles.emailText}>{email}</Text>
                  <Text style={styles.instructionText}>
                    Please check your inbox and spam folder. The link will expire in 24 hours.
                  </Text>
                </View>
              ) : (
                <>
                  <View style={styles.inputContainer}>
                    <View style={styles.inputIconContainer}>
                      <Mail size={20} color={colors.primary} />
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email address"
                      placeholderTextColor={colors.textExtraLight}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoFocus
                    />
                  </View>

                  {showError ? (
                    <Text style={styles.errorText}>{showError}</Text>
                  ) : null}

                  <Button
                    title="Send Reset Link"
                    onPress={handleSendResetEmail}
                    loading={loading}
                    disabled={!email || !isValidEmail(email)}
                    fullWidth
                    style={styles.resetButton}
                  />
                </>
              )}

              <View style={styles.helpContainer}>
                <Text style={styles.helpTitle}>Need more help?</Text>
                <Text style={styles.helpText}>
                  If you don&apos;t receive the email within a few minutes, check your spam folder or contact our support team.
                </Text>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Remember your password? </Text>
              <TouchableOpacity onPress={handleBackToLogin}>
                <Text style={styles.backToLoginText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  backgroundContainer: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 2,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    marginBottom: 24,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: colors.backgroundDark,
  },
  inputIconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 16,
    fontWeight: '500',
  },
  resetButton: {
    marginBottom: 24,
    height: 56,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successIconContainer: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 16,
  },
  instructionText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  helpContainer: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  footerText: {
    fontSize: 16,
    color: colors.textLight,
  },
  backToLoginText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '700',
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: -16,
    marginBottom: 16,
    marginLeft: 4,
  },
});