/**
 * 배지 / 칩 / 계급 배지
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useColors } from '../state/AppContext';
import { numFontFamily } from '../theme/typography';
import type { Rank } from '../types';
import { rankLevel } from '../lib/salaryCalculator';

type BadgeTone = 'lime' | 'gray' | 'gold' | 'up' | 'live';

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
}

export function Badge({ label, tone = 'gray' }: BadgeProps) {
  const c = useColors();
  const map: Record<BadgeTone, { bg: string; fg: string }> = {
    lime: { bg: 'rgba(182,255,77,0.13)', fg: c.lime },
    live: { bg: 'rgba(182,255,77,0.1)', fg: c.lime },
    gray: { bg: 'rgba(255,255,255,0.06)', fg: c.tx2 },
    gold: { bg: 'rgba(245,196,81,0.16)', fg: c.gold },
    up: { bg: 'rgba(52,211,153,0.14)', fg: c.up },
  };
  const { bg, fg } = map[tone];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color: fg }]}>{label}</Text>
    </View>
  );
}

/** 계급 배지: 점(dot) 개수로 계급 표시 */
export function RankBadge({ rank, highlight }: { rank: Rank; highlight?: boolean }) {
  const c = useColors();
  const level = rankLevel(rank);
  const dotColor = highlight ? c.onLime : c.lime;
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: highlight ? c.lime : 'rgba(255,255,255,0.06)',
        },
      ]}
    >
      <View style={styles.dots}>
        {Array.from({ length: level }).map((_, i) => (
          <View key={i} style={[styles.dot, { backgroundColor: dotColor }]} />
        ))}
      </View>
      <Text
        style={[
          styles.badgeText,
          { color: highlight ? c.onLime : c.tx, fontWeight: '700' },
        ]}
      >
        {rank}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: numFontFamily,
  },
  dots: {
    flexDirection: 'row',
    gap: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
