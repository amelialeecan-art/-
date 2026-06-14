/**
 * 앱 네비게이터
 * 루트 스택 + 하단 탭 네비게이터.
 */
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useApp } from '../state/AppContext';
import type { RootStackParamList, TabParamList } from './types';
import { CustomTabBar } from './CustomTabBar';

import { SplashScreen } from '../screens/SplashScreen';
import { OnboardingServiceScreen } from '../screens/OnboardingServiceScreen';
import { OnboardingSalaryScreen } from '../screens/OnboardingSalaryScreen';
import { OnboardingSavingsScreen } from '../screens/OnboardingSavingsScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { SavingsScreen } from '../screens/SavingsScreen';
import { TimelineScreen } from '../screens/TimelineScreen';
import { GoalsScreen } from '../screens/GoalsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { SalaryDetailScreen } from '../screens/SalaryDetailScreen';
import { AssetsScreen } from '../screens/AssetsScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { CelebrationScreen } from '../screens/CelebrationScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Savings" component={SavingsScreen} />
      <Tab.Screen name="Timeline" component={TimelineScreen} />
      <Tab.Screen name="Goals" component={GoalsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { state, loading, colors } = useApp();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.lime} />
      </View>
    );
  }

  const isDark = state.settings.theme === 'dark';
  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme : DefaultTheme).colors,
      background: colors.bg,
      card: colors.card,
      text: colors.tx,
      primary: colors.lime,
      border: colors.line,
    },
  };

  const initialRoute = state.settings.onboardingCompleted ? 'Main' : 'Splash';

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="OnboardingService" component={OnboardingServiceScreen} />
        <Stack.Screen name="OnboardingSalary" component={OnboardingSalaryScreen} />
        <Stack.Screen name="OnboardingSavings" component={OnboardingSavingsScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="SalaryDetail" component={SalaryDetailScreen} />
        <Stack.Screen name="Assets" component={AssetsScreen} />
        <Stack.Screen name="Stats" component={StatsScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen
          name="Celebration"
          component={CelebrationScreen}
          options={{ presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
