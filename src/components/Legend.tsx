/**
 * 범례 행 (색상 스와치 + 라벨 + 금액)
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useColors } from '../state/AppContext';
import { numFontFamily } from '../theme/typography';

export function LegendRow({
  color,
  label,
  amount,
  amountColor,
}: {
  color: string;
  label: string;
  amount: string;
  amountColor?: string;
}) {
  const c = useColors();
  return (
    <View style={styles.row}>
      <View style={[styles.sw, { backgroundColor: color }]} />
      <Text style={[styles.label, { color: c.tx2 }]}>{label}</Text>
      <Text style={[styles.amount, { color: amountColor ?? c.tx }]}>{amount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  sw: {
    width: 11,
    height: 11,
    borderRadius: 3,
  },
  label: {
    fontSize: 13,
    flex: 1,
  },
  amount: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: numFontFamily,
  },
});
