/**
 * 11 통계 화면
 */
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '../components/Screen';
import { ScreenHeader } from '../components/ScreenHeader';
import { Card } from '../components/Card';
import { StatCard } from '../components/StatCard';
import { Badge, RankBadge } from '../components/Badge';
import { VBars } from '../components/VBars';
import { Grid2 } from '../components/Grid';
import { ListRow } from '../components/ListRow';
import { Divider, Label } from '../components/SectionTitle';
import { RowBetween } from '../components/Row';
import { useApp } from '../state/AppContext';
import { useNow } from '../hooks/useNow';
import { useAppNavigation } from '../navigation/types';
import {
  getDailyAverage,
  getFutureSalary,
  getSalaryByRank,
  getTotalReceived,
} from '../lib/salaryCalculator';
import { computeSavings } from '../lib/savingsCalculator';
import { computeAssets } from '../lib/assets';
import { buildTimeline } from '../lib/timeline';
import { formatCompactWon, formatWon } from '../lib/formatters';
import { RANK_ORDER } from '../types';
import { numFontFamily } from '../theme/typography';

export function StatsScreen() {
  const { state, colors: c } = useApp();
  const nav = useAppNavigation();
  const now = useNow(60000);
  const { service, savings } = state;

  const received = getTotalReceived(service, now);
  const future = getFutureSalary(service, now);
  const sav = computeSavings(service, savings, now);
  const assets = computeAssets(service, savings, now);
  const byRank = getSalaryByRank(service);
  const daily = getDailyAverage(service);

  const timeline = useMemo(() => buildTimeline(service, savings, now), [service, savings, now]);
  const nowIndex = timeline.findIndex((e) => e.status === 'now');

  // 막대 그래프용: 최대 12개월 샘플
  const sample = (arr: number[]) => {
    if (arr.length <= 12) return { values: arr, offset: 0 };
    const start = Math.max(0, Math.min(arr.length - 12, (nowIndex < 0 ? arr.length : nowIndex) - 6));
    return { values: arr.slice(start, start + 12), offset: start };
  };
  const salarySample = sample(timeline.map((e) => e.salary));
  const savingsSample = sample(timeline.map((e) => e.cumulativeSavings));

  return (
    <Screen>
      <ScreenHeader title="통계 리포트" backLabel="설정" onBack={() => nav.goBack()} />

      <Grid2>
        <StatCard title="총 받은 월급" value={formatCompactWon(received)} valueSize={17} />
        <StatCard title="앞으로 받을 월급" value={formatCompactWon(future)} valueSize={17} />
        <StatCard title="총 적금 원금" value={formatCompactWon(sav.principalTotal)} valueSize={17} />
        <StatCard title="총 매칭지원금" value={formatCompactWon(sav.matchingTotal)} valueSize={17} limeValue />
      </Grid2>

      <Card variant="hi" tight>
        <RowBetween>
          <Text style={[styles.statT, { color: c.tx2 }]}>예상 전역자금</Text>
          <Badge label="최종" tone="lime" />
        </RowBetween>
        <Text style={[styles.bigV, { color: c.lime }]}>{formatWon(assets.total)}</Text>
      </Card>

      <Label>월별 수령 추이</Label>
      <Card tight>
        <VBars
          data={salarySample.values}
          highlightIndex={nowIndex >= 0 ? nowIndex - salarySample.offset : undefined}
        />
      </Card>

      <Label>적금 누적 추이</Label>
      <Card tight>
        <VBars
          data={savingsSample.values}
          highlightIndex={nowIndex >= 0 ? nowIndex - savingsSample.offset : undefined}
        />
      </Card>

      <Label>계급별 월급 합계</Label>
      <Card tight>
        {RANK_ORDER.map((rank, i) => (
          <React.Fragment key={rank}>
            {i > 0 ? <Divider /> : null}
            <ListRow
              label={<RankBadge rank={rank} />}
              value={formatCompactWon(byRank[rank])}
              numericValue
            />
          </React.Fragment>
        ))}
      </Card>

      <Card variant="hi" tight>
        <Text style={[styles.statT, { color: c.tx }]}>💡 복무 전체 기준 하루 평균</Text>
        <Text style={[styles.bigV, { color: c.tx }]}>
          {formatWon(daily)}
          <Text style={{ fontSize: 14, fontWeight: '400', color: c.tx3 }}> / 일</Text>
        </Text>
        <Text style={[styles.tiny, { color: c.tx3 }]}>
          하루를 버틸 때마다 약 {formatWon(daily)}씩 쌓이는 셈이에요
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  statT: { fontSize: 13, fontWeight: '600' },
  bigV: { fontSize: 24, fontWeight: '700', fontFamily: numFontFamily },
  tiny: { fontSize: 12 },
});
