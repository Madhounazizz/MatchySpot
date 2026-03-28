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
  Switch,
} from 'react-native';
import {
  ArrowLeft,
  ChefHat,
  DollarSign,
  FileText,
  Image as ImageIcon,
  Star,
  Hash,
  Save,
  X,
  AlertTriangle,
  Leaf,
  Wheat,
} from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import { router } from 'expo-router';

type MenuCategory = 'appetizer' | 'main' | 'dessert' | 'drink';

type NewMenuItem = {
  name: string;
  description: string;
  price: string;
  category: MenuCategory;
  imageUrl: string;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isAvailable: boolean;
};

export default function AddMenuItemScreen() {
  const [formData, setFormData] = useState<NewMenuItem>({
    name: '',
    description: '',
    price: '',
    category: 'main',
    imageUrl: '',
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isAvailable: true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof NewMenuItem, string>>>({});

  const categories: { key: MenuCategory; label: string; color: string }[] = [
    { key: 'appetizer', label: 'Appetizer', color: colors.primary },
    { key: 'main', label: 'Main Course', color: colors.success },
    { key: 'dessert', label: 'Dessert', color: colors.accent },
    { key: 'drink', label: 'Drink', color: colors.warning },
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof NewMenuItem, string>> = {};

    if (!formData.name.trim()) newErrors.name = 'Item name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price.trim()) newErrors.price = 'Price is required';
    if (!formData.imageUrl.trim()) newErrors.imageUrl = 'Image URL is required';

    // Validate price
    if (formData.price && isNaN(Number(formData.price))) {
      newErrors.price = 'Must be a valid number';
    }
    if (formData.price && Number(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    // Validate URL format (basic)
    if (formData.imageUrl && !formData.imageUrl.startsWith('http')) {
      newErrors.imageUrl = 'Must be a valid URL starting with http';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      Alert.alert(
        'Success',
        'Menu item added successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    }
  };

  const updateField = <K extends keyof NewMenuItem>(field: K, value: NewMenuItem[K]) => {
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
    field: keyof NewMenuItem;
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
        value={String(formData[field])}
        onChangeText={(value) => updateField(field, value as any)}
        placeholder={placeholder}
        placeholderTextColor={colors.textLight}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
      />
    </View>
  );

  const SwitchField = ({ 
    label, 
    field, 
    icon: Icon,
    description 
  }: {
    label: string;
    field: keyof NewMenuItem;
    icon: any;
    description: string;
  }) => (
    <View style={styles.switchGroup}>
      <View style={styles.switchLeft}>
        <View style={styles.switchLabelContainer}>
          <Icon size={16} color={colors.primary} strokeWidth={2} />
          <View>
            <Text style={styles.switchLabel}>{label}</Text>
            <Text style={styles.switchDescription}>{description}</Text>
          </View>
        </View>
      </View>
      <Switch
        value={formData[field] as boolean}
        onValueChange={(value) => updateField(field, value as any)}
        trackColor={{ false: colors.border, true: colors.primary + '40' }}
        thumbColor={formData[field] ? colors.primary : colors.textLight}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          testID="add-menu-item-back-btn"
        >
          <ArrowLeft size={20} color={colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.title}>Add Menu Item</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          testID="add-menu-item-save-btn"
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
              placeholder="e.g., Grilled Atlantic Salmon"
              icon={ChefHat}
            />

            <InputField
              label="Description"
              field="description"
              placeholder="Fresh Atlantic salmon with lemon herb butter, served with seasonal vegetables..."
              icon={FileText}
              multiline
            />

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <InputField
                  label="Price"
                  field="price"
                  placeholder="28.00"
                  keyboardType="numeric"
                  icon={DollarSign}
                />
              </View>
              <View style={styles.halfWidth}>
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
              </View>
            </View>

            <InputField
              label="Image URL"
              field="imageUrl"
              placeholder="https://images.unsplash.com/photo-..."
              icon={ImageIcon}
            />

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Dietary Information</Text>
              <Text style={styles.sectionSubtitle}>Mark applicable dietary restrictions</Text>
            </View>

            <View style={styles.switchContainer}>
              <SwitchField
                label="Vegetarian"
                field="isVegetarian"
                icon={Leaf}
                description="Contains no meat or fish"
              />
              
              <SwitchField
                label="Vegan"
                field="isVegan"
                icon={Leaf}
                description="Contains no animal products"
              />
              
              <SwitchField
                label="Gluten Free"
                field="isGlutenFree"
                icon={Wheat}
                description="Contains no gluten ingredients"
              />
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Availability</Text>
              <Text style={styles.sectionSubtitle}>Control item visibility</Text>
            </View>

            <SwitchField
              label="Available"
              field="isAvailable"
              icon={Star}
              description="Item is available for ordering"
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
    height: 100,
    textAlignVertical: 'top',
  },
  textInputError: {
    borderColor: colors.error,
    backgroundColor: colors.error + '05',
  },
  categoryContainer: {
    gap: 6,
    paddingVertical: 4,
  },
  categoryChip: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipText: {
    fontSize: 11,
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
  sectionHeader: {
    marginTop: 8,
    marginBottom: 4,
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
  switchContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  switchGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  switchLeft: {
    flex: 1,
  },
  switchLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  switchDescription: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '500',
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