/**
 * 섹션 제목 (라벨 / 헤더 / 디바이더)
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useColors } from '../state/AppContext';

export function SectionTitle({ children }: { children: string }) {
  const c = useColors();
  return <Text style={[styles.sec, { color: c.tx3 }]}>{children}</Text>;
}

export function Label({ children }: { children: string }) {
  const c = useColors();
  return <Text style={[styles.label, { color: c.tx2 }]}>{children}</Text>;
}

export function H1({ children }: { children: React.ReactNode }) {
  const c = useColors();
  return <Text style={[styles.h1, { color: c.tx }]}>{children}</Text>;
}

export function H2({ children }: { children: React.ReactNode }) {
  const c = useColors();
  return <Text style={[styles.h2, { color: c.tx }]}>{children}</Text>;
}

export function Lead({ children }: { children: React.ReactNode }) {
  const c = useColors();
  return <Text style={[styles.lead, { color: c.tx2 }]}>{children}</Text>;
}

export function Divider() {
  const c = useColors();
  return <View style={[styles.divider, { backgroundColor: c.line }]} />;
}

const styles = StyleSheet.create({
  sec: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
    marginTop: 8,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 6,
    marginBottom: 2,
  },
  h1: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  h2: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  lead: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 4,
  },
});
