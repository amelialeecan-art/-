/**
 * 카드 컨테이너
 * variant: default(기본) / hi(라임 하이라이트) / sub(살짝 옅은 배경)
 */
import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useColors } from '../state/AppContext';
import { radius } from '../theme/typography';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'hi' | 'sub';
  tight?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, variant = 'default', tight, onPress, style }: CardProps) {
  const c = useColors();
  const bg =
    variant === 'sub' ? c.card2 : variant === 'hi' ? c.card : c.card;
  const borderColor =
    variant === 'hi' ? 'rgba(182,255,77,0.28)' : c.line;

  const content = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: bg,
          borderColor,
          padding: tight ? 14 : 18,
        },
        variant === 'hi' && styles.hi,
        style,
      ]}
    >
      {children}
    </View>
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
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: 10,
  },
  hi: {
    // 라임 하이라이트는 옅은 배경 톤으로 강조
    backgroundColor: 'rgba(182,255,77,0.06)',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },
});
