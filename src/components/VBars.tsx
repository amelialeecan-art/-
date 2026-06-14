/**
 * 세로 막대 그래프
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useColors } from '../state/AppContext';

interface VBarsProps {
  data: number[];
  /** 강조할 인덱스 */
  highlightIndex?: number;
  /** 하단 라벨 (선택) */
  labels?: string[];
  height?: number;
}

export function VBars({ data, highlightIndex, labels, height = 110 }: VBarsProps) {
  const c = useColors();
  const max = Math.max(1, ...data);
  return (
    <View style={{ gap: 6 }}>
      <View style={[styles.bars, { height }]}>
        {data.map((v, i) => {
          const on = i === highlightIndex;
          return (
            <View
              key={i}
              style={[
                styles.bar,
                {
                  height: `${Math.max(4, (v / max) * 100)}%`,
                  backgroundColor: on ? c.lime : c.card3,
                },
              ]}
            />
          );
        })}
      </View>
      {labels ? (
        <View style={styles.labels}>
          {labels.map((l, i) => (
            <Text key={i} style={[styles.label, { color: c.tx3 }]}>
              {l}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 5,
  },
  bar: {
    flex: 1,
    borderRadius: 5,
    minHeight: 4,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 10,
    flex: 1,
    textAlign: 'center',
  },
});
