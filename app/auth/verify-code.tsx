import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, useWindowDimensions, SafeAreaView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Shield, RefreshCw } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import Button from '@/components/Button';

export default function VerifyCodeScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const { email, type } = useLocalSearchParams<{ email: string; type: string }>();
  
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [showError, setShowError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCodeChange = (value: string, index: number) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setShowError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async () => {
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      setShowError('Please enter the complete 6-digit code');
      return;
    }

    if (timeLeft === 0) {
      setShowError('Verification code has expired. Please request a new one.');
      return;
    }

    setShowError('');
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate success for demo (in real app, verify with backend)
          if (verificationCode === '123456') {
            resolve(true);
          } else {
            reject(new Error('Invalid verification code'));
          }
        }, 2000);
      });
      
      // Navigate to reset password screen
      router.push({
        pathname: '/auth/reset-password' as any,
        params: { email: email || '', code: verificationCode }
      });
    } catch (error) {
      console.error('Verification error:', error);
      setShowError('Invalid verification code. Please try again.');
      // Clear the code inputs
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setShowError('Email not found. Please go back and try again.');
      return;
    }

    setResendLoading(true);
    setShowError('');
    
    try {
      // Simulate API call
      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });
      
      // Reset timer and clear code
      setTimeLeft(300);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      
      Alert.alert(
        'Code Sent',
        'A new verification code has been sent to your email.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Resend error:', error);
      setShowError('Failed to resend code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const isCodeComplete = code.every(digit => digit !== '');

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
                  <Shield size={40} color={colors.primary} />
                </LinearGradient>
              </View>
              <Text style={styles.appName}>MATCHYSPOT</Text>
              <Text style={styles.title}>Verify Your Email</Text>
              <Text style={styles.subtitle}>
                We&apos;ve sent a 6-digit verification code to:
              </Text>
              <Text style={styles.emailText}>{email}</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.codeContainer}>
                {code.map((digit, index) => (
                  <TextInput
                    key={`code-input-${index}`}
                    ref={(ref) => { inputRefs.current[index] = ref; }}
                    style={[
                      styles.codeInput,
                      digit ? styles.codeInputFilled : null,
                      showError ? styles.codeInputError : null
                    ]}
                    value={digit}
                    onChangeText={(value) => handleCodeChange(value, index)}
                    onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                    keyboardType="numeric"
                    maxLength={1}
                    autoFocus={index === 0}
                    selectTextOnFocus
                  />
                ))}
              </View>

              {showError ? (
                <Text style={styles.errorText}>{showError}</Text>
              ) : null}

              <View style={styles.timerContainer}>
                <Text style={styles.timerText}>
                  {timeLeft > 0 ? (
                    `Code expires in ${formatTime(timeLeft)}`
                  ) : (
                    'Code has expired'
                  )}
                </Text>
              </View>

              <Button
                title="Verify Code"
                onPress={handleVerifyCode}
                loading={loading}
                disabled={!isCodeComplete || timeLeft === 0}
                fullWidth
                style={styles.verifyButton}
              />

              <View style={styles.resendContainer}>
                <Text style={styles.resendText}>Didn&apos;t receive the code? </Text>
                <TouchableOpacity 
                  onPress={handleResendCode}
                  disabled={resendLoading || timeLeft > 240} // Allow resend after 1 minute
                >
                  <View style={styles.resendButtonContent}>
                    {resendLoading && <RefreshCw size={16} color={colors.primary} />}
                    <Text style={[
                      styles.resendButtonText,
                      (resendLoading || timeLeft > 240) ? styles.resendButtonDisabled : null
                    ]}>
                      {resendLoading ? ' Sending...' : 'Resend'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.helpContainer}>
                <Text style={styles.helpTitle}>Having trouble?</Text>
                <Text style={styles.helpText}>
                  Make sure to check your spam folder. If you still don&apos;t receive the code, try requesting a new one.
                </Text>
              </View>
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
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  codeInput: {
    width: 45,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.backgroundDark,
    backgroundColor: colors.backgroundLight,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600' as const,
    color: colors.text,
  },
  codeInputFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  codeInputError: {
    borderColor: colors.error,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timerText: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500' as const,
  },
  verifyButton: {
    marginBottom: 24,
    height: 56,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  resendText: {
    fontSize: 14,
    color: colors.textLight,
  },
  resendButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600' as const,
  },
  resendButtonDisabled: {
    color: colors.textExtraLight,
  },
  helpContainer: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: 16,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    textAlign: 'center',
    marginTop: -16,
    marginBottom: 16,
  },
});