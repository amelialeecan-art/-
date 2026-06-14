/**
 * 14 전역 축하 화면
 */
import React, { useState } from 'react';
import { Share, StyleSheet, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';

import { Screen } from '../components/Screen';
import { Hero } from '../components/Hero';
import { Card } from '../components/Card';
import { StatCard } from '../components/StatCard';
import { MoneyCounter } from '../components/MoneyCounter';
import { Confetti } from '../components/Confetti';
import { AppButton } from '../components/AppButton';
import { Grid2 } from '../components/Grid';
import { Icon } from '../components/Icon';
import { useApp } from '../state/AppContext';
import { useAppNavigation } from '../navigation/types';
import {
  getTotalReceived,
  getTotalServiceSalary,
} from '../lib/salaryCalculator';
import { computeSavings } from '../lib/savingsCalculator';
import { computeAssets } from '../lib/assets';
import { formatSpaced, parseISODate } from '../lib/dateUtils';
import { formatCompactWon, formatWon } from '../lib/formatters';

export function CelebrationScreen() {
  const { state, colors: c } = useApp();
  const nav = useAppNavigation();
  const route = useRoute();
  const { service, savings } = state;
  const [runKey, setRunKey] = useState(0);

  const now = new Date();
  const discharge = parseISODate(service.dischargeDate);
  const isPreview = (route.params as { preview?: boolean } | undefined)?.preview;

  const serviceSalary = getTotalServiceSalary(service);
  const received = getTotalReceived(service, now);
  const sav = computeSavings(service, savings, now);
  const assets = computeAssets(service, savings, now);
  const savingsTotal = sav.principalTotal + sav.matchingTotal;

  const share = async () => {
    try {
      await Share.share({
        message: `군 복무 완료! 전역 예상 총자산은 ${formatWon(assets.total)} 입니다. (군월급 앱)`,
      });
    } catch {
      // 사용자가 취소한 경우 무시
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Confetti runKey={runKey} />
      <Screen>
        <View style={styles.top}>
          <View style={[styles.medal, { backgroundColor: c.card, borderColor: 'rgba(182,255,77,0.35)' }]}>
            <Icon name="medal" size={50} color={c.lime} strokeWidth={1.7} />
          </View>
          <Text style={[styles.date, { color: c.lime }]}>{formatSpaced(discharge)}</Text>
          <Text style={[styles.title, { color: c.tx }]}>전역을 진심으로{'\n'}축하합니다 🎖️</Text>
          <Text style={[styles.lead, { color: c.tx2 }]}>
            정말 고생 많았어요.{'\n'}이제 이 돈은 온전히 당신 거예요.
          </Text>
        </View>

        <Hero>
          <Text style={[styles.heroLabel, { color: c.tx2 }]}>🏆 최종 전역자금</Text>
          <MoneyCounter getValue={() => assets.total} decimals={0} intSize={40} align="center" />
        </Hero>

        <Grid2>
          <StatCard title="복무 전체 월급" value={formatCompactWon(serviceSalary)} valueSize={17} />
          <StatCard title="군적금 + 매칭" value={formatCompactWon(savingsTotal)} valueSize={17} highlight limeValue />
        </Grid2>

        <View style={{ gap: 10, marginTop: 6 }}>
          <AppButton
            label={isPreview ? '돌아가기' : '홈으로 돌아가기'}
            onPress={() => (isPreview ? nav.goBack() : nav.reset({ index: 0, routes: [{ name: 'Main' }] }))}
          />
          <AppButton label="다시 보기" variant="secondary" icon="refresh" onPress={() => setRunKey((k) => k + 1)} />
          <AppButton label="전역자금 공유하기" variant="secondary" icon="share" onPress={share} />
        </View>
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  top: {
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  medal: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  date: { fontSize: 15, fontWeight: '700', letterSpacing: 1 },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center', lineHeight: 34, marginTop: 4 },
  lead: { fontSize: 14, textAlign: 'center', lineHeight: 21, marginTop: 4 },
  heroLabel: { fontSize: 14, fontWeight: '600', textAlign: 'center' },
});
