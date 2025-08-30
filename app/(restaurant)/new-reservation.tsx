import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  Users,
  MessageSquare,
  Save,
  X,
  AlertTriangle,
  MapPin,
} from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import { router } from 'expo-router';

type NewReservation = {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string;
  time: string;
  partySize: string;
  specialRequests: string;
  tableNumber: string;
};

export default function NewReservationScreen() {
  const [formData, setFormData] = useState<NewReservation>({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    date: '',
    time: '',
    partySize: '',
    specialRequests: '',
    tableNumber: '',
  });

  const [errors, setErrors] = useState<Partial<NewReservation>>({});

  const timeSlots = [
    '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', 
    '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'
  ];

  const partySizes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'];

  const validateForm = (): boolean => {
    const newErrors: Partial<NewReservation> = {};

    if (!formData.customerName.trim()) newErrors.customerName = 'Customer name is required';
    if (!formData.customerPhone.trim()) newErrors.customerPhone = 'Phone number is required';
    if (!formData.customerEmail.trim()) newErrors.customerEmail = 'Email is required';
    if (!formData.date.trim()) newErrors.date = 'Date is required';
    if (!formData.time.trim()) newErrors.time = 'Time is required';
    if (!formData.partySize.trim()) newErrors.partySize = 'Party size is required';

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.customerEmail && !emailRegex.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address';
    }

    // Validate phone format (basic)
    const phoneRegex = /^[\d\s\-\(\)\+]+$/;
    if (formData.customerPhone && !phoneRegex.test(formData.customerPhone)) {
      newErrors.customerPhone = 'Please enter a valid phone number';
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (formData.date && !dateRegex.test(formData.date)) {
      newErrors.date = 'Please use YYYY-MM-DD format';
    }

    // Validate future date
    if (formData.date && dateRegex.test(formData.date)) {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'Date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      Alert.alert(
        'Success',
        'Reservation created successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    }
  };

  const updateField = (field: keyof NewReservation, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const InputField = ({ 
    label, 
    field, 
    placeholder, 
    keyboardType = 'default',
    icon: Icon,
    multiline = false 
  }: {
    label: string;
    field: keyof NewReservation;
    placeholder: string;
    keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
    icon: any;
    multiline?: boolean;
  }) => (
    <View style={styles.inputGroup}>
      <View style={styles.inputHeader}>
        <View style={styles.inputLabelContainer}>
          <Icon size={16} color={colors.primary} strokeWidth={2} />
          <Text style={styles.inputLabel}>{label}</Text>
        </View>
        {errors[field] && (
          <View style={styles.errorContainer}>
            <AlertTriangle size={12} color={colors.error} strokeWidth={2} />
            <Text style={styles.errorText}>{errors[field]}</Text>
          </View>
        )}
      </View>
      <TextInput
        style={[
          styles.textInput,
          multiline && styles.textInputMultiline,
          errors[field] && styles.textInputError,
        ]}
        value={formData[field]}
        onChangeText={(value) => updateField(field, value)}
        placeholder={placeholder}
        placeholderTextColor={colors.textLight}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
    </View>
  );

  const SelectField = ({ 
    label, 
    field, 
    options, 
    icon: Icon 
  }: {
    label: string;
    field: keyof NewReservation;
    options: string[];
    icon: any;
  }) => (
    <View style={styles.inputGroup}>
      <View style={styles.inputHeader}>
        <View style={styles.inputLabelContainer}>
          <Icon size={16} color={colors.primary} strokeWidth={2} />
          <Text style={styles.inputLabel}>{label}</Text>
        </View>
        {errors[field] && (
          <View style={styles.errorContainer}>
            <AlertTriangle size={12} color={colors.error} strokeWidth={2} />
            <Text style={styles.errorText}>{errors[field]}</Text>
          </View>
        )}
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.optionsContainer}
      >
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionChip,
              formData[field] === option && styles.optionChipSelected,
            ]}
            onPress={() => updateField(field, option)}
          >
            <Text
              style={[
                styles.optionChipText,
                formData[field] === option && styles.optionChipTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          testID="new-reservation-back-btn"
        >
          <ArrowLeft size={20} color={colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.title}>New Reservation</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          testID="new-reservation-save-btn"
        >
          <Save size={18} color={colors.white} strokeWidth={2} />
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Customer Information</Text>
              <Text style={styles.sectionSubtitle}>Enter guest details</Text>
            </View>

            <InputField
              label="Customer Name"
              field="customerName"
              placeholder="John Doe"
              icon={User}
            />

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <InputField
                  label="Phone Number"
                  field="customerPhone"
                  placeholder="(555) 123-4567"
                  keyboardType="phone-pad"
                  icon={Phone}
                />
              </View>
              <View style={styles.halfWidth}>
                <InputField
                  label="Email Address"
                  field="customerEmail"
                  placeholder="john@example.com"
                  keyboardType="email-address"
                  icon={Mail}
                />
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Reservation Details</Text>
              <Text style={styles.sectionSubtitle}>Select date, time, and party size</Text>
            </View>

            <InputField
              label="Date"
              field="date"
              placeholder="2025-01-25"
              icon={Calendar}
            />

            <SelectField
              label="Time"
              field="time"
              options={timeSlots}
              icon={Clock}
            />

            <SelectField
              label="Party Size"
              field="partySize"
              options={partySizes}
              icon={Users}
            />

            <InputField
              label="Table Number (Optional)"
              field="tableNumber"
              placeholder="e.g., T1, T2, T3"
              icon={MapPin}
            />

            <InputField
              label="Special Requests (Optional)"
              field="specialRequests"
              placeholder="Dietary restrictions, celebration, accessibility needs..."
              icon={MessageSquare}
              multiline
            />

            <View style={styles.reservationSummary}>
              <Text style={styles.summaryTitle}>Reservation Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Guest:</Text>
                <Text style={styles.summaryValue}>{formData.customerName || 'Not specified'}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Date & Time:</Text>
                <Text style={styles.summaryValue}>
                  {formData.date && formData.time ? `${formData.date} at ${formData.time}` : 'Not specified'}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Party Size:</Text>
                <Text style={styles.summaryValue}>{formData.partySize ? `${formData.partySize} guests` : 'Not specified'}</Text>
              </View>
              {formData.tableNumber && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Table:</Text>
                  <Text style={styles.summaryValue}>{formData.tableNumber}</Text>
                </View>
              )}
            </View>

            <View style={styles.formFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => router.back()}
              >
                <X size={16} color={colors.textLight} strokeWidth={2} />
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleSave}
              >
                <Save size={16} color={colors.white} strokeWidth={2} />
                <Text style={styles.primaryButtonText}>Create Reservation</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.white,
    ...shadows.small,
    elevation: 4,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 13,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 16,
    gap: 20,
  },
  sectionHeader: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.textLight,
    fontWeight: '500',
  },
  inputGroup: {
    gap: 8,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    fontWeight: '500',
  },
  textInputMultiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  textInputError: {
    borderColor: colors.error,
    backgroundColor: colors.error + '05',
  },
  optionsContainer: {
    gap: 8,
    paddingVertical: 4,
  },
  optionChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionChipSelected: {
    backgroundColor: colors.primary + '15',
    borderColor: colors.primary,
  },
  optionChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textLight,
  },
  optionChipTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  reservationSummary: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  formFooter: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.backgroundLight,
    gap: 6,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.primary,
    gap: 6,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
});