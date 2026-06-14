/**
 * 화면 레이아웃 래퍼
 * SafeArea + 배경색 + 스크롤 영역 + 일관된 패딩/간격.
 */
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useColors } from '../state/AppContext';

interface ScreenProps {
  children: React.ReactNode;
  /** 하단 탭바가 있는 화면이면 true (하단 여백 추가) */
  hasTab?: boolean;
  scroll?: boolean;
  /** 상단 SafeArea 패딩 적용 여부 */
  topInset?: boolean;
}

export function Screen({ children, hasTab, scroll = true, topInset = true }: ScreenProps) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const paddingTop = topInset ? insets.top + 8 : 12;
  const paddingBottom = (hasTab ? 96 : 24) + insets.bottom;

  if (!scroll) {
    return (
      <View style={[styles.flex, { backgroundColor: c.bg, paddingTop, paddingBottom }]}>
        <View style={styles.content}>{children}</View>
      </View>
    );
  }

  return (
    <View style={[styles.flex, { backgroundColor: c.bg }]}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop, paddingBottom }]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    gap: 12,
  },
});
