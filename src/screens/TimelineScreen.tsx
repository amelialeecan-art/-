/**
 * 09 월별 타임라인 화면 (탭)
 */
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { Badge, RankBadge } from '../components/Badge';
import { Segmented } from '../components/Segmented';
import { RowBetween } from '../components/Row';
import { H2 } from '../components/SectionTitle';
import { useApp } from '../state/AppContext';
import { useNow } from '../hooks/useNow';
import { buildTimeline, MonthEntry, MonthStatus } from '../lib/timeline';
import { formatCompactWon, formatManWon, formatWon } from '../lib/formatters';
import { numFontFamily } from '../theme/typography';

type Filter = 'all' | MonthStatus;

export function TimelineScreen() {
  const { state, colors: c } = useApp();
  const now = useNow(60000);
  const { service, savings } = state;
  const [filter, setFilter] = useState<Filter>('all');

  const entries = useMemo(
    () => buildTimeline(service, savings, now),
    [service, savings, now],
  );
  const filtered = filter === 'all' ? entries : entries.filter((e) => e.status === filter);

  return (
    <Screen hasTab>
      <H2>월별 타임라인</H2>
      <Segmented
        value={filter}
        onChange={setFilter}
        options={[
          { label: '전체', value: 'all' },
          { label: '지난', value: 'past' },
          { label: '현재', value: 'now' },
          { label: '미래', value: 'future' },
        ]}
      />

      <View style={styles.list}>
        {filtered.map((e) => (
          <MonthCard key={`${e.year}-${e.monthIndex}`} entry={e} />
        ))}
      </View>

      <Text style={[styles.foot, { color: c.tx3 }]}>
        입대월 ~ 전역월 전체 {entries.length}개월
      </Text>
    </Screen>
  );
}

function MonthCard({ entry }: { entry: MonthEntry }) {
  const { colors: c } = useApp();
  const isNow = entry.status === 'now';
  const dim = entry.status === 'past';

  return (
    <Card variant={isNow ? 'hi' : 'default'} tight style={dim ? { opacity: 0.7 } : undefined}>
      <RowBetween>
        <View style={styles.dateWrap}>
          {entry.isPromotion ? (
            <Badge label={entry.rank} tone="up" />
          ) : isNow ? (
            <RankBadge rank={entry.rank} highlight />
          ) : (
            <Badge label={entry.rank} tone="gray" />
          )}
          <Text style={[styles.date, { color: c.tx }]}>
            {entry.year} · {String(entry.monthIndex + 1).padStart(2, '0')}
          </Text>
          {isNow ? <Text style={[styles.tag, { color: c.lime }]}>◀ 현재</Text> : null}
          {entry.isDischargeMonth ? <Text style={[styles.tag, { color: c.gold }]}>전역</Text> : null}
        </View>
        <Text style={[styles.pay, { color: c.tx }]}>{formatWon(entry.salary)}</Text>
      </RowBetween>

      <Text style={[styles.meta, { color: c.tx2 }]}>
        월급 {entry.payDay}일 · 적금 {formatManWon(entry.savingsDeposit)} · 매칭{' '}
        {formatManWon(entry.matching)}
      </Text>
      <RowBetween>
        <Text style={[styles.acc, { color: c.tx3 }]}>
          누적 월급 {formatCompactWon(entry.cumulativeSalary)}
        </Text>
        <Text style={[styles.acc, { color: c.tx3 }]}>
          누적 적금 {formatCompactWon(entry.cumulativeSavings)}
        </Text>
      </RowBetween>
    </Card>
  );
}

const styles = StyleSheet.create({
  list: { gap: 8, marginTop: 2 },
  dateWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  date: { fontSize: 14, fontWeight: '700', fontFamily: numFontFamily },
  tag: { fontSize: 11, fontWeight: '700' },
  pay: { fontSize: 15, fontWeight: '700', fontFamily: numFontFamily },
  meta: { fontSize: 12 },
  acc: { fontSize: 12, fontFamily: numFontFamily },
  foot: { fontSize: 12, textAlign: 'center', marginTop: 4 },
});
