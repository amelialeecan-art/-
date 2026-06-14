/**
 * 커스텀 하단 탭바
 * 프로토타입의 둥근 탭바 스타일을 재현.
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useColors } from '../state/AppContext';
import { Icon, IconName } from '../components/Icon';

const TAB_META: Record<string, { label: string; icon: IconName }> = {
  Home: { label: '홈', icon: 'home' },
  Savings: { label: '적금', icon: 'bank' },
  Timeline: { label: '타임라인', icon: 'timeline' },
  Goals: { label: '목표', icon: 'goal' },
  Settings: { label: '설정', icon: 'settings' },
};

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const c = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: c.card,
          borderColor: c.line,
          paddingBottom: Math.max(insets.bottom, 8),
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const meta = TAB_META[route.name];
        if (!meta) return null;
        const color = focused ? c.lime : c.tx3;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable key={route.key} onPress={onPress} style={styles.tab}>
            <Icon name={meta.icon} size={22} color={color} strokeWidth={focused ? 2.2 : 1.9} />
            <Text style={[styles.label, { color }]}>{meta.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 9,
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
  },
});
