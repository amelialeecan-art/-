/**
 * 기본 버튼
 * variant: primary(라임) / secondary(외곽선) / danger
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useColors } from '../state/AppContext';
import { radius } from '../theme/typography';
import { Icon, IconName } from './Icon';

interface AppButtonProps {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: IconName;
}

export function AppButton({ label, onPress, variant = 'primary', icon }: AppButtonProps) {
  const c = useColors();

  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';

  const bg = isPrimary ? c.lime : 'transparent';
  const borderColor = isPrimary
    ? c.lime
    : isDanger
    ? 'rgba(255,90,95,0.4)'
    : c.line;
  const textColor = isPrimary ? c.onLime : isDanger ? c.danger : c.tx;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg, borderColor },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.inner}>
        {icon ? <Icon name={icon} size={18} color={textColor} /> : null}
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 54,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
});
