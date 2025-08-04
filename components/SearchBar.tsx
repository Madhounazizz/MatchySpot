import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { Search, MapPin, Sliders } from 'lucide-react-native';
import { colors } from '@/constants/colors';

type SearchBarProps = {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onSearch?: (text: string) => void;
  onFilterPress?: () => void;
  onLocationPress?: () => void;
};

export default function SearchBar({
  placeholder = 'Search bars, restaurants, cafés...',
  value,
  onChangeText,
  onSearch,
  onFilterPress,
  onLocationPress,
}: SearchBarProps) {
  const [internalSearchText, setInternalSearchText] = React.useState('');
  const searchText = value !== undefined ? value : internalSearchText;

  const handleChangeText = (text: string) => {
    if (value === undefined) {
      setInternalSearchText(text);
    }
    if (onChangeText) {
      onChangeText(text);
    }
    if (onSearch) {
      onSearch(text);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchIconContainer}>
        <Search size={20} color={colors.textLight} />
      </View>
      
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.textExtraLight}
        value={searchText}
        onChangeText={handleChangeText}
      />
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={onLocationPress}
          hitSlop={8}
        >
          <MapPin size={20} color={colors.primary} />
        </TouchableOpacity>
        
        <View style={styles.divider} />
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={onFilterPress}
          hitSlop={8}
        >
          <Sliders size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIconContainer: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    paddingVertical: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 4,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: colors.backgroundDark,
    marginHorizontal: 8,
  },
});