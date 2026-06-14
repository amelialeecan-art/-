/**
 * 08 전역 예상 자산 화면
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '../components/Screen';
import { ScreenHeader } from '../components/ScreenHeader';
import { Hero } from '../components/Hero';
import { Card } from '../components/Card';
import { StatCard } from '../components/StatCard';
import { MoneyCounter } from '../components/MoneyCounter';
import { StackBar } from '../components/StackBar';
import { LegendRow } from '../components/Legend';
import { Grid2 } from '../components/Grid';
import { Label } from '../components/SectionTitle';
import { Icon } from '../components/Icon';
import { useApp } from '../state/AppContext';
import { useNow } from '../hooks/useNow';
import { useAppNavigation } from '../navigation/types';
import { computeAssets } from '../lib/assets';
import { formatCompactWon } from '../lib/formatters';
import { formatDot as fmtDot } from '../lib/dateUtils';

export function AssetsScreen() {
  const { state, colors: c } = useApp();
  const nav = useAppNavigation();
  const now = useNow(60000);
  const { service, savings } = state;
  const a = computeAssets(service, savings, now);

  return (
    <Screen>
      <ScreenHeader title="전역 예상 자산" backLabel="뒤로" onBack={() => nav.goBack()} />

      <Grid2>
        <StatCard title="전역일" value={fmtDot(a.dischargeDate)} valueSize={17} />
        <StatCard title="전역 D-DAY" value={`D-${Math.max(0, a.dDay)}`} valueSize={17} highlight limeValue />
      </Grid2>

      <Hero>
        <Text style={[styles.heroLabel, { color: c.tx2 }]}>🎖️ 전역할 때 내 손에 들어올 돈</Text>
        <MoneyCounter getValue={() => a.total} decimals={0} intSize={40} />
        <Text style={[styles.tiny, { color: c.lime }]}>전역하면 이만큼 모여 있어요</Text>
      </Hero>

      <Label>항목별 누적</Label>
      <Card tight>
        <StackBar
          segments={[
            { value: a.serviceSalary, color: c.segPay },
            { value: a.principal, color: c.segPrin },
            { value: a.matching, color: c.lime },
            { value: a.interest, color: c.gold },
          ]}
        />
        <View style={{ marginTop: 6 }}>
          <LegendRow color={c.segPay} label="복무 전체 예상 월급" amount={formatCompactWon(a.serviceSalary)} />
          <LegendRow color={c.segPrin} label="군적금 원금" amount={formatCompactWon(a.principal)} />
          <LegendRow color={c.lime} label="정부 매칭지원금" amount={formatCompactWon(a.matching)} amountColor={c.lime} />
          <LegendRow color={c.gold} label="예상 이자" amount={formatCompactWon(a.interest)} />
        </View>
      </Card>

      <View style={[styles.info, { backgroundColor: c.inset }]}>
        <Icon name="shield" size={16} color={c.tx3} />
        <Text style={[styles.infoText, { color: c.tx2 }]}>
          실제 수령액은 정책, 금리, 납입 여부에 따라 달라질 수 있어요.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroLabel: { fontSize: 14, fontWeight: '600' },
  tiny: { fontSize: 12 },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 14,
  },
  infoText: { fontSize: 13, flex: 1 },
});
