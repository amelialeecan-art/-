/**
 * 04 온보딩 3단계 — 군적금 설정
 */
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '../components/Screen';
import { ScreenHeader } from '../components/ScreenHeader';
import { ProgressBar } from '../components/ProgressBar';
import { Field } from '../components/Field';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { AppButton } from '../components/AppButton';
import { Grid2 } from '../components/Grid';
import { RowBetween } from '../components/Row';
import { ToggleSwitch } from '../components/ToggleSwitch';
import { H1, Label } from '../components/SectionTitle';
import { Icon } from '../components/Icon';
import { InputModal } from '../components/InputModal';
import { useApp } from '../state/AppContext';
import { useAppNavigation } from '../navigation/types';
import { formatPercent, formatWon } from '../lib/formatters';
import { numFontFamily } from '../theme/typography';

type EditTarget =
  | { kind: 'deposit' }
  | { kind: 'matching' }
  | { kind: 'interest' }
  | { kind: 'bank'; id: string }
  | null;

export function OnboardingSavingsScreen() {
  const { state, colors: c, updateSavings, completeOnboarding } = useApp();
  const nav = useAppNavigation();
  const { savings } = state;
  const [edit, setEdit] = useState<EditTarget>(null);

  const submit = (raw: string) => {
    if (!edit) return;
    const n = parseFloat(raw.replace(/[^0-9.]/g, ''));
    if (Number.isNaN(n)) return;
    if (edit.kind === 'deposit') {
      updateSavings({ monthlyDeposit: Math.max(0, Math.round(n)) });
    } else if (edit.kind === 'matching') {
      updateSavings({ matchingRate: Math.max(0, n) / 100 });
    } else if (edit.kind === 'interest') {
      updateSavings({ interestRate: Math.max(0, n) / 100 });
    } else if (edit.kind === 'bank') {
      const banks = savings.banks.map((b) =>
        b.id === edit.id ? { ...b, amount: Math.max(0, Math.round(n)) } : b,
      );
      updateSavings({ banks, monthlyDeposit: banks.reduce((s, b) => s + b.amount, 0) });
    }
  };

  const addBank = () => {
    const banks = [
      ...savings.banks,
      { id: `bank-${Date.now()}`, name: '새 은행', amount: 100000 },
    ];
    updateSavings({ banks, monthlyDeposit: banks.reduce((s, b) => s + b.amount, 0) });
  };

  const finish = () => {
    completeOnboarding();
    nav.reset({ index: 0, routes: [{ name: 'Main' }] });
  };

  const mp = (() => {
    if (!edit) return { title: '', initialValue: '', unit: '' };
    if (edit.kind === 'deposit') return { title: '월 납입액', initialValue: String(savings.monthlyDeposit), unit: '원' };
    if (edit.kind === 'matching') return { title: '매칭지원금 비율', initialValue: String(Math.round(savings.matchingRate * 100)), unit: '%' };
    if (edit.kind === 'interest') return { title: '예상 금리 (연)', initialValue: String(savings.interestRate * 100), unit: '%' };
    const bank = savings.banks.find((b) => b.id === edit.id);
    return { title: `${bank?.name ?? '은행'} 납입액`, initialValue: String(bank?.amount ?? 0), unit: '원' };
  })();

  return (
    <Screen>
      <ScreenHeader onBack={() => nav.goBack()} right={<Text style={[styles.step, { color: c.tx2 }]}>3 / 3</Text>} />
      <ProgressBar value={1} slim />
      <H1>군적금 정보를{'\n'}입력하세요</H1>

      <Card tight>
        <RowBetween>
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardTitle, { color: c.tx }]}>장병내일준비적금</Text>
            <Text style={[styles.tiny, { color: c.tx3 }]}>가입하면 정부가 돈을 더 얹어줘요</Text>
          </View>
          <ToggleSwitch value={savings.enabled} onChange={(v) => updateSavings({ enabled: v })} />
        </RowBetween>
      </Card>

      {savings.enabled ? (
        <>
          <Label>월 납입액</Label>
          <Field
            label="금액 입력"
            value={formatWon(savings.monthlyDeposit)}
            valueTone="lime"
            numericValue
            focus
            onPress={() => setEdit({ kind: 'deposit' })}
          />

          <RowBetween align="center" style={{ marginTop: 2 }}>
            <Label>은행별 납입</Label>
            <Badge label="추가" tone="gray" />
          </RowBetween>
          <Text style={[styles.tiny, { color: c.tx3, marginTop: -2 }]} onPress={addBank}>
            ＋ 은행 추가하기
          </Text>
          <View style={styles.stack}>
            {savings.banks.map((b) => (
              <Field
                key={b.id}
                label={`🏦 ${b.name}`}
                value={formatWon(b.amount)}
                numericValue
                onPress={() => setEdit({ kind: 'bank', id: b.id })}
              />
            ))}
          </View>

          <Grid2>
            <Card variant="hi" tight>
              <Text style={[styles.statT, { color: c.tx2 }]}>정부가 더해주는 돈</Text>
              <Text style={[styles.big, { color: c.lime }]} onPress={() => setEdit({ kind: 'matching' })}>
                {formatPercent(savings.matchingRate)}
              </Text>
              <Text style={[styles.tiny, { color: c.tx3 }]}>매칭지원금 비율 · 탭하여 수정</Text>
            </Card>
            <Card tight>
              <Text style={[styles.statT, { color: c.tx2 }]}>예상 금리 (연)</Text>
              <Text style={[styles.big, { color: c.tx }]} onPress={() => setEdit({ kind: 'interest' })}>
                {formatPercent(savings.interestRate, 1)}
              </Text>
              <Text style={[styles.tiny, { color: c.tx3 }]}>은행 평균 기준 · 탭하여 수정</Text>
            </Card>
          </Grid2>
        </>
      ) : (
        <Text style={[styles.tiny, { color: c.tx2 }]}>
          적금에 가입하지 않으면 월급만 계산해드려요. 나중에 설정에서 켤 수 있어요.
        </Text>
      )}

      <View style={{ height: 8 }} />
      <AppButton label="완료 · 월급 카운터 시작" icon="trend" onPress={finish} />

      <InputModal
        visible={edit !== null}
        numeric
        title={mp.title}
        initialValue={mp.initialValue}
        unit={mp.unit}
        onClose={() => setEdit(null)}
        onSubmit={submit}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  step: { fontSize: 13, fontWeight: '700', fontFamily: numFontFamily },
  cardTitle: { fontSize: 15, fontWeight: '700' },
  tiny: { fontSize: 12 },
  stack: { gap: 8 },
  statT: { fontSize: 12, fontWeight: '600' },
  big: { fontSize: 22, fontWeight: '700', fontFamily: numFontFamily },
});
