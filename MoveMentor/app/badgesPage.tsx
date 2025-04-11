import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE } from '../constants/IP';
import { COLORS } from './styles/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { eventEmitter } from '../utils/event';

interface Badge {
  id: string;
  title: string;
  earned: boolean;
}

export default function BadgesScreen() {
  const router = useRouter();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [earnedCount, setEarnedCount] = useState(0);

  useEffect(() => {
    const listener = () => {
      fetchBadges();
    };
  
    // Fetch badges immediately on initial mount
    fetchBadges(); 
  
    // Also fetch badges whenever the event fires
    eventEmitter.on('workoutProgressUpdated', listener);
  
    return () => {
      eventEmitter.off('workoutProgressUpdated', listener);
    };
  }, []);
  
  
  const fetchBadges = async () => {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) return;

    try {
      const res = await axios.get(`${API_BASE}/workouts/badges/${userId}`);
      const sortedBadges = res.data.badges.sort((a: Badge, b: Badge) => Number(a.earned) - Number(b.earned));
      setBadges(sortedBadges);
      setEarnedCount(sortedBadges.filter((b: Badge) => b.earned).length);
    } catch (error) {
      console.error("❌ Error fetching badges:", error);
    }
  };

  const firstEarnedBadgeIndex = badges.findIndex(b => b.earned);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/dashboard')}>
          <Ionicons name="home-outline" size={28} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.innerContainer}>
        <Text style={styles.title}>Badges</Text>
        <Text style={styles.badgesSubtitle}>Total number of badges earned:</Text>

        <View style={styles.counterCircle}>
          <Text style={styles.counterText}>{earnedCount}</Text>
        </View>

        <ScrollView style={styles.scrollView}>
          {badges.map((badge, index) => (
            <React.Fragment key={badge.id}>
              {index === firstEarnedBadgeIndex && firstEarnedBadgeIndex !== 0 && (
                <View style={styles.separator} />
              )}
              <View
                style={[styles.badgeItem, badge.earned ? styles.badgeEarned : styles.badgeUnearned]}>
                <Ionicons
                  name="shield-half-outline"
                  size={24}
                  color={badge.earned ? COLORS.focusedGray : 'black'}
                  style={{ marginRight: 10 }}
                />
                <Text style={[styles.badgeText, badge.earned && styles.badgeTextEarned]}>
                  {badge.title}
                </Text>
              </View>
            </React.Fragment>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  badgesSubtitle: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  counterCircle: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primaryGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  counterText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    width: '100%',
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.unfocusedGray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  badgeUnearned: {
    backgroundColor: '#FFFFFF',
  },
  badgeEarned: {
    backgroundColor: COLORS.unfocusedGray,
  },
  badgeText: {
    fontSize: 16,
  },
  badgeTextEarned: {
    color: COLORS.focusedGray,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.unfocusedGray,
    marginVertical: 10,
    width: '90%',
    alignSelf: 'center',
  },
});
