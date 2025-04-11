import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { COLORS, constStyles } from '../styles/constants';
import Constants from "expo-constants";
import WorkoutTypePicker from '../../components/typesPicker';
import styles from '../styles/workoutPageStyles';


const API_KEY = Constants.expoConfig?.extra?.apiKey;

if (!API_KEY) {
  console.error('API_KEY is not available in manifest.extra');
}
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

  const [selectedDuration, setSelectedDuration] = useState<string | null>("15-30 min");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const videoCache = useRef<Record<string, any[]>>({});

  // Function to fetch YouTube videos based on selected duration
  const fetchVideos = async (duration: string, types: string[]) => {
    let query = "workout";
    const cacheKey = `${duration}-${types.sort().join(",")}`;
    if (videoCache.current[cacheKey]) {
      setVideos(videoCache.current[cacheKey]);
      return;
    }

    const durationMap: Record<string, string> = {
      "15 min": "15 minute",
      "15-30 min": "15-30 minute",
      "30 min": "30 minute",
      "30-45 min": "30-45 minute",
      "45 min": "45 minute",
      "45-60 min": "45-60 minute",
      "1h30": "1.5 hour",
      "2h": "2 hour"
    };
    query = durationMap[duration] || "workout";

    try {
      let searchQuery = query;
      if (types.length > 0) {
        searchQuery = `${types.join(" OR ")} ${query}`;
      }

      // 1. First call: search videos
      const searchResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          q: searchQuery,
          type: 'video',
          key: API_KEY,
          maxResults: 10,
        },
      });

      const searchResults = searchResponse.data.items;
      const videoIds = searchResults.map((v: any) => v.id.videoId).join(',');

      // 2. Second call: get durations
      const detailsResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          part: 'contentDetails',
          id: videoIds,
          key: API_KEY,
        },
      });

      const durationMapById: Record<string, string> = {};
      detailsResponse.data.items.forEach((item: any) => {
        durationMapById[item.id] = item.contentDetails.duration;
      });

      const videosWithDuration = searchResults.map((video: any) => {
        const videoTitle = video.snippet.title.toLowerCase();

        // Find first selected type that appears in the title
        const validTypes = [
          "arms",
          "chest",
          "legs",
          "glutes",
          "abs",
          "hiit",
          "fat_burn",
          "endurance",
          "functional_training",
          "stretching",
          "balance",
          "yoga",
          "pilates",
          "back",
          "full_body"
        ];


        // Fallback to null if it's not in the valid list
        let matchedType = types.find((type) => {
          const normalizedType = type.toLowerCase().replace(/_/g, ' ');
          return videoTitle.includes(normalizedType);
        });

        if (!matchedType || !validTypes.includes(matchedType)) {
          return null;
        }



        return {
          ...video,
          duration: durationMapById[video.id.videoId] || null,
          workoutType: matchedType, // ✅ include the matched type
        };
      });

      const seen = new Set();
      const uniqueVideos = videosWithDuration.filter((video: any) => {
        const id = video.id.videoId;
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });

      setVideos(uniqueVideos);
      videoCache.current[cacheKey] = uniqueVideos;
    } catch (error) {
      console.error("❌ Error fetching YouTube videos:", error);
    }
  };

  // Fetch videos whenever the selected duration changes
  useEffect(() => {
    console.log("⛔️ API_KEY:", API_KEY);
    fetchVideos(selectedDuration!, selectedTypes);
  }, [selectedDuration, selectedTypes]);

  async function login(email: string, password: string) {
    const response = await fetch('/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      // Save the userId and token (e.g., in localStorage or a state management system like Redux)
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('token', data.token);
      console.log('Login successful', data);
    } else {
      console.log('Login failed', data.message);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
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

          <TouchableOpacity onPress={() => router.push('../badgesPage')}>
            <Ionicons name="shield-half-outline" size={28} color="black" />
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <Text style={constStyles.title}>Workouts</Text>
        <Text style={styles.filtersSectionTitle}>Select Duration</Text>
        <ScrollView contentContainerStyle={styles.buttonContainer} horizontal nestedScrollEnabled={true}>
          {durations.map((duration) => {
            const isSelected = selectedDuration === duration;
            return (
              <TouchableOpacity
                key={duration}
                onPress={() => setSelectedDuration(duration)}
                style={[
                  styles.filtersButton,
                  isSelected && styles.filtersButtonsSelected,
                ]}
              >
                <Text style={[styles.buttonText, isSelected && styles.buttonTextSelected]}>
                  {duration}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Workout Types (multi-select) */}
        <Text style={styles.filtersSectionTitle}>Select Workout Types</Text>
        <View style={styles.container}>
          <WorkoutTypePicker
            selectedWorkouts={selectedTypes}
            setSelectedWorkouts={setSelectedTypes}
            styles={styles}
          />
          <Text>Selected workouts: {selectedTypes.join(", ")}</Text>
        </View>


        {/* Display the video results */}
        <ScrollView contentContainerStyle={styles.videoContainer}>
          {videos
            .filter((video: any) => video?.workoutType !== undefined)
            .map((video: any) => (
              <WorkoutCard key={video.id.videoId} video={video} />
            ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

function WorkoutCard({ video }: { readonly video: any }) {

  // regarding the cards general UI
  const videoUrl = `https://www.youtube.com/watch?v=${video.id.videoId}`;
  const thumbnailUrl = video.snippet.thumbnails.high.url;
  const title = video.snippet.title;

  // regarding the workout duration
  const duration = video.duration;
  const formattedDuration = duration ? formatDuration(duration) : 'No duration available';

  // get userID from the login credentials 
  const userId = "67f7400c2863d812b1be7db1";


  // regardimg the counter
  const [completionCount, setCompletionCount] = useState(0);

  const increment = async () => {
    try {
      console.log("📦 Workout type to increment:", video.workoutType);

      const res = await axios.post('http://10.0.0.32:8000/workouts/increment', {
        userId,
        type: video.workoutType, // or map video titles to types dynamically
      });

      console.log("✅ Incremented:", res.data);
      setCompletionCount((prev) => prev + 1);
    } catch (error) {
      console.error("❌ Error incrementing workout:", error);
    }
  };

  const decrement = async () => {
    try {
      const res = await axios.post('http://10.0.0.32:8000/workouts/decrement', {
        userId: userId,
        type: video.workoutType, // or map video titles to types dynamically
      });

      console.log("✅ Decremented:", res.data);
      setCompletionCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.log('Payload:', { userId, type: video.workoutType });
      console.error("❌ Error decrementing workout:", error);
    }
  };


  return (
    <View style={styles.card}>
      <Image
        source={{ uri: thumbnailUrl }} // get the youtube thumnail
        style={styles.thumbnail}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          {title}
        </Text>
        <Text style={styles.duration}>
          {formattedDuration} {/* Display the actual duration */}
        </Text>
      </View>

      <View style={styles.counterWrapper}>
        <TouchableOpacity onPress={increment}>
          <Text style={styles.counterText}>+</Text>
        </TouchableOpacity>

        <Text style={styles.countDisplay}>{completionCount}</Text>

        <TouchableOpacity onPress={decrement} >
          <Text style={styles.counterText}>-</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => Linking.openURL(videoUrl)} style={styles.redirecttoYtbButton}>
        <Ionicons name='play' size={30} color={COLORS.unfocusedGray} style={{ alignSelf: 'center', marginTop: 4, marginLeft: 5 }} />
      </TouchableOpacity>
    </View>
  );
}

// Helper function to display the duration of each workout in correct format
function formatDuration(isoDuration: string): string {
  // Match hours (H), minutes (M) and seconds (S) from the ISO string
  const durationRegex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const match = durationRegex.exec(isoDuration);

  if (!match) return isoDuration; // Fallback to input if not formatted as expected

  // Parse values, defaulting to 0 if undefined
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);

  // Format for display: if hours exist, include them; otherwise, just minutes and seconds
  if (hours > 0) {
    // Example: "1:02:03" for 1 hour, 2 minutes and 3 seconds
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    // Example: "16:12" for 16 minutes, 12 seconds
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}