import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getBaseUrl } from '../backend/utils/api'; // ← adjust path as needed

const commonLimitations = [
  'Knee pain',
  'Back issues',
  'Shoulder injuries',
  'Limited mobility',
  'Asthma',
  'None',
];

export default function LimitationsScreen() {
  const router = useRouter();
  const { goals, preferences, experience } = useLocalSearchParams();

  const [selectedLimitations, setSelectedLimitations] = useState<string[]>([]);
  const [customLimitation, setCustomLimitation] = useState('');

  const toggleLimitation = (item: string) => {
    setSelectedLimitations(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleFinish = async () => {
    console.log('📩 Submitting onboarding data...');
  
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      console.warn('❌ No userId found in AsyncStorage');
      return;
    }
  
    const allLimitations = customLimitation
      ? [...selectedLimitations, customLimitation]
      : selectedLimitations;
  
    const onboardingData = {
      fitnessGoals: JSON.parse(goals as string),
      workoutPreferences: JSON.parse(preferences as string),
      experienceLevel: experience,
      limitations: allLimitations,
      otherLimitations: customLimitation,
    };
  
    try {
      const baseUrl = await getBaseUrl(); // 👈 added this
      const response = await fetch(`${baseUrl}/users/onboarding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, onboarding: onboardingData }),
      });
  
      let result;
      try {
        result = await response.json();
      } catch (e) {
        console.error('❌ Failed to parse JSON:', e);
        throw new Error('Invalid server response (not JSON)');
      }

      if (response.ok) {
        console.log('✅ Onboarding saved to backend:', result);
        router.push('/dashboard');
      } else {
        console.warn('⚠️ Server responded with error:', result.message);
      }

    } catch (err) {
      console.error('❌ Error submitting onboarding:', err);
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Any physical limitations?</Text>

      <Text style={styles.subtitle}>Select any that apply:</Text>
      {commonLimitations.map((item) => (
        <TouchableOpacity
          key={item}
          style={[
            styles.option,
            selectedLimitations.includes(item) && styles.optionSelected,
          ]}
          onPress={() => toggleLimitation(item)}
        >
          <Text style={styles.optionText}>{item}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.subtitle}>Other (optional):</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter other limitations"
        value={customLimitation}
        onChangeText={setCustomLimitation}
      />

      <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
        <Text style={styles.finishButtonText}>Finish Onboarding</Text>
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
    marginBottom: 16,
    color: '#222',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  option: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 8,
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  finishButton: {
    backgroundColor: '#00c170',
    paddingVertical: 14,
    borderRadius: 20,
    marginTop: 20,
  },
  finishButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
