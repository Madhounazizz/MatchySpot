import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, TextInput, Platform } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Calendar, Clock, Users, CreditCard, ChevronRight, MapPin, ArrowLeft, Check, Star, MessageSquare, Shield, Coins } from 'lucide-react-native';
import { Image } from 'expo-image';
import { colors, shadows } from '@/constants/colors';
import Button from '@/components/Button';
import { brcs } from '@/mocks/brcs';
import { useTokens } from '@/store/useTokenStore';

const timeSlots = [
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
];

const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8];

export default function BookingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ brcId?: string }>();
  const brcId = params.brcId;
  const { balance, spendTokens, hasEnoughTokens } = useTokens();
  
  console.log('BookingScreen - brcId:', brcId);
  console.log('BookingScreen - all params:', params);
  const [selectedDate, setSelectedDate] = useState('today');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [step, setStep] = useState(1);
  const [selectedTable, setSelectedTable] = useState('');
  const [specialRequest, setSpecialRequest] = useState('');
  const [showSpecialRequests, setShowSpecialRequests] = useState(false);
  
  const selectedBRC = brcId ? brcs.find(brc => brc.id === brcId) : brcs[0];
  
  console.log('Selected BRC:', selectedBRC?.name || 'None found');
  
  if (!selectedBRC) {
    console.error('No BRC found for booking');
  }
  
  const handleTimeSelect = (selectedTime: string) => {
    console.log('Time selected:', selectedTime);
    setTime(selectedTime);
  };
  
  const handleGuestSelect = (count: number) => {
    setGuests(count);
  };
  
  const handleContinue = () => {
    console.log('Continue pressed - Step:', step, 'Time:', time, 'Table:', selectedTable);
    
    if (step === 1 && time) {
      console.log('Moving to step 2');
      setStep(2);
    } else if (step === 2 && selectedTable) {
      console.log('Moving to step 3');
      setStep(3);
    } else if (step === 3) {
      console.log('Completing booking');
      
      // Check if user has enough tokens
      if (!hasEnoughTokens(20)) {
        Alert.alert(
          'Insufficient Tokens',
          `You need 20 tokens to make a reservation. You currently have ${balance} tokens. Earn more tokens by posting reviews!`,
          [{ text: 'OK' }]
        );
        return;
      }
      
      // Deduct tokens for reservation
      const success = spendTokens(20, 'Table reservation', selectedBRC?.id, selectedBRC?.name);
      
      if (success) {
        // Complete booking - navigate to success screen
        router.push({
          pathname: '/booking/success',
          params: {
            brcId: selectedBRC?.id,
            date: getDateText(),
            time: time,
            guests: guests.toString(),
            table: selectedTable,
          },
        });
      } else {
        Alert.alert('Error', 'Failed to process reservation. Please try again.');
      }
    } else {
      console.log('Cannot continue - missing requirements:', { step, time, selectedTable });
      // Show helpful message
      if (step === 1 && !time) {
        Alert.alert('Select Time', 'Please select a time slot to continue.');
      } else if (step === 2 && !selectedTable) {
        Alert.alert('Choose Table', 'Please select a table to continue.');
      }
    }
  };
  
  const handleBack = () => {
    if (step === 3) {
      setStep(2);
    } else if (step === 2) {
      setStep(1);
    } else {
      router.back();
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Select Date & Time';
      case 2: return 'Choose Your Table';
      case 3: return 'Confirm Booking';
      default: return '';
    }
  };

  const getDateText = () => {
    switch (selectedDate) {
      case 'today': return 'Today, Jul 9';
      case 'tomorrow': return 'Tomorrow, Jul 10';
      case 'saturday': return 'Saturday, Jul 11';
      case 'sunday': return 'Sunday, Jul 12';
      default: return 'Today, Jul 9';
    }
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleTableSelect = (tableName: string) => {
    console.log('Table selected:', tableName);
    setSelectedTable(tableName);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Book a Table',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '600' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {selectedBRC && (
          <View style={styles.brcHeader}>
            <Image
              source={{ uri: selectedBRC.image }}
              style={styles.brcImage}
              contentFit="cover"
            />
            <View style={styles.brcInfo}>
              <Text style={styles.brcName}>{selectedBRC.name}</Text>
              <View style={styles.brcLocation}>
                <MapPin size={14} color={colors.textLight} />
                <Text style={styles.brcAddress}>{selectedBRC.address}</Text>
              </View>
              <View style={styles.brcRating}>
                <Star size={14} color={colors.warning} fill={colors.warning} />
                <Text style={styles.brcRatingText}>{selectedBRC.rating}</Text>
                <Text style={styles.brcReviewCount}>({selectedBRC.reviewCount} reviews)</Text>
              </View>
            </View>
          </View>
        )}
        
        <View style={styles.stepIndicator}>
          <View style={styles.stepContainer}>
            <View style={[styles.stepDot, styles.activeStep]} />
            <Text style={[styles.stepLabel, styles.activeStepLabel]}>Date & Time</Text>
          </View>
          <View style={[styles.stepLine, step >= 2 && styles.activeStepLine]} />
          <View style={styles.stepContainer}>
            <View style={[styles.stepDot, step >= 2 && styles.activeStep]} />
            <Text style={[styles.stepLabel, step >= 2 && styles.activeStepLabel]}>Table</Text>
          </View>
          <View style={[styles.stepLine, step === 3 && styles.activeStepLine]} />
          <View style={styles.stepContainer}>
            <View style={[styles.stepDot, step === 3 && styles.activeStep]} />
            <Text style={[styles.stepLabel, step === 3 && styles.activeStepLabel]}>Confirm</Text>
          </View>
        </View>
        
        <Text style={styles.stepTitle}>{getStepTitle()}</Text>
        
        {step === 1 ? (
          <>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Calendar size={20} color={colors.primary} />
                <Text style={styles.sectionTitle}>Date</Text>
              </View>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateSelector}>
                <TouchableOpacity 
                  style={[styles.dateOption, selectedDate === 'today' && styles.activeDateOption]}
                  onPress={() => handleDateSelect('today')}
                >
                  <Text style={[styles.dateText, selectedDate === 'today' && styles.activeDateText]}>Today</Text>
                  <Text style={[styles.dateSubtext, selectedDate === 'today' && styles.activeDateSubtext]}>Jul 9</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.dateOption, selectedDate === 'tomorrow' && styles.activeDateOption]}
                  onPress={() => handleDateSelect('tomorrow')}
                >
                  <Text style={[styles.dateText, selectedDate === 'tomorrow' && styles.activeDateText]}>Tomorrow</Text>
                  <Text style={[styles.dateSubtext, selectedDate === 'tomorrow' && styles.activeDateSubtext]}>Jul 10</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.dateOption, selectedDate === 'saturday' && styles.activeDateOption]}
                  onPress={() => handleDateSelect('saturday')}
                >
                  <Text style={[styles.dateText, selectedDate === 'saturday' && styles.activeDateText]}>Saturday</Text>
                  <Text style={[styles.dateSubtext, selectedDate === 'saturday' && styles.activeDateSubtext]}>Jul 11</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.dateOption, selectedDate === 'sunday' && styles.activeDateOption]}
                  onPress={() => handleDateSelect('sunday')}
                >
                  <Text style={[styles.dateText, selectedDate === 'sunday' && styles.activeDateText]}>Sunday</Text>
                  <Text style={[styles.dateSubtext, selectedDate === 'sunday' && styles.activeDateSubtext]}>Jul 12</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.dateOption}>
                  <Text style={styles.dateText}>More</Text>
                  <ChevronRight size={16} color={colors.textLight} />
                </TouchableOpacity>
              </ScrollView>
            </View>
            
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Clock size={20} color={colors.primary} />
                <Text style={styles.sectionTitle}>Time</Text>
              </View>
              
              <View style={styles.timeSelector}>
                {timeSlots.map((slot) => (
                  <TouchableOpacity
                    key={slot}
                    style={[
                      styles.timeOption,
                      time === slot && styles.activeTimeOption,
                    ]}
                    onPress={() => handleTimeSelect(slot)}
                  >
                    <Text
                      style={[
                        styles.timeText,
                        time === slot && styles.activeTimeText,
                      ]}
                    >
                      {slot}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Users size={20} color={colors.primary} />
                <Text style={styles.sectionTitle}>Number of Guests</Text>
              </View>
              
              <View style={styles.guestSelector}>
                {guestOptions.map((count) => (
                  <TouchableOpacity
                    key={count}
                    style={[
                      styles.guestOption,
                      guests === count && styles.activeGuestOption,
                    ]}
                    onPress={() => handleGuestSelect(count)}
                  >
                    <Text
                      style={[
                        styles.guestText,
                        guests === count && styles.activeGuestText,
                      ]}
                    >
                      {count}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        ) : step === 2 ? (
          <View style={styles.tableSelection}>
            <View style={styles.sectionHeader}>
              <Users size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Available Tables</Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.tableOption, selectedTable === 'Window Table' && styles.selectedTableOption]}
              onPress={() => handleTableSelect('Window Table')}
            >
              <View style={styles.tableImageContainer}>
                <View style={[styles.tableIcon, { backgroundColor: colors.accent }]}>
                  <Text style={styles.tableEmoji}>🪟</Text>
                </View>
              </View>
              <View style={styles.tableInfo}>
                <Text style={styles.tableName}>Window Table</Text>
                <Text style={styles.tableDescription}>Perfect for 2-4 people with a great view</Text>
                <View style={styles.tableFeatures}>
                  <Text style={styles.tableFeature}>• Natural light</Text>
                  <Text style={styles.tableFeature}>• Street view</Text>
                </View>
                <Text style={styles.tablePrice}>No additional charge</Text>
              </View>
              {selectedTable === 'Window Table' && (
                <View style={styles.selectedIndicator}>
                  <Check size={20} color={colors.white} />
                </View>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tableOption, selectedTable === 'Cozy Corner' && styles.selectedTableOption]}
              onPress={() => handleTableSelect('Cozy Corner')}
            >
              <View style={styles.tableImageContainer}>
                <View style={[styles.tableIcon, { backgroundColor: colors.accent }]}>
                  <Text style={styles.tableEmoji}>💕</Text>
                </View>
              </View>
              <View style={styles.tableInfo}>
                <Text style={styles.tableName}>Cozy Corner</Text>
                <Text style={styles.tableDescription}>Intimate setting for couples</Text>
                <View style={styles.tableFeatures}>
                  <Text style={styles.tableFeature}>• Romantic ambiance</Text>
                  <Text style={styles.tableFeature}>• Quiet area</Text>
                </View>
                <Text style={styles.tablePrice}>No additional charge</Text>
              </View>
              {selectedTable === 'Cozy Corner' && (
                <View style={styles.selectedIndicator}>
                  <Check size={20} color={colors.white} />
                </View>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tableOption, selectedTable === 'Bar Seating' && styles.selectedTableOption]}
              onPress={() => handleTableSelect('Bar Seating')}
            >
              <View style={styles.tableImageContainer}>
                <View style={[styles.tableIcon, { backgroundColor: colors.accent }]}>
                  <Text style={styles.tableEmoji}>🍸</Text>
                </View>
              </View>
              <View style={styles.tableInfo}>
                <Text style={styles.tableName}>Bar Seating</Text>
                <Text style={styles.tableDescription}>Great for watching the kitchen action</Text>
                <View style={styles.tableFeatures}>
                  <Text style={styles.tableFeature}>• Chef's view</Text>
                  <Text style={styles.tableFeature}>• Interactive dining</Text>
                </View>
                <Text style={styles.tablePrice}>No additional charge</Text>
              </View>
              {selectedTable === 'Bar Seating' && (
                <View style={styles.selectedIndicator}>
                  <Check size={20} color={colors.white} />
                </View>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tableOption, selectedTable === 'Private Booth' && styles.selectedTableOption]}
              onPress={() => handleTableSelect('Private Booth')}
            >
              <View style={styles.tableImageContainer}>
                <View style={[styles.tableIcon, { backgroundColor: colors.accent }]}>
                  <Text style={styles.tableEmoji}>👑</Text>
                </View>
              </View>
              <View style={styles.tableInfo}>
                <Text style={styles.tableName}>Private Booth</Text>
                <Text style={styles.tableDescription}>Exclusive seating for special occasions</Text>
                <View style={styles.tableFeatures}>
                  <Text style={styles.tableFeature}>• Complete privacy</Text>
                  <Text style={styles.tableFeature}>• Premium service</Text>
                </View>
                <Text style={styles.tablePricePremium}>+$25 premium</Text>
              </View>
              {selectedTable === 'Private Booth' && (
                <View style={styles.selectedIndicator}>
                  <Check size={20} color={colors.white} />
                </View>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.confirmationContainer}>
            <View style={styles.bookingSummary}>
              <Text style={styles.bookingTitle}>{selectedBRC?.name}</Text>
              <Text style={styles.bookingSubtitle}>{selectedBRC?.address}</Text>
              
              <View style={styles.bookingDetails}>
                <View style={styles.bookingDetailItem}>
                  <Calendar size={16} color={colors.textLight} />
                  <Text style={styles.bookingDetailText}>{getDateText()}</Text>
                </View>
                
                <View style={styles.bookingDetailItem}>
                  <Clock size={16} color={colors.textLight} />
                  <Text style={styles.bookingDetailText}>{time}</Text>
                </View>
                
                <View style={styles.bookingDetailItem}>
                  <Users size={16} color={colors.textLight} />
                  <Text style={styles.bookingDetailText}>{guests} guests</Text>
                </View>
                
                <View style={styles.bookingDetailItem}>
                  <MapPin size={16} color={colors.textLight} />
                  <Text style={styles.bookingDetailText}>{selectedTable}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.paymentSection}>
              <View style={styles.sectionHeader}>
                <CreditCard size={20} color={colors.primary} />
                <Text style={styles.sectionTitle}>Payment Method</Text>
              </View>
              
              <TouchableOpacity style={styles.paymentOption}>
                <View style={styles.paymentCard}>
                  <Text style={styles.paymentCardType}>Visa</Text>
                  <Text style={styles.paymentCardNumber}>•••• 4582</Text>
                </View>
                <ChevronRight size={20} color={colors.textLight} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.specialRequests}>
              <TouchableOpacity 
                style={styles.specialRequestsHeader}
                onPress={() => setShowSpecialRequests(!showSpecialRequests)}
              >
                <View style={styles.specialRequestsHeaderContent}>
                  <MessageSquare size={20} color={colors.primary} />
                  <Text style={styles.specialRequestsTitle}>Special Requests</Text>
                </View>
                <ChevronRight 
                  size={16} 
                  color={colors.primary} 
                  style={[styles.chevron, showSpecialRequests && styles.chevronRotated]} 
                />
              </TouchableOpacity>
              
              {showSpecialRequests && (
                <View style={styles.specialRequestsInput}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Any dietary restrictions, allergies, or special occasions?"
                    placeholderTextColor={colors.textLight}
                    value={specialRequest}
                    onChangeText={setSpecialRequest}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>
              )}
            </View>
            
            <View style={styles.cancellationPolicy}>
              <View style={styles.policyHeader}>
                <Shield size={20} color={colors.info} />
                <Text style={styles.cancellationTitle}>Cancellation Policy</Text>
              </View>
              <View style={styles.policyContent}>
                <Text style={styles.cancellationText}>
                  • Free cancellation up to 2 hours before your reservation
                </Text>
                <Text style={styles.cancellationText}>
                  • Late cancellations may be subject to a $15 fee
                </Text>
                <Text style={styles.cancellationText}>
                  • No-shows will be charged the full deposit amount
                </Text>
              </View>
            </View>
            
            <View style={styles.totalSection}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Reservation Cost</Text>
                <View style={styles.tokenCost}>
                  <Coins size={16} color={colors.primary} />
                  <Text style={styles.tokenCostText}>20 tokens</Text>
                </View>
              </View>
              {selectedTable === 'Private Booth' && (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Table Premium</Text>
                  <Text style={styles.totalValue}>$25.00</Text>
                </View>
              )}
              <View style={[styles.totalRow, styles.totalRowFinal]}>
                <Text style={styles.totalLabelFinal}>Total Cost</Text>
                <View style={styles.totalCostContainer}>
                  <View style={styles.tokenCost}>
                    <Coins size={18} color={colors.primary} />
                    <Text style={styles.totalTokenCost}>20 tokens</Text>
                  </View>
                  {selectedTable === 'Private Booth' && (
                    <Text style={styles.totalValueFinal}>+ $25.00</Text>
                  )}
                </View>
              </View>
              
              <View style={styles.balanceInfo}>
                <Text style={styles.balanceLabel}>Your Balance:</Text>
                <View style={styles.balanceAmount}>
                  <Coins size={16} color={hasEnoughTokens(20) ? colors.success : colors.error} />
                  <Text style={[styles.balanceText, { color: hasEnoughTokens(20) ? colors.success : colors.error }]}>
                    {balance} tokens
                  </Text>
                </View>
              </View>
              
              {!hasEnoughTokens(20) && (
                <View style={styles.insufficientTokensWarning}>
                  <Text style={styles.warningText}>
⚠️ You need 20 tokens to make this reservation. Post reviews to earn more tokens!
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.footer}>
        {step > 1 && (
          <Button
            title="Back"
            variant="outline"
            onPress={handleBack}
            style={styles.backButton}
          />
        )}
        
        <Button
          title={step === 3 ? "Confirm Booking" : "Continue"}
          onPress={handleContinue}
          disabled={(step === 1 && !time) || (step === 2 && !selectedTable)}
          style={step > 1 ? styles.continueButton : styles.fullWidthButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  brcHeader: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundDark,
  },
  brcImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  brcInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  brcName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  brcLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brcAddress: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 4,
  },
  brcRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  brcRatingText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 4,
  },
  brcReviewCount: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 4,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.backgroundDark,
    marginBottom: 8,
  },
  activeStep: {
    backgroundColor: colors.primary,
  },
  stepLabel: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    fontWeight: '500',
  },
  activeStepLabel: {
    color: colors.primary,
    fontWeight: '600',
  },
  stepLine: {
    height: 2,
    backgroundColor: colors.backgroundDark,
    flex: 1,
    marginHorizontal: 8,
    marginTop: 12,
  },
  activeStepLine: {
    backgroundColor: colors.primary,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  dateSelector: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: -8,
  },
  dateOption: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.backgroundLight,
    minWidth: 70,
    marginRight: 12,
  },
  activeDateOption: {
    backgroundColor: colors.primary,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  activeDateText: {
    color: colors.white,
  },
  dateSubtext: {
    fontSize: 12,
    color: colors.textLight,
  },
  activeDateSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  timeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeOption: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: colors.backgroundLight,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    minWidth: 70,
    alignItems: 'center',
  },
  activeTimeOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
    ...shadows.small,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  activeTimeText: {
    color: colors.white,
  },
  guestSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  guestOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeGuestOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
    ...shadows.small,
  },
  guestText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  activeGuestText: {
    color: colors.white,
  },
  tableSelection: {
    paddingHorizontal: 16,
  },
  tableOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.card,
  },
  selectedTableOption: {
    borderColor: colors.primary,
    backgroundColor: colors.accent,
    ...shadows.medium,
  },
  tableImageContainer: {
    marginRight: 12,
    alignItems: 'center',
  },
  tableIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableEmoji: {
    fontSize: 20,
  },
  tableInfo: {
    flex: 1,
  },
  tableName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  tableDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  tableFeatures: {
    marginBottom: 8,
  },
  tableFeature: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 2,
  },
  tablePrice: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '500',
    marginTop: 4,
  },
  tablePricePremium: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  selectedIndicator: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 8,
    marginLeft: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  confirmationContainer: {
    paddingHorizontal: 16,
  },
  bookingSummary: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  bookingTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  bookingSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 16,
  },
  bookingDetails: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
  },
  bookingDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookingDetailText: {
    fontSize: 15,
    color: colors.text,
    marginLeft: 10,
  },
  paymentSection: {
    marginBottom: 24,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentCardType: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginRight: 8,
  },
  paymentCardNumber: {
    fontSize: 16,
    color: colors.textLight,
  },
  specialRequests: {
    marginBottom: 24,
  },
  specialRequestsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
  },
  specialRequestsHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  specialRequestsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  chevron: {
    transform: [{ rotate: '0deg' }],
  },
  chevronRotated: {
    transform: [{ rotate: '90deg' }],
  },
  specialRequestsInput: {
    marginTop: 12,
  },
  textInput: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.backgroundDark,
    minHeight: 80,
    ...Platform.select({
      ios: {
        paddingTop: 16,
      },
    }),
  },
  cancellationPolicy: {
    marginBottom: 24,
  },
  policyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cancellationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  policyContent: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
  },
  cancellationText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textLight,
    marginBottom: 4,
  },
  totalSection: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalRowFinal: {
    borderTopWidth: 1,
    borderTopColor: colors.backgroundDark,
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 15,
    color: colors.textLight,
  },
  totalValue: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
  },
  totalLabelFinal: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  totalValueFinal: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.backgroundLight,
    ...shadows.medium,
  },
  backButton: {
    flex: 1,
    marginRight: 8,
  },
  continueButton: {
    flex: 2,
  },
  fullWidthButton: {
    flex: 1,
  },
  tokenCost: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenCostText: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  totalCostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalTokenCost: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '700',
    marginLeft: 4,
  },
  balanceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.backgroundDark,
  },
  balanceLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  balanceAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  insufficientTokensWarning: {
    backgroundColor: colors.error + '20',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  warningText: {
    fontSize: 13,
    color: colors.error,
    textAlign: 'center',
  },
});