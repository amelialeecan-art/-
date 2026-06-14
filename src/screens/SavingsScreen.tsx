/**
 * 07 군적금 화면 (탭)
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '../components/Screen';
import { Hero } from '../components/Hero';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { AppButton } from '../components/AppButton';
import { LiveDot } from '../components/LiveDot';
import { MoneyCounter } from '../components/MoneyCounter';
import { StackBar } from '../components/StackBar';
import { LegendRow } from '../components/Legend';
import { ListRow } from '../components/ListRow';
import { Divider, H2, Label } from '../components/SectionTitle';
import { RowBetween } from '../components/Row';
import { Icon } from '../components/Icon';
import { useApp } from '../state/AppContext';
import { useNow } from '../hooks/useNow';
import { useAppNavigation } from '../navigation/types';
import { computeSavings } from '../lib/savingsCalculator';
import { formatCompactWon, formatWon } from '../lib/formatters';
import { numFontFamily } from '../theme/typography';

export function SavingsScreen() {
  const { state, colors: c } = useApp();
  const nav = useAppNavigation();
  const now = useNow(60000);
  const { service, savings } = state;
  const s = computeSavings(service, savings, now);

  if (!savings.enabled) {
    return (
      <Screen hasTab>
        <H2>군적금 현황</H2>
        <Card>
          <Text style={[styles.empty, { color: c.tx2 }]}>
            아직 군적금에 가입하지 않았어요.{'\n'}설정에서 장병내일준비적금을 켜면
            정부 매칭지원금까지 함께 계산해드려요.
          </Text>
          <AppButton label="군적금 설정하러 가기" onPress={() => (nav as any).navigate('Settings')} />
        </Card>
      </Screen>
    );
  }

  return (
    <Screen hasTab>
      <H2>군적금 현황</H2>

      <Hero onPress={() => nav.navigate('Assets')}>
        <LiveDot label="전역 시 예상 적금 수령액" />
        <MoneyCounter getValue={() => s.totalExpected} decimals={0} intSize={40} />
        <Text style={[styles.tiny, { color: c.tx2 }]}>
          군적금까지 합치면 전역자금이 이만큼 늘어요
        </Text>
      </Hero>

      <Card tight>
        <StackBar
          segments={[
            { value: s.principalTotal, color: c.segPrin },
            { value: s.matchingTotal, color: c.lime },
            { value: s.interestTotal, color: c.gold },
          ]}
        />
        <View style={{ marginTop: 6 }}>
          <LegendRow color={c.segPrin} label="내가 납입한 원금" amount={formatCompactWon(s.principalTotal)} />
          <LegendRow color={c.lime} label="정부 매칭지원금" amount={formatCompactWon(s.matchingTotal)} amountColor={c.lime} />
          <LegendRow color={c.gold} label="예상 이자" amount={formatCompactWon(s.interestTotal)} />
        </View>
      </Card>

      <Card tight>
        <ListRow label="이번 달 납입 예정액" value={formatWon(s.thisMonthDeposit)} numericValue />
        <Divider />
        <ListRow
          label="납입 완료"
          value={<Badge label={`${s.monthsPaid}개월`} tone="up" />}
        />
        <Divider />
        <ListRow label="남은 납입" value={`${s.monthsRemaining}개월`} numericValue />
      </Card>

      <Label>은행별 적금</Label>
      <View style={styles.stack}>
        {savings.banks.map((b) => (
          <Card key={b.id} tight>
            <RowBetween>
              <View style={styles.bankName}>
                <Text style={[styles.bankText, { color: c.tx }]}>🏦 {b.name}</Text>
              </View>
              <Text style={[styles.bankAmt, { color: c.tx }]}>
                {formatWon(b.amount)}
                <Text style={{ color: c.tx3, fontWeight: '400' }}>/월</Text>
              </Text>
            </RowBetween>
          </Card>
        ))}
      </View>

      <AppButton label="적금 상세 수정" variant="secondary" onPress={() => (nav as any).navigate('Settings')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  tiny: { fontSize: 12 },
  empty: { fontSize: 14, lineHeight: 21, marginBottom: 6 },
  stack: { gap: 8 },
  bankName: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bankText: { fontSize: 14, fontWeight: '600' },
  bankAmt: { fontSize: 15, fontWeight: '700', fontFamily: numFontFamily },
});
