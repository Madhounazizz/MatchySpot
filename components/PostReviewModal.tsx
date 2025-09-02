import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import { Star, X, Coins } from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import Button from '@/components/Button';
import { useTokens } from '@/store/useTokenStore';

interface PostReviewModalProps {
  visible: boolean;
  onClose: () => void;
  brcId: string;
  brcName: string;
}

export default function PostReviewModal({ visible, onClose, brcId, brcName }: PostReviewModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { addTokens } = useTokens();

  const handleStarPress = (starIndex: number) => {
    setRating(starIndex + 1);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating for your review.');
      return;
    }

    if (reviewText.trim().length < 10) {
      Alert.alert('Review Too Short', 'Please write at least 10 characters for your review.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Award tokens for posting review
      addTokens(20, 'Review posted', brcId, brcName);
      
      Alert.alert(
        'Review Posted! 🎉',
        'Thank you for your review! You earned 20 tokens.',
        [
          {
            text: 'Great!',
            onPress: () => {
              setRating(0);
              setReviewText('');
              onClose();
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to post review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setReviewText('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Write a Review</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.brcName}>{brcName}</Text>
          
          <View style={styles.rewardInfo}>
            <View style={styles.rewardBadge}>
              <Coins size={16} color={colors.primary} />
              <Text style={styles.rewardText}>Earn 20 tokens</Text>
            </View>
          </View>

          <View style={styles.ratingSection}>
            <Text style={styles.sectionTitle}>How was your experience?</Text>
            <View style={styles.starsContainer}>
              {[...Array(5)].map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleStarPress(index)}
                  style={styles.starButton}
                >
                  <Star
                    size={32}
                    color={index < rating ? colors.primary : colors.backgroundDark}
                    fill={index < rating ? colors.primary : colors.backgroundDark}
                  />
                </TouchableOpacity>
              ))}
            </View>
            {rating > 0 && (
              <Text style={styles.ratingText}>
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </Text>
            )}
          </View>

          <View style={styles.reviewSection}>
            <Text style={styles.sectionTitle}>Tell us more about your visit</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Share your experience, what you liked, what could be improved..."
              placeholderTextColor={colors.textLight}
              value={reviewText}
              onChangeText={setReviewText}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              maxLength={500}
            />
            <Text style={styles.characterCount}>
              {reviewText.length}/500 characters
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={handleClose}
            style={styles.cancelButton}
          />
          <Button
            title={isSubmitting ? "Posting..." : "Post Review"}
            onPress={handleSubmit}
            disabled={isSubmitting || rating === 0 || reviewText.trim().length < 10}
            style={styles.submitButton}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundLight,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  brcName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  rewardInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 4,
  },
  ratingSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  starButton: {
    padding: 4,
    marginHorizontal: 2,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
    textAlign: 'center',
  },
  reviewSection: {
    flex: 1,
  },
  textInput: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.backgroundDark,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'right',
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.backgroundLight,
    ...shadows.medium,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    flex: 2,
  },
});