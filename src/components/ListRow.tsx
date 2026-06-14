/**
 * 카드 내부 키-값 행. 구분선 옵션, 탭/쉐브론 옵션.
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useColors } from '../state/AppContext';
import { numFontFamily } from '../theme/typography';
import { Icon } from './Icon';

interface ListRowProps {
  label: React.ReactNode;
  value: React.ReactNode;
  numericValue?: boolean;
  valueTone?: 'default' | 'lime' | 'dim';
  onPress?: () => void;
  chevron?: boolean;
}

export function ListRow({
  label,
  value,
  numericValue,
  valueTone = 'default',
  onPress,
  chevron,
}: ListRowProps) {
  const c = useColors();
  const valueColor =
    valueTone === 'lime' ? c.lime : valueTone === 'dim' ? c.tx3 : c.tx;

  const body = (
    <View style={styles.row}>
      {typeof label === 'string' ? (
        <Text style={[styles.k, { color: c.tx2 }]}>{label}</Text>
      ) : (
        label
      )}
      <View style={styles.right}>
        {typeof value === 'string' ? (
          <Text
            style={[
              styles.v,
              { color: valueColor, fontFamily: numericValue ? numFontFamily : undefined },
            ]}
          >
            {value}
          </Text>
        ) : (
          value
        )}
        {chevron ? <Icon name="chev" size={16} color={c.tx3} /> : null}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => (pressed ? styles.pressed : null)}>
        {body}
      </Pressable>
    );
  }
  return body;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  k: {
    fontSize: 14,
    fontWeight: '500',
  },
  v: {
    fontSize: 14,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.7,
  },
});
