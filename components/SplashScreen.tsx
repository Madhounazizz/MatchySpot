import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/colors';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    const animationSequence = Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.delay(1200),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]);

    animationSequence.start(() => {
      onFinish();
    });
  }, [fadeAnim, scaleAnim, slideAnim, onFinish]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primaryLight, colors.accent]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>🍽️</Text>
            <Text style={styles.appName}>Matchy</Text>
            <Text style={styles.appNameSecond}>Matchy</Text>
          </View>
          
          <Animated.View
            style={[
              styles.taglineContainer,
              {
                transform: [{ translateY: slideAnim }],
                opacity: fadeAnim,
              },
            ]}
          >
            <Text style={styles.tagline}>Social Hospitality</Text>
            <Text style={styles.subtitle}>Find • Dine • Connect</Text>
          </Animated.View>
        </Animated.View>
        
        <View style={styles.decorativeElements}>
          <View style={[styles.circle, styles.circle1]} />
          <View style={[styles.circle, styles.circle2]} />
          <View style={[styles.circle, styles.circle3]} />
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    zIndex: 2,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  appName: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -1,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  appNameSecond: {
    fontSize: 42,
    fontWeight: '300',
    color: colors.white,
    letterSpacing: -1,
    marginTop: -8,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  taglineContainer: {
    alignItems: 'center',
  },
  tagline: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 8,
    opacity: 0.9,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.white,
    opacity: 0.8,
    letterSpacing: 2,
  },
  decorativeElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  circle: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  circle1: {
    width: 200,
    height: 200,
    top: height * 0.1,
    right: -100,
  },
  circle2: {
    width: 150,
    height: 150,
    bottom: height * 0.2,
    left: -75,
  },
  circle3: {
    width: 100,
    height: 100,
    top: height * 0.3,
    left: width * 0.1,
  },
});