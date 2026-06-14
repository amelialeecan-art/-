/**
 * 2열 그리드 레이아웃 헬퍼.
 * 자식들을 2개씩 한 행으로 배치한다.
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';

export function Grid2({ children }: { children: React.ReactNode }) {
  const items = React.Children.toArray(children);
  const rows: React.ReactNode[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2));
  }
  return (
    <View style={styles.wrap}>
      {rows.map((row, idx) => (
        <View key={idx} style={styles.row}>
          {row}
          {row.length === 1 ? <View style={styles.spacer} /> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  spacer: {
    flex: 1,
  },
});
