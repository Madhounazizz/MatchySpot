import React, { useState } from 'react';
import { StyleSheet, View, Text, Animated, PanResponder, Dimensions, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Heart, Star, MapPin, Calendar, Coffee, QrCode } from 'lucide-react-native';
import { colors, shadows } from '@/constants/colors';
import Button from '@/components/Button';
import { users } from '@/mocks/users';
import { brcs } from '@/mocks/brcs';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = height * 0.6;
const SWIPE_THRESHOLD = width * 0.3;

export default function DiscoverScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = new Animated.ValueXY();
  const rotate = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD * 2, 0, SWIPE_THRESHOLD * 2],
    outputRange: ['-30deg', '0deg', '30deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const nextCardScale = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD * 2, 0, SWIPE_THRESHOLD * 2],
    outputRange: [1, 0.9, 1],
    extrapolate: 'clamp',
  });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        swipeRight();
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        swipeLeft();
      } else {
        resetPosition();
      }
    },
  });

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const swipeLeft = () => {
    Animated.timing(position, {
      toValue: { x: -width * 1.5, y: 0 },
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      position.setValue({ x: 0, y: 0 });
    });
  };

  const swipeRight = () => {
    Animated.timing(position, {
      toValue: { x: width * 1.5, y: 0 },
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      position.setValue({ x: 0, y: 0 });
    });
  };

  const renderCards = () => {
    if (currentIndex >= users.length) {
      return (
        <View style={styles.noMoreCardsContainer}>
          <Text style={styles.noMoreCardsText}>No more matches today!</Text>
          <Text style={styles.noMoreCardsSubtext}>Check back later for new people</Text>
          <Button 
            title="Refresh" 
            onPress={() => setCurrentIndex(0)} 
            style={{ marginTop: 20 }}
          />
        </View>
      );
    }

    return users.map((user, index) => {
      if (index < currentIndex) return null;

      if (index === currentIndex) {
        return (
          <Animated.View
            key={user.id}
            style={[
              styles.card,
              {
                transform: [
                  { translateX: position.x },
                  { translateY: position.y },
                  { rotate },
                ],
              },
            ]}
            {...panResponder.panHandlers}
          >
            <DiscoverCard user={user} />
            <Animated.View
              style={[
                styles.likeContainer,
                { opacity: likeOpacity },
              ]}
            >
              <Text style={styles.likeText}>LIKE</Text>
            </Animated.View>
            <Animated.View
              style={[
                styles.nopeContainer,
                { opacity: nopeOpacity },
              ]}
            >
              <Text style={styles.nopeText}>NOPE</Text>
            </Animated.View>
          </Animated.View>
        );
      }

      if (index === currentIndex + 1) {
        return (
          <Animated.View
            key={user.id}
            style={[
              styles.card,
              {
                transform: [{ scale: nextCardScale }],
                zIndex: -1,
              },
            ]}
          >
            <DiscoverCard user={user} />
          </Animated.View>
        );
      }

      return null;
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardsContainer}>
        {renderCards()}
      </View>
      
      <View style={styles.buttonsContainer}>
        <Button
          title="Skip"
          variant="outline"
          onPress={swipeLeft}
          icon={<X size={20} color={colors.primary} />}
          style={styles.actionButton}
        />
        <Button
          title="Like"
          onPress={swipeRight}
          icon={<Heart size={20} color={colors.white} />}
          style={styles.actionButton}
        />
      </View>
    </View>
  );
}

function DiscoverCard({ user }: { user: typeof users[0] }) {
  // Get a random BRC to suggest for this user
  const suggestedBRC = brcs[Math.floor(Math.random() * brcs.length)];
  
  return (
    <View style={styles.cardContent}>
      <Image source={{ uri: user.avatar }} style={styles.userImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      />
      
      <View style={styles.userInfo}>
        <View style={styles.nameContainer}>
          <Text style={styles.userName}>{user.name}</Text>
          {user.isOnline && <View style={styles.onlineIndicator} />}
        </View>
        
        {user.bio && <Text style={styles.userBio}>{user.bio}</Text>}
        
        <View style={styles.interestsContainer}>
          {user.interests.map((interest, index) => (
            <View key={index} style={styles.interestTag}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.matchContainer}>
          <Text style={styles.matchLabel}>Match</Text>
          <View style={styles.matchBar}>
            <View 
              style={[
                styles.matchFill, 
                { width: `${user.matchPercentage}%` }
              ]} 
            />
          </View>
          <Text style={styles.matchPercentage}>{user.matchPercentage}%</Text>
        </View>
        
        <View style={styles.divider} />
        
        <Text style={styles.suggestedTitle}>Suggested Meetup</Text>
        
        <View style={styles.brcSuggestion}>
          <Image source={{ uri: suggestedBRC.image }} style={styles.brcImage} />
          
          <View style={styles.brcInfo}>
            <Text style={styles.brcName}>{suggestedBRC.name}</Text>
            
            <View style={styles.brcDetails}>
              <View style={styles.brcDetail}>
                <Star size={14} color={colors.primary} fill={colors.primary} />
                <Text style={styles.brcDetailText}>{suggestedBRC.rating}</Text>
              </View>
              
              <View style={styles.brcDetail}>
                <MapPin size={14} color={colors.white} />
                <Text style={styles.brcDetailText}>{suggestedBRC.distance}</Text>
              </View>
              
              <View style={styles.brcDetail}>
                <Calendar size={14} color={colors.white} />
                <Text style={styles.brcDetailText}>Today</Text>
              </View>
              
              <View style={styles.brcType}>
                <Coffee size={14} color={colors.white} />
                <Text style={styles.brcDetailText}>{suggestedBRC.type}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
  },
  cardsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    position: 'absolute',
    backgroundColor: colors.white,
    ...shadows.large,
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
  },
  userImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
  },
  userInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    marginRight: 10,
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.white,
  },
  userBio: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 12,
    opacity: 0.9,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  interestTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
  matchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  matchLabel: {
    color: colors.white,
    fontSize: 14,
    marginRight: 10,
  },
  matchBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 10,
  },
  matchFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  matchPercentage: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 16,
  },
  suggestedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 12,
  },
  brcSuggestion: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  brcImage: {
    width: 80,
    height: 80,
  },
  brcInfo: {
    flex: 1,
    padding: 12,
  },
  brcName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 6,
  },
  brcDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  brcDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 6,
  },
  brcDetailText: {
    color: colors.white,
    fontSize: 12,
    marginLeft: 4,
  },
  brcType: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  actionButton: {
    width: 140,
  },
  likeContainer: {
    position: 'absolute',
    top: 50,
    right: 40,
    transform: [{ rotate: '30deg' }],
    borderWidth: 4,
    borderColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  likeText: {
    color: colors.primary,
    fontSize: 32,
    fontWeight: '800',
  },
  nopeContainer: {
    position: 'absolute',
    top: 50,
    left: 40,
    transform: [{ rotate: '-30deg' }],
    borderWidth: 4,
    borderColor: colors.error,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  nopeText: {
    color: colors.error,
    fontSize: 32,
    fontWeight: '800',
  },
  noMoreCardsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  noMoreCardsText: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  noMoreCardsSubtext: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },

});