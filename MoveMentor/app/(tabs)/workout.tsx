import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { COLORS, constStyles } from '../styles/constants';
import Constants from "expo-constants";

const API_KEY = process.env.GOOGLE_API_KEY || Constants.expoConfig?.extra?.apiKey;

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
  const [videos, setVideos] = useState<any[]>([]);

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
  const fetchVideos = async (duration: string) => {
    let query = "workout";
    let videoDuration = "any"; // default to any

    if (duration === "15 min") {
      query = "15 minute workout";
      videoDuration = "medium"; // 4-20 min
    } else if (duration === "30 min" || duration === "30-45 min") {
      query = "30 minute workout";
      videoDuration = "long"; // >20 min
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
    fetchVideos(selected!);
  }, [selected]);

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
        <ScrollView contentContainerStyle={styles.buttonContainer}>
          {durations.map((duration) => {
            const isSelected = selected === duration;
            return (
              <TouchableOpacity
                key={duration}
                onPress={() => {
                  setSelected(duration);
                  fetchVideos(duration); // Refetch videos when duration is changed
                }}
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

function WorkoutCard({ video }: { video: any }) {
  const videoUrl = `https://www.youtube.com/watch?v=${video.id.videoId}`;
  const thumbnailUrl = video.snippet.thumbnails.high.url;
  const title = video.snippet.title;
  const duration = video.duration;

  const formattedDuration = duration ? formatDuration(duration) : 'No duration available';

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: thumbnailUrl }}
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
    </View>
  );
}

// Helper function to display the duration of each workout in correct format
function formatDuration(isoDuration: string): string {
  // Match hours (H), minutes (M) and seconds (S) from the ISO string
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

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
  durationButton: {
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
});
