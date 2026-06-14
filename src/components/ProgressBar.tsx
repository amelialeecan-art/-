/**
 * 진행률 바
 * tone: lime(기본) / gold
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useColors } from '../state/AppContext';

interface ProgressBarProps {
  /** 0~1 */
  value: number;
  tone?: 'lime' | 'gold';
  slim?: boolean;
}

export function ProgressBar({ value, tone = 'lime', slim }: ProgressBarProps) {
  const c = useColors();
  const pct = Math.max(0, Math.min(1, value)) * 100;
  const fill = tone === 'gold' ? c.gold : c.lime;
  return (
    <View
      style={[
        styles.track,
        { height: slim ? 6 : 9, backgroundColor: 'rgba(255,255,255,0.08)' },
      ]}
    >
      <View style={[styles.fill, { width: `${pct}%`, backgroundColor: fill }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});
