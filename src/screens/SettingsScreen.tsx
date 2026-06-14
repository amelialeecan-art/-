/**
 * 12 설정 화면 (탭)
 */
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { AppButton } from '../components/AppButton';
import { DateField } from '../components/DateField';
import { Segmented } from '../components/Segmented';
import { ToggleSwitch } from '../components/ToggleSwitch';
import { ListRow } from '../components/ListRow';
import { Divider, H2, Label, SectionTitle } from '../components/SectionTitle';
import { RowBetween } from '../components/Row';
import { InputModal } from '../components/InputModal';
import { useApp } from '../state/AppContext';
import { useAppNavigation } from '../navigation/types';
import { SERVICE_TYPES } from '../constants/defaultConfig';
import { addMonths, parseISODate, toISODate } from '../lib/dateUtils';
import { formatPercent, formatWon } from '../lib/formatters';
import { RANK_ORDER } from '../types';
import type { DecimalPlaces, Rank } from '../types';

type EditTarget =
  | { kind: 'payday' }
  | { kind: 'period'; rank: Rank }
  | { kind: 'salary'; rank: Rank }
  | { kind: 'deposit' }
  | { kind: 'matching' }
  | { kind: 'interest' }
  | null;

export function SettingsScreen() {
  const {
    state,
    colors: c,
    updateService,
    updateSavings,
    updateSettings,
    toggleTheme,
    resetAll,
  } = useApp();
  const nav = useAppNavigation();
  const { service, savings, settings } = state;
  const [edit, setEdit] = useState<EditTarget>(null);

  const onEnlistChange = (iso: string) => {
    const st = SERVICE_TYPES.find((s) => s.key === service.serviceType);
    if (st && st.key !== 'custom') {
      updateService({ enlistmentDate: iso, dischargeDate: toISODate(addMonths(parseISODate(iso), st.months)) });
    } else {
      updateService({ enlistmentDate: iso });
    }
  };
  const onDischargeChange = (iso: string) => {
    updateService({ dischargeDate: iso, serviceType: 'custom' });
  };

  const submit = (raw: string) => {
    if (!edit) return;
    const n = parseFloat(raw.replace(/[^0-9.]/g, ''));
    if (Number.isNaN(n)) return;
    switch (edit.kind) {
      case 'payday':
        updateService({ monthlyPayDay: Math.min(28, Math.max(1, Math.round(n))) });
        break;
      case 'period':
        updateService({ rankPeriods: { ...service.rankPeriods, [edit.rank]: Math.max(0, Math.round(n)) } });
        break;
      case 'salary':
        updateService({ rankSalaryTable: { ...service.rankSalaryTable, [edit.rank]: Math.max(0, Math.round(n)) } });
        break;
      case 'deposit':
        updateSavings({ monthlyDeposit: Math.max(0, Math.round(n)) });
        break;
      case 'matching':
        updateSavings({ matchingRate: Math.max(0, n) / 100 });
        break;
      case 'interest':
        updateSavings({ interestRate: Math.max(0, n) / 100 });
        break;
    }
  };

  const mp = (() => {
    if (!edit) return { title: '', initialValue: '', unit: '' };
    switch (edit.kind) {
      case 'payday':
        return { title: '월급 지급일', initialValue: String(service.monthlyPayDay), unit: '일' };
      case 'period':
        return { title: `${edit.rank} 복무 기간`, initialValue: String(service.rankPeriods[edit.rank]), unit: '개월' };
      case 'salary':
        return { title: `${edit.rank} 월급`, initialValue: String(service.rankSalaryTable[edit.rank]), unit: '원' };
      case 'deposit':
        return { title: '군적금 납입액', initialValue: String(savings.monthlyDeposit), unit: '원' };
      case 'matching':
        return { title: '매칭지원금 비율', initialValue: String(Math.round(savings.matchingRate * 100)), unit: '%' };
      case 'interest':
        return { title: '예상 금리 (연)', initialValue: String(savings.interestRate * 100), unit: '%' };
    }
  })();

  const confirmReset = () => {
    Alert.alert('데이터 초기화', '모든 설정과 목표가 삭제되고 처음 상태로 돌아갑니다. 계속할까요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '초기화',
        style: 'destructive',
        onPress: () => {
          resetAll();
          nav.reset({ index: 0, routes: [{ name: 'Splash' }] });
        },
      },
    ]);
  };

  return (
    <Screen hasTab>
      <H2>설정</H2>

      <SectionTitle>계산 기준</SectionTitle>
      <View style={styles.stack}>
        <DateField label="입대일" value={service.enlistmentDate} onChange={onEnlistChange} />
        <DateField label="전역일" value={service.dischargeDate} onChange={onDischargeChange} />
      </View>
      <Card tight>
        <ListRow label="월급일" value={`매월 ${service.monthlyPayDay}일`} chevron onPress={() => setEdit({ kind: 'payday' })} />
      </Card>

      <Label>계급별 기간</Label>
      <Card tight>
        {RANK_ORDER.map((rank, i) => (
          <React.Fragment key={rank}>
            {i > 0 ? <Divider /> : null}
            <ListRow
              label={rank}
              value={`${service.rankPeriods[rank]}개월`}
              numericValue
              chevron
              onPress={() => setEdit({ kind: 'period', rank })}
            />
          </React.Fragment>
        ))}
      </Card>

      <Label>계급별 월급</Label>
      <Card tight>
        {RANK_ORDER.map((rank, i) => (
          <React.Fragment key={rank}>
            {i > 0 ? <Divider /> : null}
            <ListRow
              label={rank}
              value={formatWon(service.rankSalaryTable[rank])}
              numericValue
              chevron
              onPress={() => setEdit({ kind: 'salary', rank })}
            />
          </React.Fragment>
        ))}
      </Card>

      <SectionTitle>군적금</SectionTitle>
      <Card tight>
        <RowBetween>
          <Text style={[styles.k, { color: c.tx2 }]}>군적금 가입</Text>
          <ToggleSwitch value={savings.enabled} onChange={(v) => updateSavings({ enabled: v })} />
        </RowBetween>
        <Divider />
        <ListRow label="군적금 납입액" value={formatWon(savings.monthlyDeposit)} numericValue chevron onPress={() => setEdit({ kind: 'deposit' })} />
        <Divider />
        <ListRow label="매칭지원금 비율" value={formatPercent(savings.matchingRate)} numericValue chevron onPress={() => setEdit({ kind: 'matching' })} />
        <Divider />
        <ListRow label="예상 금리" value={formatPercent(savings.interestRate, 1)} numericValue chevron onPress={() => setEdit({ kind: 'interest' })} />
      </Card>

      <SectionTitle>표시</SectionTitle>
      <Card tight>
        <Text style={[styles.k, { color: c.tx2, marginBottom: 8 }]}>소수점 표시 자리수</Text>
        <Segmented<DecimalPlaces>
          value={settings.decimalPlaces}
          onChange={(v) => updateSettings({ decimalPlaces: v })}
          options={[
            { label: '0', value: 0 },
            { label: '2', value: 2 },
            { label: '5', value: 5 },
            { label: '10', value: 10 },
          ]}
        />
        <Divider />
        <RowBetween>
          <Text style={[styles.k, { color: c.tx2 }]}>다크 모드</Text>
          <ToggleSwitch value={settings.theme === 'dark'} onChange={toggleTheme} />
        </RowBetween>
      </Card>

      <SectionTitle>기타</SectionTitle>
      <Card tight>
        <ListRow label="알림 설정" value="" chevron onPress={() => nav.navigate('Notifications')} />
      </Card>

      <View style={styles.buttons}>
        <AppButton label="통계 리포트 보기" variant="secondary" icon="trend" onPress={() => nav.navigate('Stats')} />
        <AppButton label="전역 축하 화면 미리보기" variant="secondary" icon="medal" onPress={() => nav.navigate('Celebration', { preview: true })} />
        <AppButton label="데이터 초기화" variant="danger" icon="refresh" onPress={confirmReset} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 8 },
  k: { fontSize: 14, fontWeight: '500' },
  buttons: { gap: 10, marginTop: 4 },
});
