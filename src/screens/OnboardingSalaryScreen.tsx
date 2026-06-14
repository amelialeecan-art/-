/**
 * 03 온보딩 2단계 — 월급 / 계급 설정
 */
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '../components/Screen';
import { ScreenHeader } from '../components/ScreenHeader';
import { ProgressBar } from '../components/ProgressBar';
import { Field } from '../components/Field';
import { Card } from '../components/Card';
import { RankBadge } from '../components/Badge';
import { AppButton } from '../components/AppButton';
import { Grid2 } from '../components/Grid';
import { RowBetween } from '../components/Row';
import { H1, Label } from '../components/SectionTitle';
import { Icon } from '../components/Icon';
import { InputModal } from '../components/InputModal';
import { useApp } from '../state/AppContext';
import { useAppNavigation } from '../navigation/types';
import { RANK_ORDER } from '../types';
import type { Rank } from '../types';
import { formatWon } from '../lib/formatters';
import { numFontFamily } from '../theme/typography';

type EditTarget =
  | { kind: 'payday' }
  | { kind: 'period'; rank: Rank }
  | { kind: 'salary'; rank: Rank }
  | null;

export function OnboardingSalaryScreen() {
  const { state, colors: c, updateService } = useApp();
  const nav = useAppNavigation();
  const { service } = state;
  const [edit, setEdit] = useState<EditTarget>(null);

  const submit = (raw: string) => {
    const n = parseInt(raw.replace(/[^0-9]/g, ''), 10);
    if (Number.isNaN(n) || !edit) return;
    if (edit.kind === 'payday') {
      updateService({ monthlyPayDay: Math.min(28, Math.max(1, n)) });
    } else if (edit.kind === 'period') {
      updateService({ rankPeriods: { ...service.rankPeriods, [edit.rank]: Math.max(0, n) } });
    } else if (edit.kind === 'salary') {
      updateService({ rankSalaryTable: { ...service.rankSalaryTable, [edit.rank]: Math.max(0, n) } });
    }
  };

  const modalProps = () => {
    if (!edit) return { title: '', initialValue: '', unit: '' };
    if (edit.kind === 'payday') return { title: '월급 지급일', initialValue: String(service.monthlyPayDay), unit: '일' };
    if (edit.kind === 'period')
      return { title: `${edit.rank} 복무 기간`, initialValue: String(service.rankPeriods[edit.rank]), unit: '개월' };
    return { title: `${edit.rank} 월급`, initialValue: String(service.rankSalaryTable[edit.rank]), unit: '원' };
  };
  const mp = modalProps();

  return (
    <Screen>
      <ScreenHeader onBack={() => nav.goBack()} right={<Text style={[styles.step, { color: c.tx2 }]}>2 / 3</Text>} />
      <ProgressBar value={0.66} slim />
      <H1>월급 기준을{'\n'}확인하세요</H1>

      <Field
        label="월급 지급일"
        value={`매월 ${service.monthlyPayDay}일`}
        valueTone="lime"
        onPress={() => setEdit({ kind: 'payday' })}
      />

      <Label>계급별 기간</Label>
      <Grid2>
        {RANK_ORDER.map((rank) => (
          <Card key={rank} tight onPress={() => setEdit({ kind: 'period', rank })}>
            <RowBetween>
              <RankBadge rank={rank} />
              <Text style={[styles.num, { color: c.tx }]}>{service.rankPeriods[rank]}개월</Text>
            </RowBetween>
          </Card>
        ))}
      </Grid2>

      <Label>계급별 월급</Label>
      <View style={styles.stack}>
        {RANK_ORDER.map((rank) => (
          <Field
            key={rank}
            label={rank}
            value={formatWon(service.rankSalaryTable[rank])}
            numericValue
            onPress={() => setEdit({ kind: 'salary', rank })}
          />
        ))}
      </View>

      <View style={[styles.info, { backgroundColor: c.inset }]}>
        <Icon name="settings" size={16} color={c.tx3} />
        <Text style={[styles.infoText, { color: c.tx2 }]}>
          기본값이에요. 나중에 설정에서 언제든 바꿀 수 있어요.
        </Text>
      </View>

      <AppButton label="다음" onPress={() => nav.navigate('OnboardingSavings')} />

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
  num: { fontSize: 15, fontWeight: '700', fontFamily: numFontFamily },
  stack: { gap: 8 },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 14,
  },
  infoText: { fontSize: 13, flex: 1 },
});
