import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, useWindowDimensions, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import Button from '@/components/Button';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const { email, code } = useLocalSearchParams<{ email: string; code: string }>();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState('');
  const [success, setSuccess] = useState(false);

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) return 'Password must be at least 8 characters long';
    if (!/(?=.*[a-z])/.test(pwd)) return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(pwd)) return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(pwd)) return 'Password must contain at least one number';
    return '';
  };

  const handleResetPassword = async () => {
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();
    
    if (!trimmedPassword || !trimmedConfirmPassword) {
      setShowError('Please fill in all fields');
      return;
    }

    if (trimmedPassword.length > 128) {
      setShowError('Password is too long');
      return;
    }

    const passwordError = validatePassword(trimmedPassword);
    if (passwordError) {
      setShowError(passwordError);
      return;
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      setShowError('Passwords do not match');
      return;
    }

    setShowError('');
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });
      
      setSuccess(true);
      
      // Navigate to login after 2 seconds
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (error) {
      console.error('Reset password error:', error);
      setShowError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const isFormValid = password && confirmPassword && !validatePassword(password) && password === confirmPassword;

  if (success) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.backgroundContainer, { backgroundColor: colors.primary }]}>
          <LinearGradient
            colors={[colors.primary, colors.primaryLight]}
            style={[styles.backgroundGradient, { height: height * 0.45 }]}
          />
          
          <View style={styles.content}>
            <View style={styles.successContainer}>
              <View style={styles.successIconContainer}>
                <CheckCircle size={80} color={colors.success} />
              </View>
              <Text style={styles.successTitle}>Password Reset!</Text>
              <Text style={styles.successMessage}>
                Your password has been successfully reset. You can now sign in with your new password.
              </Text>
              <Text style={styles.redirectText}>
                Redirecting to login...
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

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
              onPress={handleBack}
            >
              <ArrowLeft size={24} color={colors.white} />
            </TouchableOpacity>

            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <LinearGradient
                  colors={[colors.white, colors.accent]}
                  style={styles.logoGradient}
                >
                  <Lock size={40} color={colors.primary} />
                </LinearGradient>
              </View>
              <Text style={styles.appName}>MATCHYSPOT</Text>
              <Text style={styles.title}>Reset Password</Text>
              <Text style={styles.subtitle}>
                Create a new password for your account
              </Text>
              <Text style={styles.emailText}>{email}</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <Lock size={20} color={colors.primary} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="New password"
                  placeholderTextColor={colors.textExtraLight}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={colors.textLight} />
                  ) : (
                    <Eye size={20} color={colors.textLight} />
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <Lock size={20} color={colors.primary} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm new password"
                  placeholderTextColor={colors.textExtraLight}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color={colors.textLight} />
                  ) : (
                    <Eye size={20} color={colors.textLight} />
                  )}
                </TouchableOpacity>
              </View>

              {showError ? (
                <Text style={styles.errorText}>{showError}</Text>
              ) : null}

              <View style={styles.requirementsContainer}>
                <Text style={styles.requirementsTitle}>Password requirements:</Text>
                <Text style={styles.requirementText}>• At least 8 characters long</Text>
                <Text style={styles.requirementText}>• Contains uppercase and lowercase letters</Text>
                <Text style={styles.requirementText}>• Contains at least one number</Text>
              </View>

              <Button
                title="Reset Password"
                onPress={handleResetPassword}
                loading={loading}
                disabled={!isFormValid}
                fullWidth
                style={styles.resetButton}
              />
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
    fontWeight: '800' as const,
    color: colors.white,
    letterSpacing: 2,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.white,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.white,
    textAlign: 'center',
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
    marginBottom: 16,
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
    fontWeight: '500' as const,
  },
  eyeButton: {
    padding: 4,
  },
  requirementsContainer: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 12,
    color: colors.textLight,
    lineHeight: 18,
  },
  resetButton: {
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
    justifyContent: 'center',
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 40,
    marginHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  redirectText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600' as const,
    textAlign: 'center',
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: -8,
    marginBottom: 16,
    marginLeft: 4,
  },
});