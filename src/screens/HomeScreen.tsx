/**
 * 05 홈 화면 — 앱의 핵심.
 * 실시간 월급 카운터 + 요약 카드.
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '../components/Screen';
import { Hero } from '../components/Hero';
import { Card } from '../components/Card';
import { StatCard } from '../components/StatCard';
import { MoneyCounter } from '../components/MoneyCounter';
import { LiveDot } from '../components/LiveDot';
import { ProgressBar } from '../components/ProgressBar';
import { Badge, RankBadge } from '../components/Badge';
import { Grid2 } from '../components/Grid';
import { Row, RowBetween } from '../components/Row';
import { Icon } from '../components/Icon';
import { useApp } from '../state/AppContext';
import { useNow } from '../hooks/useNow';
import { useAppNavigation } from '../navigation/types';
import {
  computeLiveSalary,
  getNextPromotion,
  getRankAtDate,
  getTotalReceived,
  getFutureSalary,
} from '../lib/salaryCalculator';
import { computeSavings } from '../lib/savingsCalculator';
import { computeAssets } from '../lib/assets';
import {
  countdownTo,
  dDay,
  parseISODate,
  payDayOfMonth,
  serviceDayCount,
} from '../lib/dateUtils';
import { formatCompactWon, formatInt, formatRate, formatWon } from '../lib/formatters';
import { numFontFamily } from '../theme/typography';

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function HomeScreen() {
  const { state, colors: c } = useApp();
  const nav = useAppNavigation();
  const now = useNow(1000);
  const { service, savings, settings } = state;

  const enlist = parseISODate(service.enlistmentDate);
  const discharge = parseISODate(service.dischargeDate);

  const live = computeLiveSalary(service, now);
  const promo = getNextPromotion(service, now);
  const received = getTotalReceived(service, now);
  const future = getFutureSalary(service, now);
  const assets = computeAssets(service, savings, now);
  const sav = computeSavings(service, savings, now);

  const serviceDay = serviceDayCount(enlist, now);
  const dischargeDday = dDay(discharge, now);
  const isDischarged = dischargeDday <= 0;
  const cd = countdownTo(live.period.end, now);

  const nextPayRank = getRankAtDate(service, live.period.end);
  const nextPaySalary = service.rankSalaryTable[nextPayRank];

  // 오늘이 월급날인지
  const todaysPayday = payDayOfMonth(now.getFullYear(), now.getMonth(), service.monthlyPayDay);
  const isPayday = serviceDayCount(todaysPayday, now) === 1;

  return (
    <Screen hasTab>
      {/* 앱바 */}
      <RowBetween>
        <Row gap={8}>
          <View style={[styles.dotmark, { backgroundColor: c.card, borderColor: c.line }]}>
            <Icon name="logo" size={13} color={c.lime} strokeWidth={2.4} />
          </View>
          <Text style={[styles.wm, { color: c.tx }]}>군월급</Text>
        </Row>
        <Pressable
          onPress={() => nav.navigate('Notifications')}
          style={[styles.bell, { backgroundColor: c.card, borderColor: c.line }]}
        >
          <Icon name="bell" size={20} color={c.tx2} />
          <View style={[styles.bellDot, { backgroundColor: c.danger, borderColor: c.card }]} />
        </Pressable>
      </RowBetween>

      {/* 전역/월급날 배너 */}
      {isDischarged ? (
        <Card
          tight
          onPress={() => nav.navigate('Celebration', undefined)}
          style={[styles.banner, { borderColor: 'rgba(182,255,77,0.3)' }]}
        >
          <Text style={styles.bannerEmoji}>🎖️</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.bannerTitle, { color: c.tx }]}>전역을 축하합니다!</Text>
            <Text style={[styles.tiny, { color: c.tx2 }]}>전역 축하 화면 보기</Text>
          </View>
          <Icon name="chev" size={16} color={c.tx3} />
        </Card>
      ) : isPayday ? (
        <Card
          tight
          onPress={() => nav.navigate('Notifications')}
          style={[styles.banner, { borderColor: 'rgba(182,255,77,0.25)' }]}
        >
          <Text style={styles.bannerEmoji}>🎉</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.bannerTitle, { color: c.tx }]}>오늘은 월급날!</Text>
            <Text style={[styles.tiny, { color: c.tx2 }]}>
              {formatWon(live.salary)}이 입금됐어요 · 알림 보기
            </Text>
          </View>
          <Icon name="chev" size={16} color={c.tx3} />
        </Card>
      ) : null}

      {/* 상단 계급/디데이 */}
      <RowBetween align="flex-start">
        <View>
          <RankBadge rank={live.rank} />
          <Text style={[styles.dim, { color: c.tx2, marginTop: 7 }]}>입대 {serviceDay}일차</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[styles.dday, { color: c.lime }]}>
            전역 D-{Math.max(0, dischargeDday)}
          </Text>
          <Text style={[styles.tiny, { color: c.tx2, marginTop: 3 }]}>
            {promo.daysLeft != null ? `다음 진급까지 D-${promo.daysLeft}` : '최고 계급 달성 🎖️'}
          </Text>
        </View>
      </RowBetween>

      {/* 메인 히어로 — 실시간 카운터 */}
      <Hero onPress={() => nav.navigate('SalaryDetail')}>
        <RowBetween>
          <LiveDot label="이번 월급 · 실시간 적립 중" />
          <Badge label="LIVE" tone="live" />
        </RowBetween>
        <MoneyCounter
          getValue={() => computeLiveSalary(service, new Date()).accrued}
          decimals={settings.decimalPlaces}
          intSize={42}
        />
        <RowBetween>
          <Text style={[styles.heroMeta, { color: c.tx2 }]}>다음 월급일까지</Text>
          <Text style={[styles.heroMetaNum, { color: c.tx }]}>
            D-{cd.days} · {pad(cd.hours)}:{pad(cd.minutes)}:{pad(cd.seconds)}
          </Text>
        </RowBetween>
        <View style={{ gap: 6 }}>
          <ProgressBar value={live.progress} />
          <RowBetween>
            <Text style={[styles.tiny, { color: c.tx2 }]}>이번 월급 진행률</Text>
            <Text style={[styles.progressPct, { color: c.lime }]}>
              {Math.round(live.progress * 100)}%
            </Text>
          </RowBetween>
        </View>
      </Hero>

      {/* 요약 통계 */}
      <Grid2>
        <StatCard title="다음 월급 예상액" value={formatCompactWon(nextPaySalary)} icon="won" />
        <StatCard title="지금까지 받은 총 월급" value={formatCompactWon(received)} icon="coins" />
        <StatCard title="전역까지 남은 월급" value={formatCompactWon(future)} icon="clock" />
        <StatCard
          title="전역 예상 총자산"
          value={formatCompactWon(assets.total)}
          icon="flag"
          highlight
          limeValue
          onPress={() => nav.navigate('Assets')}
        />
      </Grid2>

      {/* 군적금 진행률 */}
      <Card tight onPress={() => (nav as any).navigate('Savings')}>
        <RowBetween>
          <Row gap={8}>
            <Icon name="bank" size={16} color={c.tx2} />
            <Text style={[styles.statT, { color: c.tx2 }]}>군적금 진행률</Text>
          </Row>
          <Text style={[styles.tinyNum, { color: c.tx2 }]}>
            {sav.monthsPaid} / {sav.totalMonths}개월
          </Text>
        </RowBetween>
        <ProgressBar value={sav.progress} tone="gold" />
      </Card>

      {/* 시간 단위 적립 */}
      <Card variant="sub" tight>
        <RowBetween>
          <Text style={[styles.statT, { color: c.tx }]}>내 시간이 돈으로 바뀌는 중</Text>
          <Text style={[styles.tinyNum, { color: c.lime }]}>
            오늘 +{formatWon(live.perDay)}
          </Text>
        </RowBetween>
        <Grid2>
          <RateChip label="1시간당" value={`₩ ${formatInt(live.perHour)}`} />
          <RateChip label="1분당" value={`₩ ${live.perMinute.toFixed(1)}`} />
          <RateChip label="1초당" value={formatRate(live.perSecond, 2)} lime />
          <RateChip label="오늘" value={`₩ ${formatInt(live.perDay)}`} />
        </Grid2>
      </Card>
    </Screen>
  );
}

