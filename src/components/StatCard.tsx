/**
 * 통계 카드 (그리드용)
 * 아이콘 + 제목 + 값
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useColors } from '../state/AppContext';
import { numFontFamily } from '../theme/typography';
import { Card } from './Card';
import { Icon, IconName } from './Icon';

interface StatCardProps {
  title: string;
  value: string;
  icon?: IconName;
  highlight?: boolean;
  limeValue?: boolean;
  onPress?: () => void;
  valueSize?: number;
}

export function StatCard({
  title,
  value,
  icon,
  highlight,
  limeValue,
  onPress,
  valueSize = 19,
}: StatCardProps) {
  const c = useColors();
  return (
    <Card variant={highlight ? 'hi' : 'default'} tight onPress={onPress} style={styles.card}>
      {icon ? (
        <View
          style={[
            styles.iconWrap,
            {
              backgroundColor: highlight ? 'rgba(182,255,77,0.15)' : c.inset,
            },
          ]}
        >
          <Icon name={icon} size={16} color={highlight ? c.lime : c.tx2} />
        </View>
      ) : null}
      <Text style={[styles.title, { color: c.tx2 }]} numberOfLines={1}>
        {title}
      </Text>
      <Text
        style={[
          styles.value,
          { color: limeValue ? c.lime : c.tx, fontSize: valueSize },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {value}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    gap: 6,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
  },
  value: {
    fontWeight: '700',
    fontFamily: numFontFamily,
  },
});
