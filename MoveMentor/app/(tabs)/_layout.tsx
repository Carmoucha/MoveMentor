import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../styles/constants';

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

const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  tabBarStyle: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 100,
    backgroundColor: COLORS.unfocusedGray,
    borderRadius: 40,
    flexDirection: 'row',
    borderTopWidth: 0,
    elevation: 3,
    overflow: 'hidden',
    width: windowWidth - 20, 
    marginLeft: 10, // Center the tab bar
    alignContent: 'center',
  },
  tabBarItemStyle: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative', 
    paddingTop: 15, 
  },
  activeTab: {
    position: 'absolute',
    left:2,
    right: 0,
    height: 80, 
    paddingTop: 10, 
    top: -4, 
    backgroundColor: COLORS.lightGreen,
    borderRadius: 30,
    zIndex: -1, // Ensure it stays behind the icon and label
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    width: 100,
    textAlign: 'center',
    bottom: -25,
  },
});