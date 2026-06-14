/**
 * 날짜 계산 유틸리티
 * 모든 날짜 계산을 안정적으로 처리하기 위한 순수 함수 모음.
 * 내부적으로 로컬 자정 기준 Date 를 사용한다.
 */

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Date -> 'yyyy-mm-dd' */
export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** 'yyyy-mm-dd' -> 로컬 자정 Date */
export function parseISODate(s: string): Date {
  const [y, m, d] = s.split('-').map((v) => parseInt(v, 10));
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1, 0, 0, 0, 0);
}

/** 해당 날짜의 자정(00:00) Date 복제 */
export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** 개월 더하기 (말일 보정 포함) */
export function addMonths(d: Date, months: number): Date {
  const result = new Date(d.getTime());
  const targetMonth = result.getMonth() + months;
  const expectedMonth = ((targetMonth % 12) + 12) % 12;
  result.setMonth(targetMonth);
  // 1/31 + 1개월 같은 오버플로 보정
  if (result.getMonth() !== expectedMonth) {
    result.setDate(0);
  }
  return result;
}

/** 일 더하기 */
export function addDays(d: Date, days: number): Date {
  return new Date(d.getTime() + days * MS_PER_DAY);
}

/** 두 날짜(자정 기준) 사이 일수 차 (b - a) */
export function daysBetween(a: Date, b: Date): number {
  return Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / MS_PER_DAY);
}

/** D-day 숫자 (오늘 기준 target 까지 남은 일수). 음수면 지난 것. */
export function dDay(target: Date, now: Date = new Date()): number {
  return daysBetween(now, target);
}

/** 입대 N일차 (입대일을 1일차로) */
export function serviceDayCount(enlist: Date, now: Date = new Date()): number {
  return daysBetween(enlist, now) + 1;
}

/** 'yyyy.mm.dd' 표기 */
export function formatDot(d: Date): string {
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(
    d.getDate(),
  ).padStart(2, '0')}`;
}

/** 'yyyy · mm · dd' 표기 (프로토타입 스타일) */
export function formatSpaced(d: Date): string {
  return `${d.getFullYear()} · ${String(d.getMonth() + 1).padStart(2, '0')} · ${String(
    d.getDate(),
  ).padStart(2, '0')}`;
}

/** 'mm · dd' 표기 */
export function formatMonthDay(d: Date): string {
  return `${String(d.getMonth() + 1).padStart(2, '0')} · ${String(d.getDate()).padStart(2, '0')}`;
}

/** 'yyyy · mm' 표기 */
export function formatYearMonth(d: Date): string {
  return `${d.getFullYear()} · ${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * 지정 월에서 payDay 일자의 Date 반환.
 * payDay 가 해당 월 말일보다 크면 말일로 보정.
 */
export function payDayOfMonth(year: number, monthIndex: number, payDay: number): Date {
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  return new Date(year, monthIndex, Math.min(payDay, lastDay));
}

/** 남은 시간을 D-n · hh:mm:ss 형태 분해 */
export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function countdownTo(target: Date, now: Date = new Date()): Countdown {
  let diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / MS_PER_DAY);
  diff -= days * MS_PER_DAY;
  const hours = Math.floor(diff / (60 * 60 * 1000));
  diff -= hours * 60 * 60 * 1000;
  const minutes = Math.floor(diff / (60 * 1000));
  diff -= minutes * 60 * 1000;
  const seconds = Math.floor(diff / 1000);
  return { days, hours, minutes, seconds };
}

export { MS_PER_DAY };
