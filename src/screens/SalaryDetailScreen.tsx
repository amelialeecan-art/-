/**
 * 06 실시간 월급 상세 화면
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '../components/Screen';
import { ScreenHeader } from '../components/ScreenHeader';
import { Hero } from '../components/Hero';
import { Card } from '../components/Card';
import { StatCard } from '../components/StatCard';
import { MoneyCounter } from '../components/MoneyCounter';
import { LiveDot } from '../components/LiveDot';
import { ProgressBar } from '../components/ProgressBar';
import { Grid2 } from '../components/Grid';
import { ListRow } from '../components/ListRow';
import { Divider } from '../components/SectionTitle';
import { useApp } from '../state/AppContext';
import { useNow } from '../hooks/useNow';
import { useAppNavigation } from '../navigation/types';
import { computeLiveSalary } from '../lib/salaryCalculator';
import { formatMonthDay } from '../lib/dateUtils';
import { formatInt, formatRate, formatWon } from '../lib/formatters';

export function SalaryDetailScreen() {
  const { state, colors: c } = useApp();
  const nav = useAppNavigation();
  const now = useNow(1000);
  const { service, settings } = state;
  const live = computeLiveSalary(service, now);

  return (
    <Screen>
      <ScreenHeader title="실시간 상세" backLabel="홈" onBack={() => nav.goBack()} />

      <Hero>
        <LiveDot label="현재 월급 구간 · 실시간 적립" />
        <MoneyCounter
          getValue={() => computeLiveSalary(service, new Date()).accrued}
          decimals={settings.decimalPlaces}
          intSize={40}
        />
      </Hero>

      <Card tight>
        <ListRow label="월급 구간 시작일" value={formatMonthDay(live.period.start)} numericValue />
        <Divider />
        <ListRow label="다음 월급일" value={formatMonthDay(live.period.end)} numericValue valueTone="lime" />
        <Divider />
        <ListRow label="구간 진행률" value={`${Math.round(live.progress * 100)}%`} numericValue />
      </Card>

      <ProgressBar value={live.progress} />

      <Grid2>
        <StatCard title="이번 달 예상 월급" value={formatWon(live.salary)} valueSize={17} />
        <StatCard title="현재까지 쌓인 금액" value={formatWon(live.accrued)} valueSize={17} />
        <StatCard title="아직 남은 금액" value={formatWon(live.remaining)} valueSize={17} />
        <StatCard title="초당 증가액 ⚡" value={formatRate(live.perSecond)} valueSize={17} highlight limeValue />
      </Grid2>

      <Card tight>
        <ListRow label="분당 증가액" value={`₩ ${live.perMinute.toFixed(2)}`} numericValue />
        <Divider />
        <ListRow label="시간당 증가액" value={`₩ ${formatInt(live.perHour)}`} numericValue />
        <Divider />
        <ListRow label="하루 증가액" value={`₩ ${formatInt(live.perDay)}`} numericValue />
      </Card>

      <Card variant="sub" tight>
        <Text style={[styles.title, { color: c.tx }]}>🧮 계산 기준 설명</Text>
        <Divider />
        <Text style={[styles.note, { color: c.tx2 }]}>
          월급 ÷ 한 달 기간(초) × 경과한 시간 으로 실시간 환산해요.{'\n'}
          현재 계급 월급 {formatWon(live.salary)}을(를) 이번 월급 구간{' '}
          {Math.round(live.totalSeconds / 86400)}일에 나눠 1초마다{' '}
          {formatRate(live.perSecond)}씩 쌓이는 셈이에요.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 14, fontWeight: '700' },
  note: { fontSize: 13, lineHeight: 20 },
});
