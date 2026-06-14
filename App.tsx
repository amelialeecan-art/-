/**
 * 군월급 — 군인 월급 실시간 카운터 앱
 * 진입점: 상태 프로바이더 + 네비게이터 구성.
 */
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProvider, useApp } from './src/state/AppContext';
import { AppNavigator } from './src/navigation/AppNavigator';

function ThemedStatusBar() {
  const { state } = useApp();
  return <StatusBar style={state.settings.theme === 'dark' ? 'light' : 'dark'} />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <ThemedStatusBar />
        <AppNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}
