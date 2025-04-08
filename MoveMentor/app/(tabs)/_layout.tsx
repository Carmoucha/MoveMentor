import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../styles/constants';
import styles from '../styles/navigationBarStyles';

interface TabBarIconProps {
  route: any;
  focused: boolean;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({ route, focused }) => {
  let iconName = '';
  let label = '';

  switch (route.name) {
    case 'dashboard':
      iconName = 'home';
      label = 'Home';
      break;
    case 'progress':
      iconName = 'trophy';
      label = 'Progress';
      break;
    case 'workout':
      iconName = 'barbell';
      label = 'Workout';
      break;
  }

  return (
    <View style={styles.tabItem}>
      {focused && <View style={styles.activeTab} />} 
      <Ionicons
        name={iconName as keyof typeof Ionicons.glyphMap}
        size={30}
        color={focused ? COLORS.primaryGreen : COLORS.focusedGray}
        style={{ marginBottom: -20, alignSelf: 'center' }}
      />
      <Text style={[styles.tabLabel, { color: focused ? COLORS.primaryGreen : COLORS.focusedGray }]}>
        {label}
      </Text>
    </View>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBarStyle,
        tabBarItemStyle: styles.tabBarItemStyle,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused }) => <TabBarIcon route={route} focused={focused} />,
      })}
    >
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="progress" />
      <Tabs.Screen name="workout" />
    </Tabs>
  );
}
