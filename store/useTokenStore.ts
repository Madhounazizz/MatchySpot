import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TokenTransaction {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  description: string;
  date: string;
  brcId?: string;
  brcName?: string;
}

export const [TokenProvider, useTokens] = createContextHook(() => {
  const [balance, setBalance] = useState<number>(100); // Start with 100 tokens
  const [transactions, setTransactions] = useState<TokenTransaction[]>([
    {
      id: '1',
      type: 'earn',
      amount: 100,
      description: 'Welcome bonus',
      date: new Date().toISOString(),
    },
  ]);

  // Load persisted data
  useEffect(() => {
    const loadTokenData = async () => {
      try {
        const storedBalance = await AsyncStorage.getItem('token-balance');
        const storedTransactions = await AsyncStorage.getItem('token-transactions');
        
        if (storedBalance) {
          setBalance(parseInt(storedBalance, 10));
        }
        
        if (storedTransactions) {
          setTransactions(JSON.parse(storedTransactions));
        }
      } catch (error) {
        console.error('Error loading token data:', error);
      }
    };
    
    loadTokenData();
  }, []);

  // Persist data when it changes
  useEffect(() => {
    const saveTokenData = async () => {
      try {
        await AsyncStorage.setItem('token-balance', balance.toString());
        await AsyncStorage.setItem('token-transactions', JSON.stringify(transactions));
      } catch (error) {
        console.error('Error saving token data:', error);
      }
    };
    
    saveTokenData();
  }, [balance, transactions]);

  const addTokens = useCallback((amount: number, description: string, brcId?: string, brcName?: string) => {
    const newTransaction: TokenTransaction = {
      id: Date.now().toString(),
      type: 'earn',
      amount,
      description,
      date: new Date().toISOString(),
      brcId,
      brcName,
    };
    
    setBalance(prev => prev + amount);
    setTransactions(prev => [newTransaction, ...prev]);
    
    console.log(`Added ${amount} tokens: ${description}`);
  }, []);

  const spendTokens = useCallback((amount: number, description: string, brcId?: string, brcName?: string): boolean => {
    if (balance < amount) {
      console.log(`Insufficient tokens. Need ${amount}, have ${balance}`);
      return false;
    }
    
    const newTransaction: TokenTransaction = {
      id: Date.now().toString(),
      type: 'spend',
      amount,
      description,
      date: new Date().toISOString(),
      brcId,
      brcName,
    };
    
    setBalance(prev => prev - amount);
    setTransactions(prev => [newTransaction, ...prev]);
    
    console.log(`Spent ${amount} tokens: ${description}`);
    return true;
  }, [balance]);

  const hasEnoughTokens = useCallback((amount: number): boolean => {
    return balance >= amount;
  }, [balance]);

  const getTransactionHistory = useCallback((): TokenTransaction[] => {
    return transactions;
  }, [transactions]);

  return useMemo(() => ({
    balance,
    transactions,
    addTokens,
    spendTokens,
    hasEnoughTokens,
    getTransactionHistory,
  }), [balance, transactions, addTokens, spendTokens, hasEnoughTokens, getTransactionHistory]);
});