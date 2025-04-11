import { Platform } from 'react-native';
import * as Network from 'expo-network';

let API_BASE_URL = 'http://localhost:8000/api'; // fallback

export const getBaseUrl = async (): Promise<string> => {
    const ip = await Network.getIpAddressAsync();
  
    if (Platform.OS === 'android' && __DEV__) {
      return 'http://10.0.2.2:8000/api'; // ✅ Android emulator
    }
  
    if (Platform.OS !== 'web') {
      return `http://${ip}:8000/api`; // ✅ physical mobile device
    }
  
    return 'http://localhost:8000/api'; // ✅ web fallback
  };
  
