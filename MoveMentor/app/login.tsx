import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ImageBackground,
  SafeAreaView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
//import { useAuth } from '../context/AuthContext';
import { COLORS } from './styles/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '../constants/IP';


export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const router = useRouter();
  //const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Information', 'Please enter both email and password');
      return;
    }
  
    try {
      setIsLoggingIn(true);
      
      // Backend URL
      const response = await fetch(`${API_BASE}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
  
      // Store userId only, no token stuff
      await AsyncStorage.setItem('userId', data.userId);
  
      router.replace('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', error.message || 'Please check your credentials and try again');
    } finally {
      setIsLoggingIn(false);
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://cdn.usegalileo.ai/sdxl10/081dfaaa-783c-4acd-b85f-ef59f5824107.png' }}
        style={styles.heroImage}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.heroTextContainer}>
          <Text style={styles.heroText}>Your Only Limit Is You!</Text>
        </View>
      </ImageBackground>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, styles.activeTab]} 
        >
          <Text style={[styles.tabText, styles.activeTabText]}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity 
        style={[styles.tabButton, activeTab === 'signup' && styles.activeTab]} 
        onPress={() => {
          setActiveTab('signup');
          router.push('/signup');
        }}
>
  <Text style={[styles.tabText, activeTab === 'signup' && styles.activeTabText]}>Sign Up</Text>
</TouchableOpacity>

      </View>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#A18249"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#A18249"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {/* Login Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={handleLogin}
          disabled={isLoggingIn}
        >
          {isLoggingIn ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 65,
    overflow: 'hidden',
  },
  heroImage: {
    height: 218,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  heroTextContainer: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  heroText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: '#F4EFE6',
    borderRadius: 50,
    height: 40,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    color: '#A18249',
    fontWeight: '500',
    fontSize: 14,
  },
  activeTabText: {
    color: '#1C160C',
  },
  inputContainer: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C160C',
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#E9DFCE',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  buttonContainer: {
    marginHorizontal: 16,
    marginTop: 'auto',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: COLORS.primaryGreen,
    height: 48,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
