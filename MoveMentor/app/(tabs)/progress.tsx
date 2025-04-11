import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { View, Text, TouchableOpacity, StyleSheet, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, constStyles } from '../styles/constants';

import { useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function ProgressScreen() {
  const router = useRouter();

  const [weeklyProgress, setWeeklyProgress] = useState([
    true, true, true, true, true, false, false,
  ]);

  const [muscleProgress, setMuscleProgress] = useState(0);
  const [otherProgress, setOtherProgress] = useState(0);
  const [streak, setStreak] = useState(0);

  // Static goals are fine unless you’re making them dynamic too
  const muscleGoal = 10;
  const otherGoal = 20;

  const [userId, setUserId] = useState<string | null>(null);


  useEffect(() => {
    const fetchUserIdAndProgress = async () => {
      try {
        const storedId = await AsyncStorage.getItem('userId');
        if (!storedId) {
          console.warn('No user ID found in storage');
          return;
        }
  
        setUserId(storedId);
  
        const res = await axios.get(`http://localhost:8000/workouts/${storedId}`);
        const data = res.data;
        console.log('Progress data:', data);
  
        const mainGoal = data.goals[0] || 'Main';
  
        setMuscleProgress(data.groupedCounts[mainGoal] || 0);
        setOtherProgress(data.groupedCounts['Other'] || 0);
        setStreak(data.streakCount || 0);
      } catch (err) {
        console.error('Error fetching workout progress:', err);
      }
    };
  
    fetchUserIdAndProgress();
  }, []);
  
  
  


  const musclePercentage = (muscleProgress / muscleGoal) * 100;
  const otherPercentage = (otherProgress / otherGoal) * 100;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/dashboard')}>
          <Ionicons name="home-outline" size={28} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/badgesPage')}>
          <Ionicons name="shield-half-outline" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* Body */}
      <Text style = {constStyles.title}>Progress</Text>
      
      <View style={styles.body}>
        <Text style={styles.keepItUp}>Keep it up!</Text>

       {/* Streak box */}
        <View style={styles.streakBox}>
          <Ionicons name="flame" size={24} color={COLORS.fireRed} />
          <Text style={styles.streakText}>{streak}-Day Streak!</Text>
        </View>


        {/* Muscle workouts */}
        <Text style={styles.sectionTitle}>Muscle Building Workouts Completed</Text>
        <View style={styles.progressRow}>
          <Text style={styles.emoji}>😊</Text>
          <View style={styles.barBackground}>
            <View style={[styles.barFill, { width: `${musclePercentage}%` }]} />
          </View>
          <Text style={styles.progressCount}>{muscleProgress}/{muscleGoal}</Text>
        </View>

        {/* Other workouts */}
        <Text style={styles.sectionTitle}>Other Workouts Completed</Text>
        <View style={styles.progressRow}>
          <Text style={styles.emoji}>🙂</Text>
          <View style={styles.barBackground}>
            <View style={[styles.barFill, { width: `${otherPercentage}%` }]} />
          </View>
          <Text style={styles.progressCount}>{otherProgress}/{otherGoal}</Text>
        </View>

        {/* Reset Button */}
        <Pressable
          style={styles.resetButton}
          onPress={() => {
            setMuscleProgress(0);
            setOtherProgress(0);
            setWeeklyProgress([false, false, false, false, false, false, false]);
            setStreak(0);
          }}
        >

          <Text style={styles.resetText}>Reset Progress Levels</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  keepItUp: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  streakBox: {
    backgroundColor: '#A9A9A9',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 20,
    width: screenWidth - 50,
  },
  streakText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  emoji: {
    fontSize: 20,
    marginRight: 8,
  },
  barBackground: {
    flex: 1,
    height: 16,
    backgroundColor: COLORS.unfocusedGray,
    borderRadius: 8,
    overflow: 'hidden',
  },
  barFill: {
    height: 16,
    backgroundColor: COLORS.primaryGreen,
  },
  progressCount: {
    marginLeft: 10,
    fontWeight: '500',
  },
  resetButton: {
    marginTop: 30,
    backgroundColor: COLORS.primaryGreen,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'center',
  },
  resetText: {
    color: '#fff',
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#F8F8F8',
  },
  navButtonActive: {
    backgroundColor: COLORS.lightGreen,
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'column',
  },
  navButton: {
    backgroundColor: '#E0E0E0',
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'column',
  },
  weeklyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  weeklyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
