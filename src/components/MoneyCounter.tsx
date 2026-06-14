/**
 * 실시간 월급 카운터
 * requestAnimationFrame 루프로 실제 시각 기준 금액을 부드럽게 갱신한다.
 * 정수부는 크게, 소수부는 작게 표시. (프로토타입 .counter 재현)
 *
 * 성능: 자체 state 만 갱신하므로 부모 트리는 리렌더되지 않는다.
 * 약 30fps 로 throttle 하여 과도한 렌더를 방지한다.
 */
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useColors } from '../state/AppContext';
import { numFontFamily } from '../theme/typography';
import { splitMoney } from '../lib/formatters';

interface MoneyCounterProps {
  /** 현재 값을 반환하는 함수 (실제 시각 기준 계산) */
  getValue: () => number;
  decimals: number;
  /** 정수부 글자 크기 */
  intSize?: number;
  color?: string;
  won?: boolean;
  align?: 'flex-start' | 'center';
}

const FRAME_INTERVAL = 1000 / 30; // ~30fps

export function MoneyCounter({
  getValue,
  decimals,
  intSize = 44,
  color,
  won = true,
  align = 'flex-start',
}: MoneyCounterProps) {
  const c = useColors();
  const intColor = color ?? c.tx;
  const [display, setDisplay] = useState(() => splitMoney(getValue(), decimals));

  // 최신 getValue / decimals 를 ref 로 유지해 루프 재시작 방지
  const getValueRef = useRef(getValue);
  const decimalsRef = useRef(decimals);
  getValueRef.current = getValue;
  decimalsRef.current = decimals;

  useEffect(() => {
    let raf = 0;
    let last = 0;
    let prevInt = '';
    let prevDec = '';
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last < FRAME_INTERVAL) return;
      last = t;
      const next = splitMoney(getValueRef.current(), decimalsRef.current);
      if (next.int !== prevInt || next.dec !== prevDec) {
        prevInt = next.int;
        prevDec = next.dec;
        setDisplay(next);
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const decSize = Math.round(intSize * 0.42);
  const wonSize = Math.round(intSize * 0.5);

  return (
    <View style={[styles.row, { justifyContent: align }]}>
      {won ? (
        <Text style={[styles.won, { color: c.lime, fontSize: wonSize }]}>₩</Text>
      ) : null}
      <Text
        style={[styles.int, { color: intColor, fontSize: intSize }]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {display.int}
      </Text>
      {decimals > 0 ? (
        <Text style={[styles.dec, { color: c.tx2, fontSize: decSize }]}>{display.dec}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
    flexWrap: 'nowrap',
  },
  won: {
    fontWeight: '700',
    fontFamily: numFontFamily,
  },
  int: {
    fontWeight: '700',
    fontFamily: numFontFamily,
    letterSpacing: -1,
  },
  dec: {
    fontWeight: '600',
    fontFamily: numFontFamily,
  },
});
