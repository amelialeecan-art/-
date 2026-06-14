/**
 * 가로 배치 헬퍼
 */
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

export function RowBetween({
  children,
  style,
  align = 'center',
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  align?: ViewStyle['alignItems'];
}) {
  return <View style={[styles.between, { alignItems: align }, style]}>{children}</View>;
}

export function Row({
  children,
  gap = 8,
  style,
}: {
  children: React.ReactNode;
  gap?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.row, { gap }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  between: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
