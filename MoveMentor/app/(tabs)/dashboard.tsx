import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE } from '../../constants/IP';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [onboarding, setOnboarding] = useState({
    fitnessGoals: [],
    experienceLevel: '',
    workoutPreferences: '',
    limitations: [],
    otherLimitations: '',
  });

  useEffect(() => {
    const fetchOnboarding = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) return console.warn('No user ID found');

    
        const res = await fetch(`${API_BASE}/users/onboarding/${userId}`);
        const data = await res.json();

        if (data.onboarding) {
          setOnboarding(data.onboarding);
        }
      } catch (err) {
        console.error('Error loading onboarding:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOnboarding();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

  const allLimitations = [...onboarding.limitations, onboarding.otherLimitations]
    .filter(Boolean)
    .join(', ');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/dashboard')}>
          <Ionicons name="home-outline" size={28} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/badgesPage')}>
          <Ionicons name="shield-half-outline" size={28} color="black" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Welcome Athlete!</Text>

      <View style={{ width: '100%' }}>
        <Text style={styles.subtitle}>Preferences</Text>
      </View>

      <View style={styles.summaryBox}>
        <View style={styles.summaryRow}>
          <Ionicons name="shield-checkmark-outline" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.summaryText}>
            <Text style={styles.label}>Goals: </Text>
            {onboarding.fitnessGoals?.join(', ') || 'N/A'}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Ionicons name="barbell-outline" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.summaryText}>
            <Text style={styles.label}>Experience: </Text>
            {onboarding.experienceLevel || 'N/A'}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Ionicons name="options-outline" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.summaryText}>
            <Text style={styles.label}>Preferences: </Text>
            {onboarding.workoutPreferences || 'N/A'}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Ionicons name="warning-outline" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.summaryText}>
            <Text style={styles.label}>Limitations: </Text>
            {allLimitations || 'N/A'}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/(tabs)/workout')}>
        <Text style={styles.buttonText}>▶ Start Workout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkButton} onPress={() => router.push('/(tabs)/progress')}>
        <Text style={styles.linkButtonText}>📈 View Progress</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  header: {
    paddingHorizontal: 4,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 6, textAlign: 'center' },
  subtitle: { fontSize: 18, fontWeight: '500', marginBottom: 12 },
  summaryBox: {
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    width: '100%',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    marginRight: 12,
    width: 28,
    textAlign: 'center',
  },
  summaryText: {
    fontSize: 18,
    color: '#fff',
    flexShrink: 1,
  },
  label: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 18,
  },
  button: {
    backgroundColor: '#00c170',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  linkButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
