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
  Package,
  DollarSign,
  Calendar,
  Building,
  Hash,
  AlertTriangle,
  Save,
  X,
} from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import { router } from 'expo-router';

type InventoryCategory = 'proteins' | 'vegetables' | 'dairy' | 'grains' | 'beverages' | 'spices';

type NewInventoryItem = {
  name: string;
  category: InventoryCategory;
  currentStock: string;
  minStock: string;
  maxStock: string;
  unit: string;
  costPerUnit: string;
  supplier: string;
  expiryDate: string;
};

export default function AddInventoryScreen() {
  const [formData, setFormData] = useState<NewInventoryItem>({
    name: '',
    category: 'proteins',
    currentStock: '',
    minStock: '',
    maxStock: '',
    unit: '',
    costPerUnit: '',
    supplier: '',
    expiryDate: '',
  });

  const [errors, setErrors] = useState<Partial<NewInventoryItem>>({});

  const categories: { key: InventoryCategory; label: string; color: string }[] = [
    { key: 'proteins', label: 'Proteins', color: colors.error },
    { key: 'vegetables', label: 'Vegetables', color: colors.success },
    { key: 'dairy', label: 'Dairy', color: colors.warning },
    { key: 'grains', label: 'Grains', color: colors.secondary },
    { key: 'beverages', label: 'Beverages', color: colors.primary },
    { key: 'spices', label: 'Spices', color: colors.accent },
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<NewInventoryItem> = {};

    if (!formData.name.trim()) newErrors.name = 'Item name is required';
    if (!formData.currentStock.trim()) newErrors.currentStock = 'Current stock is required';
    if (!formData.minStock.trim()) newErrors.minStock = 'Minimum stock is required';
    if (!formData.maxStock.trim()) newErrors.maxStock = 'Maximum stock is required';
    if (!formData.unit.trim()) newErrors.unit = 'Unit is required';
    if (!formData.costPerUnit.trim()) newErrors.costPerUnit = 'Cost per unit is required';
    if (!formData.supplier.trim()) newErrors.supplier = 'Supplier is required';

    // Validate numeric fields
    if (formData.currentStock && isNaN(Number(formData.currentStock))) {
      newErrors.currentStock = 'Must be a valid number';
    }
    if (formData.minStock && isNaN(Number(formData.minStock))) {
      newErrors.minStock = 'Must be a valid number';
    }
    if (formData.maxStock && isNaN(Number(formData.maxStock))) {
      newErrors.maxStock = 'Must be a valid number';
    }
    if (formData.costPerUnit && isNaN(Number(formData.costPerUnit))) {
      newErrors.costPerUnit = 'Must be a valid number';
    }

    // Validate stock logic
    const current = Number(formData.currentStock);
    const min = Number(formData.minStock);
    const max = Number(formData.maxStock);

    if (min >= max) {
      newErrors.maxStock = 'Maximum must be greater than minimum';
    }
    if (current > max) {
      newErrors.currentStock = 'Current stock cannot exceed maximum';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      Alert.alert(
        'Success',
        'Inventory item added successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    }
  };

  const updateField = (field: keyof NewInventoryItem, value: string) => {
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
    field: keyof NewInventoryItem;
    placeholder: string;
    keyboardType?: 'default' | 'numeric' | 'email-address';
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          testID="add-inventory-back-btn"
        >
          <ArrowLeft size={20} color={colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.title}>Add Inventory Item</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          testID="add-inventory-save-btn"
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
            <InputField
              label="Item Name"
              field="name"
              placeholder="e.g., Atlantic Salmon"
              icon={Package}
            />

            <View style={styles.inputGroup}>
              <View style={styles.inputHeader}>
                <View style={styles.inputLabelContainer}>
                  <Hash size={16} color={colors.primary} strokeWidth={2} />
                  <Text style={styles.inputLabel}>Category</Text>
                </View>
              </View>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryContainer}
              >
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.key}
                    style={[
                      styles.categoryChip,
                      formData.category === category.key && {
                        backgroundColor: category.color + '15',
                        borderColor: category.color,
                      },
                    ]}
                    onPress={() => updateField('category', category.key)}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        formData.category === category.key && {
                          color: category.color,
                          fontWeight: '600',
                        },
                      ]}
                    >
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <InputField
                  label="Current Stock"
                  field="currentStock"
                  placeholder="15"
                  keyboardType="numeric"
                  icon={Package}
                />
              </View>
              <View style={styles.halfWidth}>
                <InputField
                  label="Unit"
                  field="unit"
                  placeholder="lbs, kg, bottles"
                  icon={Hash}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <InputField
                  label="Min Stock"
                  field="minStock"
                  placeholder="10"
                  keyboardType="numeric"
                  icon={AlertTriangle}
                />
              </View>
              <View style={styles.halfWidth}>
                <InputField
                  label="Max Stock"
                  field="maxStock"
                  placeholder="50"
                  keyboardType="numeric"
                  icon={Package}
                />
              </View>
            </View>

            <InputField
              label="Cost Per Unit"
              field="costPerUnit"
              placeholder="18.50"
              keyboardType="numeric"
              icon={DollarSign}
            />

            <InputField
              label="Supplier"
              field="supplier"
              placeholder="Ocean Fresh Seafood"
              icon={Building}
            />

            <InputField
              label="Expiry Date (Optional)"
              field="expiryDate"
              placeholder="YYYY-MM-DD"
              icon={Calendar}
            />

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
                <Text style={styles.primaryButtonText}>Add Item</Text>
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
  categoryContainer: {
    gap: 8,
    paddingVertical: 4,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textLight,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
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