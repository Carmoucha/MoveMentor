import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';

// Define the context types
type AuthContextType = {
  signIn: (token: string, userId: string) => Promise<void>;
  signOut: () => Promise<void>;
  register: (userId: string) => Promise<void>;
  isLoading: boolean;
  userId: string | null;
  token: string | null;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  signIn: async () => {},
  signOut: async () => {},
  register: async () => {},
  isLoading: true,
  userId: null,
  token: null,
});

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const segments = useSegments();
  const router = useRouter();

  // Check if user is authenticated on app start
  useEffect(() => {
    const loadToken = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const storedUserId = await AsyncStorage.getItem('userId');
        
        if (userToken && storedUserId) {
          setToken(userToken);
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error('Failed to load token:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadToken();
  }, []);

  // Redirect based on auth state
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    
    if (!token && !inAuthGroup) {
      // Redirect to the login page if not authenticated
      router.replace('/login');
    } else if (token && inAuthGroup) {
      // Redirect to the home page if authenticated and trying to access auth screens
      router.replace('/dashboard');
    }
  }, [isLoading, token, segments]);

  const signIn = async (newToken: string, newUserId: string) => {
    try {
      await AsyncStorage.setItem('userToken', newToken);
      await AsyncStorage.setItem('userId', newUserId);
      setToken(newToken);
      setUserId(newUserId);
    } catch (error) {
      console.error('Failed to sign in:', error);
      throw error;
    }
  };

  const register = async (newUserId: string) => {
    try {
      await AsyncStorage.setItem('userId', newUserId);
      setUserId(newUserId);
      // Don't set token here as user isn't fully authenticated yet
    } catch (error) {
      console.error('Failed to register:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userId');
      setToken(null);
      setUserId(null);
      router.replace('/login');
    } catch (error) {
      console.error('Failed to sign out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ signIn, signOut, register, isLoading, userId, token }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using the auth context
export function useAuth() {
  return useContext(AuthContext);
}