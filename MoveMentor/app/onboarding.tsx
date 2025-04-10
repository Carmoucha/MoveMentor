import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const fitnessGoals = ['Lose Weight', 'Build Muscles', 'Improve Flexibility', 'Improve Cardio'];
const workoutPreferences = ['Home Workouts', 'Gym', 'Both'];
const experienceLevels = ['Beginner', 'Intermediate', 'Advanced'];

export default function OnboardingScreen() {
  const router = useRouter();

  const [goals, setGoals] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [experience, setExperience] = useState<string | null>(null);

  const toggleOption = (item: string, list: string[], setList: (val: string[]) => void) => {
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  const handleNext = () => {
    if (!experience || goals.length === 0 || preferences.length === 0) {
      alert('Please complete all selections before continuing.');
      return;
    }

    router.push({
      pathname: '/limitations',
      params: {
        goals: JSON.stringify(goals),
        preferences: JSON.stringify(preferences),
        experience,
      },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tell us about your fitness journey…</Text>

      <Text style={styles.section}>What are your fitness goals?</Text>
      {fitnessGoals.map(goal => (
        <TouchableOpacity
          key={goal}
          style={[styles.option, goals.includes(goal) && styles.optionSelected]}
          onPress={() => toggleOption(goal, goals, setGoals)}
        >
          <Text style={styles.optionText}>{goal}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.section}>Select your workout preferences:</Text>
      {workoutPreferences.map(pref => (
        <TouchableOpacity
          key={pref}
          style={[styles.option, preferences.includes(pref) && styles.optionSelected]}
          onPress={() => toggleOption(pref, preferences, setPreferences)}
        >
          <Text style={styles.optionText}>{pref}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.section}>What is your experience level?</Text>
      {experienceLevels.map(level => (
        <TouchableOpacity
          key={level}
          style={[styles.option, experience === level && styles.optionSelected]}
          onPress={() => setExperience(level)}
        >
          <Text style={styles.optionText}>{level}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#222',
  },
  section: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  option: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  optionSelected: {
    backgroundColor: '#d8f5e3',
    borderColor: '#00c170',
  },
  optionText: {
    fontSize: 16,
    color: '#222',
  },
  nextButton: {
    marginTop: 28,
    backgroundColor: '#00c170',
    paddingVertical: 14,
    borderRadius: 20,
  },
  nextButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
