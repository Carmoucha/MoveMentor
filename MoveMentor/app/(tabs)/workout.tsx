// Workout Screen
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, constStyles } from '../styles/constants';

export default function WorkoutScreen() {
  const router = useRouter();
  const durations = [
    "15 min",
    "15-30 min",
    "30 min",
    "30-45 min",
    "45 min",
    "45-60 min",
    "1h30",
    "2h",
  ];

  const [selected, setSelected] = useState<string | null>("15-30 min");

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Header with Home Icon and Shield */}
      {/* Home icon */}
      <View style={{
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
      }}>
        <TouchableOpacity onPress={() => router.push('/dashboard')}>
          <Ionicons name="home-outline" size={28} color="black" />
        </TouchableOpacity>

        {/* Shield icon */}
        <TouchableOpacity onPress={() => router.push('../badgesPage')}>
          <Ionicons name="shield-half-outline" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <Text style = {constStyles.title}>Workouts</Text>
      <ScrollView contentContainerStyle={styles.buttonContainer}>
        {durations.map((duration) => {
          const isSelected = selected === duration;
          return (
            <TouchableOpacity
              key={duration}
              onPress={() => setSelected(duration)}
              style={[
                styles.durationButton,
                isSelected && styles.durationButtonSelected,
              ]}
            >
              <Text style={[styles.buttonText, isSelected && styles.buttonTextSelected]}>
                {duration}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 5,
    gap: 1, // only works in newer RN versions; otherwise use marginRight/marginBottom manually
  },
  durationButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 4,
    backgroundColor: '#fff',
    alignContent: 'center',
    alignSelf: 'center'
  },
  durationButtonSelected: {
    backgroundColor: COLORS.primaryGreen,
    borderColor: '#fff',
  },
  buttonText: {
    color: '#000',
  },
  buttonTextSelected: {
    color: '#fff',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

});