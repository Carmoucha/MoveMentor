// Workout Screen
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WorkoutScreen() {
  const router = useRouter();

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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Workout Screen</Text>
      </View>
    </SafeAreaView>
  );
}
