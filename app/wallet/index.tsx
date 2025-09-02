import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { ArrowUp, ArrowDown, Gift, ChevronRight, Coins } from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import Button from '@/components/Button';
import { useTokens } from '@/store/useTokenStore';

export default function WalletScreen() {
  const { balance, transactions, addTokens } = useTokens();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleRedeemReward = (rewardId: string) => {
    console.log('Redeem reward:', rewardId);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Token Balance</Text>
        <View style={styles.balanceRow}>
          <Coins size={22} color={colors.white} />
          <Text style={styles.balanceValue}>{balance}</Text>
        </View>
      </View>
      
      <View style={styles.rewardsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Earn</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rewardsScroll}>
          <View style={styles.rewardCard}>
            <View style={styles.rewardHeader}>
              <Gift size={20} color={colors.primary} />
              <Text style={styles.rewardPoints}>+50</Text>
            </View>
            <Text style={styles.rewardName}>Referral Complete</Text>
            <Text style={styles.rewardVenue}>Both you and friend</Text>
            <Button title="Claim +50" size="small" onPress={() => addTokens(50, 'Referral reward')} style={styles.redeemButton} />
          </View>
          <View style={styles.rewardCard}>
            <View style={styles.rewardHeader}>
              <Gift size={20} color={colors.primary} />
              <Text style={styles.rewardPoints}>+20</Text>
            </View>
            <Text style={styles.rewardName}>Post a Review</Text>
            <Text style={styles.rewardVenue}>Any BRC</Text>
            <Button title="Open Reviews" size="small" onPress={() => {}} style={styles.redeemButton} />
          </View>
          <View style={styles.rewardCard}>
            <View style={styles.rewardHeader}>
              <Gift size={20} color={colors.primary} />
              <Text style={styles.rewardPoints}>-20</Text>
            </View>
            <Text style={styles.rewardName}>Book a Table</Text>
            <Text style={styles.rewardVenue}>Reservation cost</Text>
            <Button title="Book Now" size="small" onPress={() => {}} style={styles.redeemButton} />
          </View>
        </ScrollView>
      </View>
      
      <View style={styles.transactionsContainer}>
        <Text style={styles.sectionTitle}>Transaction History</Text>
        {transactions.length === 0 ? (
          <Text style={{ color: colors.textLight }}>No transactions yet</Text>
        ) : (
          transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionIconContainer}>
                {transaction.type === 'earn' ? (
                  <ArrowUp size={20} color={colors.success} />
                ) : (
                  <ArrowDown size={20} color={colors.error} />
                )}
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionDescription}>{transaction.description}</Text>
                {transaction.brcName && (
                  <Text style={styles.transactionVenue}>{transaction.brcName}</Text>
                )}
                <Text style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  transaction.type === 'earn' ? styles.earnAmount : styles.spendAmount,
                ]}
              >
                {transaction.type === 'earn' ? '+' : '-'}{transaction.amount}
              </Text>
            </View>
          ))
        )}
      </View>
      
      <View style={styles.earnPointsContainer}>
        <Text style={styles.earnPointsTitle}>Ways to Earn Points</Text>
        
        <View style={styles.earnPointsItem}>
          <View style={styles.earnPointsIconContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }}
              style={styles.earnPointsIcon}
              contentFit="cover"
            />
          </View>
          
          <View style={styles.earnPointsInfo}>
            <Text style={styles.earnPointsName}>Visit a Place</Text>
            <Text style={styles.earnPointsDescription}>
              Earn 100-200 points for each visit to a partner venue
            </Text>
          </View>
          
          <Text style={styles.earnPointsValue}>+100</Text>
        </View>
        
        <View style={styles.earnPointsItem}>
          <View style={styles.earnPointsIconContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }}
              style={styles.earnPointsIcon}
              contentFit="cover"
            />
          </View>
          
          <View style={styles.earnPointsInfo}>
            <Text style={styles.earnPointsName}>Match with Someone</Text>
            <Text style={styles.earnPointsDescription}>
              Earn 50 points for each successful match
            </Text>
          </View>
          
          <Text style={styles.earnPointsValue}>+50</Text>
        </View>
        
        <View style={styles.earnPointsItem}>
          <View style={styles.earnPointsIconContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }}
              style={styles.earnPointsIcon}
              contentFit="cover"
            />
          </View>
          
          <View style={styles.earnPointsInfo}>
            <Text style={styles.earnPointsName}>Write a Review</Text>
            <Text style={styles.earnPointsDescription}>
              Earn 75 points for each review you post
            </Text>
          </View>
          
          <Text style={styles.earnPointsValue}>+75</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  balanceCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    margin: 16,
    ...shadows.medium,
  },
  balanceLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  balanceValue: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 0,
  },
  statsRow: {
    display: 'none',
  },
  statItem: {
    display: 'none',
  },
  statLabel: {
    display: 'none',
  },
  statValue: {
    display: 'none',
  },
  statDivider: {
    display: 'none',
  },
  rewardsContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    marginRight: 2,
  },
  rewardsScroll: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  rewardCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    width: 180,
    marginRight: 12,
    ...shadows.small,
  },
  rewardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rewardPoints: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  rewardName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  rewardVenue: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 12,
  },
  redeemButton: {
    width: '100%',
  },
  transactionsContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    margin: 16,
    marginTop: 0,
    ...shadows.small,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundLight,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  transactionVenue: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: colors.textExtraLight,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  earnAmount: {
    color: colors.success,
  },
  spendAmount: {
    color: colors.error,
  },
  earnPointsContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    margin: 16,
    marginTop: 0,
    marginBottom: 30,
    ...shadows.small,
  },
  earnPointsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  earnPointsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  earnPointsIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    marginRight: 12,
  },
  earnPointsIcon: {
    width: '100%',
    height: '100%',
  },
  earnPointsInfo: {
    flex: 1,
  },
  earnPointsName: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  earnPointsDescription: {
    fontSize: 13,
    color: colors.textLight,
  },
  earnPointsValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.success,
  },
});