/**
 * 입력 필드 행 (라벨 + 값). 탭하면 onPress 실행.
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useColors } from '../state/AppContext';
import { numFontFamily, radius } from '../theme/typography';

interface FieldProps {
  label: string;
  value: string;
  onPress?: () => void;
  focus?: boolean;
  valueTone?: 'default' | 'lime';
  numericValue?: boolean;
}

export function Field({
  label,
  value,
  onPress,
  focus,
  valueTone = 'default',
  numericValue,
}: FieldProps) {
  const c = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.field,
        {
          backgroundColor: c.inset,
          borderColor: focus ? c.lime : c.line,
        },
        pressed && onPress ? styles.pressed : null,
      ]}
    >
      <Text style={[styles.k, { color: c.tx2 }]}>{label}</Text>
      <Text
        style={[
          styles.v,
          {
            color: valueTone === 'lime' ? c.lime : c.tx,
            fontFamily: numericValue ? numFontFamily : undefined,
          },
        ]}
      >
        {value}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 54,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  k: {
    fontSize: 14,
    fontWeight: '500',
  },
  v: {
    fontSize: 15,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
});
