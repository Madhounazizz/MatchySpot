import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function TestQRScreen() {
  const router = useRouter();

  const testQRCodes = [
    { id: '1', name: 'Ocean View Restaurant', code: 'matchspot://brc/1' },
    { id: '2', name: 'Artisan Coffee House', code: 'matchspot://brc/2' },
    { id: '3', name: 'The Rooftop Bar', code: 'matchspot://brc/3' },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF6B6B', '#FF8E53']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Test QR Codes</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <Text style={styles.description}>
          These are test QR codes you can scan with the QR scanner.
          In a real restaurant, these would be printed on tables.
        </Text>

        {testQRCodes.map((item) => (
          <View key={item.id} style={styles.qrCard}>
            <Text style={styles.restaurantName}>{item.name}</Text>
            <View style={styles.qrCodeContainer}>
              <Text style={styles.qrCodeText}>{item.code}</Text>
            </View>
            <Text style={styles.instruction}>
              📱 Use your QR scanner to scan this code
            </Text>
            <TouchableOpacity
              style={styles.directButton}
              onPress={() => router.push(`/menu/${item.id}`)}
            >
              <Text style={styles.directButtonText}>Go to Menu Directly</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.howToUse}>
          <Text style={styles.howToTitle}>How to use:</Text>
          <Text style={styles.howToStep}>1. Go back to home screen</Text>
          <Text style={styles.howToStep}>2. Tap &quot;Scan QR Code to Order&quot;</Text>
          <Text style={styles.howToStep}>3. Point camera at one of the codes above</Text>
          <Text style={styles.howToStep}>4. Menu will open automatically</Text>
          <Text style={styles.howToStep}>5. Add items to cart and place order</Text>
          <Text style={styles.howToStep}>6. Get access code for chatroom</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#FFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  qrCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  qrCodeContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#4ECDC4',
    borderStyle: 'dashed',
  },
  qrCodeText: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#333',
    textAlign: 'center',
  },
  instruction: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  directButton: {
    backgroundColor: '#4ECDC4',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  directButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFF',
  },
  howToUse: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  howToTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#333',
    marginBottom: 12,
  },
  howToStep: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
});