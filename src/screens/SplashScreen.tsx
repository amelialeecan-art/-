/**
 * 01 스플래시 화면
 */
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '../components/Screen';
import { AppButton } from '../components/AppButton';
import { MoneyCounter } from '../components/MoneyCounter';
import { LiveDot } from '../components/LiveDot';
import { Icon } from '../components/Icon';
import { useApp } from '../state/AppContext';
import { useAppNavigation } from '../navigation/types';

export function SplashScreen() {
  const { colors: c } = useApp();
  const nav = useAppNavigation();

  // 장식용 카운터 (마운트 시각 기준 천천히 증가)
  const t0 = useMemo(() => Date.now(), []);
  const getValue = () => 384291.38 + 0.4629 * ((Date.now() - t0) / 1000);

  return (
    <Screen scroll={false}>
      <View style={styles.container}>
        <View style={styles.top}>
          <View style={[styles.mark, { backgroundColor: c.card, borderColor: 'rgba(182,255,77,0.3)' }]}>
            <Icon name="logo" size={46} color={c.lime} strokeWidth={1.9} />
          </View>
          <Text style={[styles.title, { color: c.tx }]}>군월급</Text>
          <Text style={[styles.sub, { color: c.tx2 }]}>군인 월급 실시간 카운터</Text>
          <View style={[styles.badge, { backgroundColor: 'rgba(182,255,77,0.1)' }]}>
            <LiveDot label="지금 이 순간에도 월급은 쌓이는 중" />
          </View>
        </View>

        <View style={styles.mid}>
          <MoneyCounter getValue={getValue} decimals={6} intSize={26} align="center" color={c.tx} />
          <Text style={[styles.tiny, { color: c.tx3 }]}>
            오늘도 복무시간이 돈으로 바뀌고 있어요
          </Text>
        </View>

        <View style={styles.bottom}>
          <AppButton label="시작하기" onPress={() => nav.navigate('OnboardingService')} />
          <Text
            style={[styles.link, { color: c.tx3 }]}
            onPress={() => nav.reset({ index: 0, routes: [{ name: 'Main' }] })}
          >
            이미 사용 중이라면 바로 홈으로 이동
          </Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  top: {
    alignItems: 'center',
    marginTop: 40,
    gap: 10,
  },
  mark: {
    width: 84,
    height: 84,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: -1,
  },
  sub: {
    fontSize: 16,
  },
  badge: {
    marginTop: 16,
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 999,
  },
  mid: {
    alignItems: 'center',
    gap: 8,
  },
  tiny: {
    fontSize: 12,
  },
  bottom: {
    gap: 12,
  },
  link: {
    textAlign: 'center',
    fontSize: 13,
  },
});
