/**
 * 히어로 카드 — 실시간 카운터를 감싸는 라임 글로우 카드.
 */
import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useApp } from '../state/AppContext';
import { radius } from '../theme/typography';

interface HeroProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function Hero({ children, onPress, style }: HeroProps) {
  const { colors, state } = useApp();
  const isDark = state.settings.theme === 'dark';

  const gradientColors = isDark
    ? (['#1B2A12', '#101822', colors.card] as const)
    : (['#EAFBD2', '#FFFFFF', colors.card] as const);

  const content = (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[
        styles.hero,
        { borderColor: 'rgba(182,255,77,0.3)' },
        style,
      ]}
    >
      {children}
    </LinearGradient>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => (pressed ? styles.pressed : null)}>
        {content}
      </Pressable>
    );
  }
  return content;
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: 20,
    gap: 12,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
});
