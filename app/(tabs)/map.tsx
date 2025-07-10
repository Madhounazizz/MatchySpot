import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Coffee, Utensils, Wine, Layers, Navigation, Filter } from 'lucide-react-native';
import { Image } from 'expo-image';
import { colors, shadows } from '@/constants/colors';
import { brcs } from '@/mocks/brcs';
import { users } from '@/mocks/users';
import CategoryPills from '@/components/CategoryPills';
import Button from '@/components/Button';

const { width, height } = Dimensions.get('window');

// Mock map component for web compatibility
function MockMap({ children, selectedBRC }: { children: React.ReactNode; selectedBRC?: string }) {
  return (
    <View style={styles.mockMap}>
      <Text style={styles.mockMapText}>Interactive Map</Text>
      <Text style={styles.mockMapSubtext}>Showing nearby places and users</Text>
      
      {/* Mock map pins */}
      <View style={styles.mapPinsContainer}>
        {brcs.slice(0, 4).map((brc, index) => (
          <TouchableOpacity
            key={brc.id}
            style={[
              styles.mapPin,
              {
                top: 100 + (index * 40),
                left: 50 + (index * 60),
              },
              selectedBRC === brc.id && styles.selectedMapPin,
            ]}
          >
            <View style={[styles.pinIcon, { backgroundColor: colors.primary }]}>
              {brc.type === 'restaurant' && <Utensils size={16} color={colors.white} />}
              {brc.type === 'cafe' && <Coffee size={16} color={colors.white} />}
              {brc.type === 'bar' && <Wine size={16} color={colors.white} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>
      
      {children}
    </View>
  );
}

const categories = [
  { id: 'all', name: 'All' },
  { id: 'restaurant', name: 'Restaurants', icon: <Utensils size={16} color={colors.textLight} /> },
  { id: 'cafe', name: 'Cafés', icon: <Coffee size={16} color={colors.textLight} /> },
  { id: 'bar', name: 'Bars', icon: <Wine size={16} color={colors.textLight} /> },
];

export default function MapScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBRC, setSelectedBRC] = useState<string | undefined>(undefined);
  const [showUsers, setShowUsers] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedBRC(undefined);
  };

  const handleBRCPress = (id: string) => {
    setSelectedBRC(selectedBRC === id ? undefined : id);
  };

  const handleViewDetails = () => {
    if (selectedBRC) {
      router.push(`/brc/${selectedBRC}`);
    }
  };

  const handleBookTable = () => {
    if (selectedBRC) {
      router.push(`/booking/index?brcId=${selectedBRC}`);
    }
  };

  const toggleShowUsers = () => {
    setShowUsers(!showUsers);
  };

  const filteredBRCs = selectedCategory === 'all' 
    ? brcs 
    : brcs.filter(brc => brc.type === selectedCategory);

  const selectedBRCData = brcs.find(brc => brc.id === selectedBRC);

  return (
    <View style={styles.container}>
      {/* Map View */}
      <MockMap selectedBRC={selectedBRC}>
        {/* Map Controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity style={styles.controlButton}>
            <Navigation size={20} color={colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.controlButton, showUsers && styles.activeControlButton]}
            onPress={toggleShowUsers}
          >
            <Layers size={20} color={showUsers ? colors.white : colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.controlButton, showFilters && styles.activeControlButton]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} color={showFilters ? colors.white : colors.primary} />
          </TouchableOpacity>
        </View>
      </MockMap>
      
      {/* Category Filter */}
      <View style={styles.categoryContainer}>
        <CategoryPills
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
          containerStyle={styles.categoryPills}
        />
      </View>
      
      {/* Selected BRC Card */}
      {selectedBRCData && (
        <View style={styles.selectedBRCContainer}>
          <View style={styles.selectedBRCCard}>
            <Image
              source={{ uri: selectedBRCData.image }}
              style={styles.selectedBRCImage}
              contentFit="cover"
            />
            
            <View style={styles.selectedBRCInfo}>
              <Text style={styles.selectedBRCName}>{selectedBRCData.name}</Text>
              <Text style={styles.selectedBRCType}>{selectedBRCData.type}</Text>
              
              <View style={styles.selectedBRCDetails}>
                <View style={styles.selectedBRCRating}>
                  <Text style={styles.selectedBRCRatingText}>★ {selectedBRCData.rating}</Text>
                </View>
                
                <Text style={styles.selectedBRCDistance}>{selectedBRCData.distance}</Text>
              </View>
            </View>
            
            <View style={styles.selectedBRCActions}>
              <Button
                title="View"
                variant="outline"
                size="small"
                onPress={handleViewDetails}
                style={styles.actionButton}
              />
              <Button
                title="Book"
                size="small"
                onPress={handleBookTable}
                style={styles.actionButton}
              />
            </View>
          </View>
        </View>
      )}
      
      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        <View style={styles.bottomSheetHandle} />
        
        <View style={styles.bottomSheetHeader}>
          <Text style={styles.bottomSheetTitle}>
            {filteredBRCs.length} {selectedCategory === 'all' ? 'Places' : selectedCategory + 's'} Nearby
          </Text>
          
          <TouchableOpacity style={styles.listToggle}>
            <Text style={styles.listToggleText}>List View</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.brcList} showsVerticalScrollIndicator={false}>
          {filteredBRCs.map((brc) => (
            <TouchableOpacity
              key={brc.id}
              style={[
                styles.brcItem,
                selectedBRC === brc.id && styles.selectedBrcItem,
              ]}
              onPress={() => handleBRCPress(brc.id)}
            >
              <Image
                source={{ uri: brc.image }}
                style={styles.brcItemImage}
                contentFit="cover"
              />
              
              <View style={styles.brcItemInfo}>
                <Text style={styles.brcItemName} numberOfLines={1}>{brc.name}</Text>
                <Text style={styles.brcItemType}>{brc.type}</Text>
                
                <View style={styles.brcItemDetails}>
                  <View style={styles.brcItemRating}>
                    <Text style={styles.brcItemRatingText}>★ {brc.rating}</Text>
                  </View>
                  
                  <Text style={styles.brcItemDistance}>{brc.distance}</Text>
                </View>
              </View>
              
              <View style={styles.brcItemActions}>
                <TouchableOpacity
                  style={styles.quickAction}
                  onPress={() => router.push(`/brc/${brc.id}`)}
                >
                  <Text style={styles.quickActionText}>View</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {/* Filters Modal */}
      {showFilters && (
        <View style={styles.filtersOverlay}>
          <View style={styles.filtersModal}>
            <Text style={styles.filtersTitle}>Filters</Text>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Distance</Text>
              <View style={styles.filterOptions}>
                <TouchableOpacity style={styles.filterOption}>
                  <Text style={styles.filterOptionText}>Within 1 mile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterOption}>
                  <Text style={styles.filterOptionText}>Within 5 miles</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Rating</Text>
              <View style={styles.filterOptions}>
                <TouchableOpacity style={styles.filterOption}>
                  <Text style={styles.filterOptionText}>4.0+ stars</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterOption}>
                  <Text style={styles.filterOptionText}>4.5+ stars</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.filterActions}>
              <Button
                title="Clear"
                variant="outline"
                onPress={() => setShowFilters(false)}
                style={styles.filterActionButton}
              />
              <Button
                title="Apply"
                onPress={() => setShowFilters(false)}
                style={styles.filterActionButton}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  mockMap: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E8EEF4',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  mockMapText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textLight,
  },
  mockMapSubtext: {
    fontSize: 16,
    color: colors.textExtraLight,
    marginTop: 8,
  },
  mapPinsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mapPin: {
    position: 'absolute',
    alignItems: 'center',
  },
  selectedMapPin: {
    transform: [{ scale: 1.2 }],
  },
  pinIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
  mapControls: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  controlButton: {
    backgroundColor: colors.white,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    ...shadows.medium,
  },
  activeControlButton: {
    backgroundColor: colors.primary,
  },
  categoryContainer: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 80,
  },
  categoryPills: {
    paddingTop: 0,
  },
  selectedBRCContainer: {
    position: 'absolute',
    bottom: 280,
    left: 16,
    right: 16,
  },
  selectedBRCCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 12,
    ...shadows.large,
  },
  selectedBRCImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  selectedBRCInfo: {
    flex: 1,
  },
  selectedBRCName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  selectedBRCType: {
    fontSize: 14,
    color: colors.textLight,
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  selectedBRCDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedBRCRating: {
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 8,
  },
  selectedBRCRatingText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  selectedBRCDistance: {
    fontSize: 12,
    color: colors.textLight,
  },
  selectedBRCActions: {
    justifyContent: 'space-between',
  },
  actionButton: {
    width: 60,
    marginBottom: 4,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    height: 240,
    ...shadows.large,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.backgroundDark,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  bottomSheetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  listToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
  },
  listToggleText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  brcList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  brcItem: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  selectedBrcItem: {
    backgroundColor: colors.accent,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  brcItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  brcItemInfo: {
    flex: 1,
  },
  brcItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  brcItemType: {
    fontSize: 13,
    color: colors.textLight,
    textTransform: 'capitalize',
    marginBottom: 6,
  },
  brcItemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brcItemRating: {
    backgroundColor: colors.white,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  brcItemRatingText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
  },
  brcItemDistance: {
    fontSize: 12,
    color: colors.textLight,
  },
  brcItemActions: {
    justifyContent: 'center',
  },
  quickAction: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  quickActionText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  filtersOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersModal: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    width: width - 40,
    maxHeight: height * 0.7,
  },
  filtersTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  filterSection: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  filterOptionText: {
    fontSize: 14,
    color: colors.text,
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterActionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});