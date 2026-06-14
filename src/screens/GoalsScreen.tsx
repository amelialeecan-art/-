/**
 * 10 목표 화면 (탭)
 */
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { AppButton } from '../components/AppButton';
import { ProgressBar } from '../components/ProgressBar';
import { RowBetween } from '../components/Row';
import { H2 } from '../components/SectionTitle';
import { Icon } from '../components/Icon';
import { useApp } from '../state/AppContext';
import { useNow } from '../hooks/useNow';
import { computeAssets, evaluateGoal } from '../lib/assets';
import { formatWon } from '../lib/formatters';
import { radius, numFontFamily } from '../theme/typography';
import type { Goal } from '../types';

const EMOJIS = ['🎯', '✈️', '💻', '🏠', '🎓', '🚗', '💰', '🎮', '📱', '⌚'];

export function GoalsScreen() {
  const { state, colors: c, addGoal, removeGoal } = useApp();
  const now = useNow(60000);
  const { service, savings, goals } = state;
  const totalAssets = computeAssets(service, savings, now).total;

  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [icon, setIcon] = useState('🎯');

  const submit = () => {
    const amt = parseInt(amount.replace(/[^0-9]/g, ''), 10);
    if (!title.trim() || Number.isNaN(amt) || amt <= 0) {
      Alert.alert('입력 확인', '목표 이름과 금액을 올바르게 입력해주세요.');
      return;
    }
    const goal: Goal = {
      id: `goal-${Date.now()}`,
      title: title.trim(),
      targetAmount: amt,
      icon,
      createdAt: new Date().toISOString(),
    };
    addGoal(goal);
    setTitle('');
    setAmount('');
    setIcon('🎯');
    setAdding(false);
  };

  const confirmRemove = (g: Goal) => {
    Alert.alert('목표 삭제', `'${g.title}' 목표를 삭제할까요?`, [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: () => removeGoal(g.id) },
    ]);
  };

  return (
    <Screen hasTab>
      <RowBetween>
        <H2>전역 후 목표</H2>
        <Pressable
          onPress={() => setAdding(true)}
          style={[styles.addBtn, { backgroundColor: 'rgba(182,255,77,0.13)' }]}
        >
          <Icon name="plus" size={14} color={c.lime} />
          <Text style={[styles.addText, { color: c.lime }]}>추가</Text>
        </Pressable>
      </RowBetween>
      <Text style={[styles.hint, { color: c.tx3 }]}>
        전역 예상 총자산 {formatWon(totalAssets)} 기준으로 달성 가능 여부를 자동 판정해요
      </Text>

      <View style={styles.list}>
        {goals.map((g) => {
          const ev = evaluateGoal(g, totalAssets);
          const pct = Math.min(100, Math.round(ev.progress * 100));
          return (
            <Card key={g.id} tight onPress={() => confirmRemove(g)}>
              <RowBetween>
                <Text style={[styles.goalTitle, { color: c.tx }]}>
                  {g.icon} {g.title}
                </Text>
                {ev.achievableAtDischarge ? (
                  <Badge label="달성 가능" tone="up" />
                ) : (
                  <Badge label="더 필요해요" tone="gold" />
                )}
              </RowBetween>
              <RowBetween>
                <Text style={[styles.goalNum, { color: c.tx2 }]}>목표 {formatWon(g.targetAmount)}</Text>
                <Text style={[styles.goalPct, { color: ev.achievableAtDischarge ? c.lime : c.tx }]}>
                  {ev.progress >= 1 ? '100%+' : `${pct}%`}
                </Text>
              </RowBetween>
              <ProgressBar value={ev.progress} slim tone={ev.achievableAtDischarge ? 'lime' : 'gold'} />
            </Card>
          );
        })}
      </View>
      <Text style={[styles.hint, { color: c.tx3 }]}>카드를 길게 누르면 삭제할 수 있어요.</Text>

      {/* 목표 추가 모달 */}
      <Modal visible={adding} transparent animationType="fade" onRequestClose={() => setAdding(false)}>
        <Pressable style={styles.backdrop} onPress={() => setAdding(false)}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.center}
          >
            <Pressable style={[styles.sheet, { backgroundColor: c.card, borderColor: c.line }]} onPress={() => {}}>
              <Text style={[styles.sheetTitle, { color: c.tx }]}>새 목표 추가</Text>

              <View style={styles.emojiRow}>
                {EMOJIS.map((e) => (
                  <Pressable
                    key={e}
                    onPress={() => setIcon(e)}
                    style={[
                      styles.emoji,
                      { backgroundColor: icon === e ? 'rgba(182,255,77,0.18)' : c.inset },
                    ]}
                  >
                    <Text style={{ fontSize: 18 }}>{e}</Text>
                  </Pressable>
                ))}
              </View>

              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="목표 이름 (예: 전역 후 여행비)"
                placeholderTextColor={c.tx3}
                style={[styles.input, { backgroundColor: c.inset, color: c.tx, borderColor: c.line }]}
                selectionColor={c.lime}
              />
              <TextInput
                value={amount}
                onChangeText={setAmount}
                keyboardType="number-pad"
                placeholder="목표 금액 (원)"
                placeholderTextColor={c.tx3}
                style={[styles.input, { backgroundColor: c.inset, color: c.tx, borderColor: c.line }]}
                selectionColor={c.lime}
              />

              <View style={styles.actions}>
                <View style={{ flex: 1 }}>
                  <AppButton label="취소" variant="secondary" onPress={() => setAdding(false)} />
                </View>
                <View style={{ flex: 1 }}>
                  <AppButton label="추가" onPress={submit} />
                </View>
              </View>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 999,
  },
  addText: { fontSize: 13, fontWeight: '700' },
  hint: { fontSize: 12, lineHeight: 17 },
  list: { gap: 8, marginTop: 4 },
  goalTitle: { fontSize: 15, fontWeight: '700' },
  goalNum: { fontSize: 12, fontFamily: numFontFamily },
  goalPct: { fontSize: 13, fontWeight: '700', fontFamily: numFontFamily },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  center: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  sheet: { borderRadius: radius.lg, borderWidth: 1, padding: 20, gap: 14 },
  sheetTitle: { fontSize: 17, fontWeight: '700' },
  emojiRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  emoji: {
    width: 40,
    height: 40,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  actions: { flexDirection: 'row', gap: 10 },
});
