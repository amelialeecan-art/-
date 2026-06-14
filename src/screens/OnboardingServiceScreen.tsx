/**
 * 02 온보딩 1단계 — 입대 정보
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '../components/Screen';
import { ScreenHeader } from '../components/ScreenHeader';
import { ProgressBar } from '../components/ProgressBar';
import { DateField } from '../components/DateField';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { AppButton } from '../components/AppButton';
import { RowBetween } from '../components/Row';
import { H1, Label, Lead } from '../components/SectionTitle';
import { useApp } from '../state/AppContext';
import { useAppNavigation } from '../navigation/types';
import { SERVICE_TYPES } from '../constants/defaultConfig';
import { addMonths, dDay, formatSpaced, parseISODate, toISODate } from '../lib/dateUtils';
import { numFontFamily } from '../theme/typography';

export function OnboardingServiceScreen() {
  const { state, colors: c, updateService } = useApp();
  const nav = useAppNavigation();
  const { service } = state;

  const dischargeDate = parseISODate(service.dischargeDate);
  const isCustom = service.serviceType === 'custom';

  const selectType = (key: string, months: number) => {
    if (key === 'custom') {
      updateService({ serviceType: key });
      return;
    }
    const enlist = parseISODate(service.enlistmentDate);
    updateService({
      serviceType: key,
      dischargeDate: toISODate(addMonths(enlist, months)),
    });
  };

  const onEnlistChange = (iso: string) => {
    const st = SERVICE_TYPES.find((s) => s.key === service.serviceType);
    if (st && st.key !== 'custom') {
      updateService({
        enlistmentDate: iso,
        dischargeDate: toISODate(addMonths(parseISODate(iso), st.months)),
      });
    } else {
      updateService({ enlistmentDate: iso });
    }
  };

  const dleft = dDay(dischargeDate);
  const currentType = SERVICE_TYPES.find((s) => s.key === service.serviceType);

  return (
    <Screen>
      <ScreenHeader onBack={() => nav.goBack()} right={<Text style={[styles.step, { color: c.tx2 }]}>1 / 3</Text>} />
      <ProgressBar value={0.33} slim />
      <H1>입대 정보를{'\n'}입력하세요</H1>
      <Lead>날짜만 넣으면 전역일까지 자동으로 계산해드려요.</Lead>

      <Label>입대일</Label>
      <DateField label="📅 입대 날짜" value={service.enlistmentDate} onChange={onEnlistChange} focus />

      <Label>군 복무 유형</Label>
      <View style={styles.chips}>
        {SERVICE_TYPES.map((t) => {
          const on = t.key === service.serviceType;
          return (
            <Pressable
              key={t.key}
              onPress={() => selectType(t.key, t.months)}
              style={[
                styles.chip,
                { backgroundColor: on ? c.lime : c.inset, borderColor: on ? c.lime : c.line },
              ]}
            >
              <Text style={[styles.chipText, { color: on ? c.onLime : c.tx2 }]}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {isCustom ? (
        <>
          <Label>전역 예정일 (직접 수정)</Label>
          <DateField
            label="📅 전역 날짜"
            value={service.dischargeDate}
            onChange={(iso) => updateService({ dischargeDate: iso })}
          />
        </>
      ) : (
        <Card variant="hi">
          <RowBetween>
            <Text style={[styles.statT, { color: c.tx2 }]}>전역 예정일 · 자동 계산</Text>
            <Badge label="확정" tone="lime" />
          </RowBetween>
          <Text style={[styles.bigDate, { color: c.tx }]}>{formatSpaced(dischargeDate)}</Text>
          <Text style={[styles.tiny, { color: c.tx3 }]}>
            {currentType?.label ?? '복무'} 기준 자동 산출 · D-{Math.max(0, dleft)}
          </Text>
        </Card>
      )}

      <View style={{ height: 8 }} />
      <AppButton label="다음" onPress={() => nav.navigate('OnboardingSalary')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  step: { fontSize: 13, fontWeight: '700', fontFamily: numFontFamily },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipText: { fontSize: 13, fontWeight: '700' },
  statT: { fontSize: 13, fontWeight: '600' },
  bigDate: { fontSize: 32, fontWeight: '700', fontFamily: numFontFamily, letterSpacing: -0.5 },
  tiny: { fontSize: 12 },
});
