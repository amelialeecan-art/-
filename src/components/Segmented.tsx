/**
 * 세그먼트 컨트롤 (프로토타입 .seg 재현)
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useColors } from '../state/AppContext';
import { radius } from '../theme/typography';

interface SegmentedProps<T extends string | number> {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
}

export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
}: SegmentedProps<T>) {
  const c = useColors();
  return (
    <View style={[styles.seg, { backgroundColor: c.inset }]}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={String(opt.value)}
            onPress={() => onChange(opt.value)}
            style={[styles.item, active && { backgroundColor: c.lime }]}
          >
            <Text
              style={[
                styles.label,
                { color: active ? c.onLime : c.tx2 },
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  seg: {
    flexDirection: 'row',
    borderRadius: radius.pill,
    padding: 3,
    gap: 2,
  },
  item: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
  },
});
