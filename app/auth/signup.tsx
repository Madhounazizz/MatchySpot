import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, User, Eye, EyeOff, Calendar, Heart, Store, Users, Phone, MapPin } from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import Button from '@/components/Button';
import { useUserStore } from '@/store/useUserStore';

const { width, height } = Dimensions.get('window');

export default function SignUpScreen() {
  const router = useRouter();
  const { login } = useUserStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    restaurantName: '',
    phone: '',
    address: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [accountType, setAccountType] = useState<'user' | 'restaurant'>('user');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    if (step === 0) {
      setStep(1);
    } else if (step === 1) {
      setStep(2);
    } else {
      handleSignUp();
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      login();
      setLoading(false);
      router.replace('/(tabs)');
    }, 1500);
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const isStep0Valid = accountType !== null;
  const isStep1Valid = accountType === 'restaurant' 
    ? formData.restaurantName && formData.firstName && formData.email && formData.phone && formData.address
    : formData.firstName && formData.lastName && formData.email;
  const isStep2Valid = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        style={styles.backgroundGradient}
      />
      
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the community and start matching!</Text>
          </View>

          <View style={styles.stepIndicator}>
            <View style={[styles.stepDot, styles.activeStep]} />
            <View style={styles.stepLine} />
            <View style={[styles.stepDot, step >= 1 && styles.activeStep]} />
            <View style={styles.stepLine} />
            <View style={[styles.stepDot, step >= 2 && styles.activeStep]} />
          </View>

          <View style={styles.formContainer}>
            {step === 0 ? (
              <>
                <Text style={styles.stepTitle}>Choose Account Type</Text>
                <Text style={styles.stepSubtitle}>Select how you want to use MatchySpot</Text>
                
                <View style={styles.accountTypeButtons}>
                  <TouchableOpacity
                    style={[
                      styles.accountTypeCard,
                      accountType === 'user' && styles.accountTypeCardActive
                    ]}
                    onPress={() => setAccountType('user')}
                  >
                    <Users size={40} color={accountType === 'user' ? colors.white : colors.primary} />
                    <Text style={[
                      styles.accountTypeCardTitle,
                      accountType === 'user' && styles.accountTypeCardTitleActive
                    ]}>I&apos;m a User</Text>
                    <Text style={[
                      styles.accountTypeCardDescription,
                      accountType === 'user' && styles.accountTypeCardDescriptionActive
                    ]}>Find and book amazing restaurants</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.accountTypeCard,
                      accountType === 'restaurant' && styles.accountTypeCardActive
                    ]}
                    onPress={() => setAccountType('restaurant')}
                  >
                    <Store size={40} color={accountType === 'restaurant' ? colors.white : colors.primary} />
                    <Text style={[
                      styles.accountTypeCardTitle,
                      accountType === 'restaurant' && styles.accountTypeCardTitleActive
                    ]}>I&apos;m a Restaurant</Text>
                    <Text style={[
                      styles.accountTypeCardDescription,
                      accountType === 'restaurant' && styles.accountTypeCardDescriptionActive
                    ]}>Manage bookings and connect with diners</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : step === 1 ? (
              <>
                <Text style={styles.stepTitle}>{accountType === 'restaurant' ? 'Restaurant Information' : 'Personal Information'}</Text>
                
                {accountType === 'restaurant' ? (
                  <>
                    <View style={styles.inputContainer}>
                      <View style={styles.inputIconContainer}>
                        <Store size={20} color={colors.primary} />
                      </View>
                      <TextInput
                        style={styles.input}
                        placeholder="Restaurant name"
                        placeholderTextColor={colors.textExtraLight}
                        value={formData.restaurantName}
                        onChangeText={(value) => handleInputChange('restaurantName', value)}
                        autoCapitalize="words"
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <View style={styles.inputIconContainer}>
                        <User size={20} color={colors.primary} />
                      </View>
                      <TextInput
                        style={styles.input}
                        placeholder="Owner/Manager name"
                        placeholderTextColor={colors.textExtraLight}
                        value={formData.firstName}
                        onChangeText={(value) => handleInputChange('firstName', value)}
                        autoCapitalize="words"
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <View style={styles.inputIconContainer}>
                        <Phone size={20} color={colors.primary} />
                      </View>
                      <TextInput
                        style={styles.input}
                        placeholder="Phone number"
                        placeholderTextColor={colors.textExtraLight}
                        value={formData.phone}
                        onChangeText={(value) => handleInputChange('phone', value)}
                        keyboardType="phone-pad"
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <View style={styles.inputIconContainer}>
                        <MapPin size={20} color={colors.primary} />
                      </View>
                      <TextInput
                        style={styles.input}
                        placeholder="Restaurant address"
                        placeholderTextColor={colors.textExtraLight}
                        value={formData.address}
                        onChangeText={(value) => handleInputChange('address', value)}
                        autoCapitalize="words"
                      />
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.inputContainer}>
                      <View style={styles.inputIconContainer}>
                        <User size={20} color={colors.primary} />
                      </View>
                      <TextInput
                        style={styles.input}
                        placeholder="First name"
                        placeholderTextColor={colors.textExtraLight}
                        value={formData.firstName}
                        onChangeText={(value) => handleInputChange('firstName', value)}
                        autoCapitalize="words"
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <View style={styles.inputIconContainer}>
                        <User size={20} color={colors.primary} />
                      </View>
                      <TextInput
                        style={styles.input}
                        placeholder="Last name"
                        placeholderTextColor={colors.textExtraLight}
                        value={formData.lastName}
                        onChangeText={(value) => handleInputChange('lastName', value)}
                        autoCapitalize="words"
                      />
                    </View>
                  </>
                )}

                <View style={styles.inputContainer}>
                  <View style={styles.inputIconContainer}>
                    <Mail size={20} color={colors.primary} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder={accountType === 'restaurant' ? 'Restaurant email' : 'Email address'}
                    placeholderTextColor={colors.textExtraLight}
                    value={formData.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                {accountType === 'user' && (
                  <View style={styles.inputContainer}>
                    <View style={styles.inputIconContainer}>
                      <Calendar size={20} color={colors.primary} />
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Date of birth (MM/DD/YYYY)"
                      placeholderTextColor={colors.textExtraLight}
                      value={formData.dateOfBirth}
                      onChangeText={(value) => handleInputChange('dateOfBirth', value)}
                      keyboardType="numeric"
                    />
                  </View>
                )}
              </>
            ) : (
              <>
                <Text style={styles.stepTitle}>Create Password</Text>
                
                <View style={styles.inputContainer}>
                  <View style={styles.inputIconContainer}>
                    <Lock size={20} color={colors.primary} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={colors.textExtraLight}
                    value={formData.password}
                    onChangeText={(value) => handleInputChange('password', value)}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color={colors.primary} />
                    ) : (
                      <Eye size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                  <View style={styles.inputIconContainer}>
                    <Lock size={20} color={colors.primary} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm password"
                    placeholderTextColor={colors.textExtraLight}
                    value={formData.confirmPassword}
                    onChangeText={(value) => handleInputChange('confirmPassword', value)}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} color={colors.primary} />
                    ) : (
                      <Eye size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                </View>

                {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <Text style={styles.errorText}>Passwords do not match</Text>
                )}

                <View style={styles.passwordRequirements}>
                  <Text style={styles.requirementsTitle}>Password must contain:</Text>
                  <Text style={styles.requirementItem}>• At least 8 characters</Text>
                  <Text style={styles.requirementItem}>• One uppercase letter</Text>
                  <Text style={styles.requirementItem}>• One number</Text>
                </View>
              </>
            )}

            <Button
              title={step === 0 ? "Continue" : step === 1 ? "Continue" : "Create Account"}
              onPress={handleContinue}
              loading={loading}
              disabled={step === 0 ? !isStep0Valid : step === 1 ? !isStep1Valid : !isStep2Valid}
              fullWidth
              style={styles.continueButton}
            />

            {step > 0 && (
              <Button
                title="Back"
                variant="outline"
                onPress={() => setStep(step - 1)}
                fullWidth
                style={styles.backButton}
              />
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginText}>Sign In</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.terms}>
            <Text style={styles.termsText}>
              By creating an account, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.35,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  appName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeStep: {
    backgroundColor: colors.white,
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  stepLine: {
    width: 60,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 12,
  },
  formContainer: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
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
    fontWeight: '500',
  },
  eyeButton: {
    padding: 8,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginBottom: 16,
    marginLeft: 4,
  },
  passwordRequirements: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  requirementItem: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 4,
  },
  continueButton: {
    marginBottom: 12,
    height: 56,
    borderRadius: 16,
    ...shadows.button,
  },
  backButton: {
    height: 52,
    borderRadius: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    fontSize: 16,
    color: colors.textLight,
  },
  loginText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '700',
  },
  terms: {
    paddingHorizontal: 20,
  },
  termsText: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: '600',
  },
  stepSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 30,
  },
  accountTypeButtons: {
    gap: 16,
  },
  accountTypeCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.backgroundDark,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  accountTypeCardActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  accountTypeCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  accountTypeCardTitleActive: {
    color: colors.white,
  },
  accountTypeCardDescription: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
  accountTypeCardDescriptionActive: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
});