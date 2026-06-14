/**
 * 13 알림 화면
 * 상단: 알림 종류 on/off 설정 (로컬 알림 구조)
 * 하단: 실제 데이터로 생성한 예정 알림 목록
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '../components/Screen';
import { ScreenHeader } from '../components/ScreenHeader';
import { Card } from '../components/Card';
import { ToggleSwitch } from '../components/ToggleSwitch';
import { Divider, SectionTitle } from '../components/SectionTitle';
import { RowBetween } from '../components/Row';
import { Icon, IconName } from '../components/Icon';
import { useApp } from '../state/AppContext';
import { useNow } from '../hooks/useNow';
import { useAppNavigation } from '../navigation/types';
import {
  computeLiveSalary,
  getNextPromotion,
  getRankAtDate,
} from '../lib/salaryCalculator';
import { dDay, formatDot, parseISODate } from '../lib/dateUtils';
import { formatWon } from '../lib/formatters';
import type { NotificationSettings } from '../types';

interface NotiItem {
  icon: IconName;
  tone: string;
  title: string;
  desc: string;
  when: string;
}

export function NotificationsScreen() {
  const { state, colors: c, updateNotifications } = useApp();
  const nav = useAppNavigation();
  const now = useNow(60000);
  const { service, savings, notifications } = state;

  const live = computeLiveSalary(service, now);
  const promo = getNextPromotion(service, now);
  const discharge = parseISODate(service.dischargeDate);
  const nextPay = live.period.end;
  const nextPayRank = getRankAtDate(service, nextPay);
  const nextPaySalary = service.rankSalaryTable[nextPayRank];

  const items: NotiItem[] = [];
  if (notifications.payday) {
    items.push({
      icon: 'won',
      tone: c.lime,
      title: '다가오는 월급날 💰',
      desc: `${nextPayRank} 월급 ${formatWon(nextPaySalary)}이 입금될 예정이에요.`,
      when: `${formatDot(nextPay)} · D-${dDay(nextPay, now)}`,
    });
  }
  if (notifications.savings && savings.enabled) {
    items.push({
      icon: 'check',
      tone: c.up,
      title: '군적금 납입 예정 ✅',
      desc: `이번 달 ${formatWon(savings.monthlyDeposit)} 납입 예정. 매칭지원금이 차곡차곡 쌓여요.`,
      when: `${formatDot(nextPay)}`,
    });
  }
  if (notifications.promotion && promo.date && promo.nextRank) {
    items.push({
      icon: 'medal',
      tone: c.gold,
      title: `${promo.nextRank} 진급 예정 🎖️`,
      desc: `진급하면 월급이 ${formatWon(service.rankSalaryTable[promo.nextRank])}으로 올라요.`,
      when: `${formatDot(promo.date)} · D-${promo.daysLeft}`,
    });
  }
  if (notifications.discharge) {
    items.push({
      icon: 'flag',
      tone: c.danger,
      title: `전역 D-${Math.max(0, dDay(discharge, now))} 🚩`,
      desc: '전역까지 얼마 남지 않았어요. 전역 예상 자산을 확인해보세요.',
      when: `${formatDot(discharge)}`,
    });
  }

  const toggleKeys: { key: keyof NotificationSettings; label: string }[] = [
    { key: 'payday', label: '월급날 알림' },
    { key: 'savings', label: '적금 납입 알림' },
    { key: 'promotion', label: '진급 예정 알림' },
    { key: 'discharge', label: '전역 D-day 알림' },
  ];

  return (
    <Screen>
      <ScreenHeader title="알림" backLabel="홈" onBack={() => nav.goBack()} />

      <SectionTitle>알림 설정</SectionTitle>
      <Card tight>
        {toggleKeys.map((t, i) => (
          <React.Fragment key={t.key}>
            {i > 0 ? <Divider /> : null}
            <RowBetween>
              <Text style={[styles.k, { color: c.tx }]}>{t.label}</Text>
              <ToggleSwitch
                value={notifications[t.key]}
                onChange={(v) => updateNotifications({ [t.key]: v })}
              />
            </RowBetween>
          </React.Fragment>
        ))}
      </Card>
      <Text style={[styles.note, { color: c.tx3 }]}>
        실제 푸시 알림은 추후 업데이트로 제공돼요. 지금은 예정된 알림을 미리 보여드려요.
      </Text>

      <SectionTitle>예정된 알림</SectionTitle>
      <View style={styles.list}>
        {items.map((it, i) => (
          <Card key={i} tight>
            <View style={styles.notiRow}>
              <View style={[styles.nic, { backgroundColor: `${it.tone}22` }]}>
                <Icon name={it.icon} size={20} color={it.tone} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.nt, { color: c.tx }]}>{it.title}</Text>
                <Text style={[styles.nd, { color: c.tx2 }]}>{it.desc}</Text>
                <Text style={[styles.ntime, { color: c.tx3 }]}>{it.when}</Text>
              </View>
            </View>
          </Card>
        ))}
        {items.length === 0 ? (
          <Text style={[styles.note, { color: c.tx2 }]}>켜진 알림이 없어요. 위에서 알림을 켜보세요.</Text>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  k: { fontSize: 14, fontWeight: '500' },
  note: { fontSize: 12, lineHeight: 17 },
  list: { gap: 8 },
  notiRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  nic: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nt: { fontSize: 15, fontWeight: '700' },
  nd: { fontSize: 13, lineHeight: 19, marginTop: 3 },
  ntime: { fontSize: 11, marginTop: 5 },
});
