/**
 * 금액/숫자 포맷 유틸리티
 * 모든 금액은 한국 원화 기준으로 표시한다.
 */

const intFormatter = new Intl.NumberFormat('en-US');

/** 정수 부분 천단위 콤마 */
export function formatInt(n: number): string {
  return intFormatter.format(Math.floor(n));
}

/** ₩ 1,234,567 형태 (정수) */
export function formatWon(n: number): string {
  return `₩ ${formatInt(n)}`;
}

/**
 * 실시간 카운터용: 정수부와 소수부 분리.
 * decimals 가 0 이면 소수부는 빈 문자열.
 */
export function splitMoney(
  value: number,
  decimals: number,
): { int: string; dec: string } {
  const safe = Number.isFinite(value) ? value : 0;
  const intPart = Math.floor(safe);
  const int = intFormatter.format(intPart);
  if (decimals <= 0) {
    return { int, dec: '' };
  }
  // 부동소수 오차를 피하기 위해 소수부만 따로 처리
  const frac = safe - intPart;
  const decStr = frac.toFixed(decimals).slice(2); // '0.xxxx' -> 'xxxx'
  return { int, dec: `.${decStr}` };
}

/**
 * 큰 금액 축약 표기 (₩ 1.20M / ₩ 7.65M).
 * 백만 단위(M) 기준, 1천만 이상은 그대로 M 표기.
 */
export function formatCompactWon(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) {
    return `₩ ${(n / 1_000_000).toFixed(2)}M`;
  }
  if (abs >= 10_000) {
    return `₩ ${(n / 10_000).toFixed(0)}만`;
  }
  return formatWon(n);
}

/** 만원 단위 표기 (40만) */
export function formatManWon(n: number): string {
  return `${Math.round(n / 10_000).toLocaleString('en-US')}만`;
}

/** 퍼센트 표기 (0~1 -> 'NN%') */
export function formatPercent(ratio: number, digits = 0): string {
  return `${(ratio * 100).toFixed(digits)}%`;
}

/** 소수 둘째자리까지 (초당 증가액 등) */
export function formatRate(n: number, decimals = 4): string {
  return `₩ ${n.toFixed(decimals)}`;
}
