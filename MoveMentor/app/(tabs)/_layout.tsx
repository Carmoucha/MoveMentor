import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
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
    <View style={[styles.tabItem, focused && styles.activeTab]}>
      <Ionicons
        name={iconName as keyof typeof Ionicons.glyphMap}
        size={20}
        color={focused ? COLORS.primaryGreen : COLORS.focusedGray}
        style={{ marginBottom: 4 }}
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

const styles = StyleSheet.create({
  tabBarStyle: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 60,
    backgroundColor: COLORS.unfocusedGray,
    borderRadius: 30,
    flexDirection: 'row',
    borderTopWidth: 0,
    elevation: 3,
    overflow: 'hidden',
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
    flexGrow: 1,
  },
  activeTab: {
    backgroundColor: COLORS.lightGreen,
    borderRadius: 30,
    height: 100,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    width: 100,
    textAlign: 'center',
  },
});
