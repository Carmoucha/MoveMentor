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

  // for type selection
  const toggleType = (type: string) => {
    setSelectedTypes((prevTypes) =>
      prevTypes.includes(type)
        ? prevTypes.filter((t) => t !== type)
        : [...prevTypes, type]
    );
  };

  // Function to fetch video details, including duration
  const fetchVideoDetails = async (videoId: string) => {
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          part: 'contentDetails',
          id: videoId,
          key: API_KEY,
          maxResults: 1,
        },
      });
      const duration = response.data.items[0]?.contentDetails.duration;
      return duration;
    } catch (error) {
      console.error("Error fetching video details:", error);
      return null;
    }
  };

  // Function to fetch YouTube videos based on selected duration
  const fetchVideos = async (duration: string, type: string[]) => {
    let query = "workout";
    let videoDuration = "any"; // default to any

    if (duration === "15 min") {
      query = "15 minute workout";
      videoDuration = "short"; // Less than 4 minutes
    } else if (duration === "15-30 min") {
      query = "15-30 minute workout";
      videoDuration = "medium"; // 4-20 minutes
    } else if (duration === "30 min") {
      query = "30 minute workout";
      videoDuration = "medium"; // 4-20 minutes
    } else if (duration === "30-45 min") {
      query = "30-45 minute workout";
      videoDuration = "medium"; // 4-20 minutes
    } else if (duration === "45 min") {
      query = "45 minute workout";
      videoDuration = "medium"; // 4-20 minutes
    } else if (duration === "45-60 min") {
      query = "45-60 minute workout";
      videoDuration = "long"; // More than 20 minutes
    } else if (duration === "1h30") {
      query = "1.5 hour workout";
      videoDuration = "long"; // More than 20 minutes
    } else if (duration === "2h") {
      query = "2 hour workout";
      videoDuration = "long"; // More than 20 minutes
    }

    try {
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          videoDuration: videoDuration,
          key: API_KEY,
        },
      });
      const videos = response.data.items;

      // Now fetch the video details to get the duration for each video
      const videosWithDuration = await Promise.all(videos.map(async (video: { id: { videoId: any; }; }) => {
        const videoId = video.id.videoId;
        const duration = await fetchVideoDetails(videoId); // Fetch duration
        return {
          ...video,
          duration,
        };
      }));

      setVideos(videosWithDuration); // Update state with video data and duration
    } catch (error) {
      console.error("Error fetching YouTube videos:", error);
    }
  };

  // Fetch videos whenever the selected duration changes
  useEffect(() => {
    console.log("⛔️ API_KEY:", API_KEY);
    fetchVideos(selectedDuration!, selectedTypes);
  }, [selectedDuration, selectedTypes]);

  // // for testing 
  // const useMockData = true; // toggle this to false for real API data

  // useEffect(() => {
  //   if (useMockData) {
  //     setVideos(generateMockVideos());
  //   } else {
  //     fetchVideos(selectedDuration!, selectedDuration ?? "15 min"); // set default to match the user's preferences
  //   }
  // }, [selectedDuration]);

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

  // regardimg the counter
  const [completionCount, setCompletionCount] = useState(0);
  const increment = () => setCompletionCount(prev => prev + 1);
  const decrement = () => setCompletionCount(prev => Math.max(0, prev - 1));


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

// // For testing purposes
// const generateMockVideos = (count = 100) => {
//   return Array.from({ length: count }, (_, i) => ({
//     id: { videoId: `mock-id-${i + 1}` },
//     snippet: {
//       title: `Mock Workout Video #${i + 1}`,
//       thumbnails: {
//         high: {
//           url: 'https://via.placeholder.com/150', // Placeholder image
//         },
//       },
//     },
//     duration: `${10 + (i % 20)}:0${i % 10}` // Simulated MM:SS
//   }));
// };


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
