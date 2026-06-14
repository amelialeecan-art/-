/**
 * 상단 네비게이션 바 (뒤로가기 + 타이틀)
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useColors } from '../state/AppContext';
import { Icon } from './Icon';

interface ScreenHeaderProps {
  title?: string;
  backLabel?: string;
  onBack?: () => void;
  right?: React.ReactNode;
}

export function ScreenHeader({ title, backLabel, onBack, right }: ScreenHeaderProps) {
  const c = useColors();
  return (
    <View style={styles.bar}>
      <View style={styles.side}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            hitSlop={10}
            style={({ pressed }) => [styles.back, pressed && { opacity: 0.6 }]}
          >
            <View style={styles.chev}>
              <Icon name="chev" size={18} color={c.tx} />
            </View>
            {backLabel ? (
              <Text style={[styles.backText, { color: c.tx }]}>{backLabel}</Text>
            ) : null}
          </Pressable>
        ) : null}
      </View>
      {title ? <Text style={[styles.title, { color: c.tx }]}>{title}</Text> : null}
      <View style={[styles.side, styles.right]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 36,
    marginBottom: 2,
  },
  side: {
    minWidth: 60,
    justifyContent: 'center',
  },
  right: {
    alignItems: 'flex-end',
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  chev: {
    transform: [{ scaleX: -1 }],
  },
  backText: {
    fontSize: 15,
    fontWeight: '600',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
});