function RateChip({ label, value, lime }: { label: string; value: string; lime?: boolean }) {
  const { colors: c } = useApp();
  return (
    <View style={[styles.rateChip, { backgroundColor: c.inset }]}>
      <Text style={[styles.tiny, { color: c.tx3 }]}>{label}</Text>
      <Text style={[styles.tinyNum, { color: lime ? c.lime : c.tx }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dotmark: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wm: { fontSize: 17, fontWeight: '800', letterSpacing: -0.4 },
  bell: {
    width: 40,
    height: 40,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  bannerEmoji: { fontSize: 18 },
  bannerTitle: { fontSize: 14, fontWeight: '700' },
  tiny: { fontSize: 12 },
  tinyNum: { fontSize: 13, fontWeight: '700', fontFamily: numFontFamily },
  dim: { fontSize: 13, fontFamily: numFontFamily },
  dday: { fontSize: 21, fontWeight: '700', fontFamily: numFontFamily },
  heroMeta: { fontSize: 13 },
  heroMetaNum: { fontSize: 13, fontWeight: '600', fontFamily: numFontFamily },
  progressPct: { fontSize: 13, fontWeight: '700', fontFamily: numFontFamily },
  statT: { fontSize: 13, fontWeight: '600' },
  rateChip: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 11,
    paddingHorizontal: 11,
    paddingVertical: 9,
  },
});
