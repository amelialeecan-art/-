/**
 * 누적 막대 그래프 (가로 스택)
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';

export interface StackSegment {
  value: number;
  color: string;
}

export function StackBar({ segments, height = 14 }: { segments: StackSegment[]; height?: number }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  return (
    <View style={[styles.bar, { height }]}>
      {segments.map((seg, i) => (
        <View
          key={i}
          style={{
            width: `${(seg.value / total) * 100}%`,
            backgroundColor: seg.color,
            height: '100%',
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    width: '100%',
    borderRadius: 999,
    overflow: 'hidden',
  },
});
