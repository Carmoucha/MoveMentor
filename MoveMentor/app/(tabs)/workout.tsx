import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Image, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { COLORS, constStyles } from '../styles/constants';
import Constants from "expo-constants";
import WorkoutTypePicker from '../../components/typesPicker';


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

  const types = [
    "Arms",
    "Chest",
    "Legs",
    "Glutes",
    "Abs",
    "HIIT",
    "Fat Burn",
    "Endurance",
    "Functional Training",
    "Stretching",
    "Balance",
    "Yoga",
    "Pilates",
    "Back",
    "Full Body",
  ];

  const [selectedDuration, setSelectedDuration] = useState<string | null>("15-30 min");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [videos, setVideos] = useState<any[]>([]);

  // Function to fetch YouTube videos based on selected duration
  const fetchVideos = async (duration: string, type: string[]) => {
    let query = "workout";
    let videoDuration = "any"; // default to any

    if (duration === "15 min") {
      query = "15 minute";
      videoDuration = "short"; // Less than 4 minutes
    } else if (duration === "15-30 min") {
      query = "15-30 minute";
      videoDuration = "medium"; // 4-20 minutes
    } else if (duration === "30 min") {
      query = "30 minute";
      videoDuration = "long"; // 4-20 minutes
    } else if (duration === "30-45 min") {
      query = "30-45 minute";
      videoDuration = "long"; // 4-20 minutes
    } else if (duration === "45 min") {
      query = "45 minute";
      videoDuration = "long"; // 4-20 minutes
    } else if (duration === "45-60 min") {
      query = "45-60 minute";
      videoDuration = "long"; // More than 20 minutes
    } else if (duration === "1h30") {
      query = "1.5 hour";
      videoDuration = "long"; // More than 20 minutes
    } else if (duration === "2h") {
      query = "2 hour";
      videoDuration = "long"; // More than 20 minutes
    }

    try {

      let allResults: any[] = [];
      // If no type selected, just search with the duration
      if (types.length === 0) {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
          params: {
            part: 'snippet',
            q: query,
            type: 'video',
            videoDuration,
            key: API_KEY,
            maxResults: 5,
          },
        });
        allResults = response.data.items;
      } else {
        // Loop through each type and send a separate request
        for (const type of types) {
          const fullQuery = `${type} ${query}`;
          const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
            params: {
              part: 'snippet',
              q: fullQuery,
              type: 'video',
              videoDuration,
              key: API_KEY,
              maxResults: 3,
            },
          });
          allResults.push(...response.data.items);
        }
      }

      // Optional: deduplicate based on videoId
      const seen = new Set();
      const uniqueVideos = allResults.filter((video) => {
        const id = video.id.videoId;
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });

      // Stub in durations if needed later
      const videosWithDuration = uniqueVideos.map((video) => ({
        ...video,
        duration: null,
      }));

      setVideos(videosWithDuration);
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
        <ScrollView contentContainerStyle={styles.buttonContainer} horizontal>
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
          {videos.map((video: any) => (
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
  const userId = localStorage.getItem('userId'); 


  // regardimg the counter
  const [completionCount, setCompletionCount] = useState(0);
  
  const increment = async () => {
  try {
    const res = await axios.post('https://localhost:8000/workouts/increment', {
      userId,
      type: "arms", // or map video titles to types dynamically
    });

    console.log("✅ Incremented:", res.data);
    setCompletionCount((prev) => prev + 1);
  } catch (error) {
    console.error("❌ Error incrementing workout:", error);
  }
};

const decrement = async () => {
  try {
    const res = await axios.post('https://localhost:8000/workouts/decrement', {
      userId,
      type: "arms", // or map video titles to types dynamically
    });

    console.log("✅ Decremented:", res.data);
    setCompletionCount((prev) => Math.max(0, prev - 1));
  } catch (error) {
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

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 5,
    gap: 1,
  },
  filtersButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 4,
    backgroundColor: '#fff',
    alignContent: 'center',
    alignSelf: 'center',
  },
  filtersButtonsSelected: {
    backgroundColor: COLORS.primaryGreen,
    borderColor: '#fff',
  },
  buttonText: {
    color: '#000',
  },
  buttonTextSelected: {
    color: '#fff',
  },
  videoContainer: {
    paddingHorizontal: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.unfocusedGray,
    padding: 10,
    borderRadius: 20,
    width: screenWidth - 20,
    marginVertical: 10,
  },
  thumbnail: {
    width: 100,
    height: 70,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    alignSelf: 'center'
  },
  textContainer: {
    marginLeft: 15,
    flexShrink: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '400',
  },
  duration: {
    marginTop: 5,
    fontWeight: '900',
  },
  redirecttoYtbButton: {
    backgroundColor: COLORS.primaryGreen,
    height: 40,
    width: 40,
    borderRadius: 15,
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  filtersSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 15,
    marginBottom: 10,
    marginTop: 10,
  },
  counterWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  counterText: {
    color: COLORS.primaryGreen,
    fontSize: 18,
    fontWeight: 'bold',
  },
  countDisplay: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 0,
    padding: 4,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
});
