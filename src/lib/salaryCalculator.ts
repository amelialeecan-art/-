/**
 * 월급 / 계급 / 실시간 적립 계산 로직
 * UI 와 완전히 분리된 순수 함수. 모든 계산의 단일 출처.
 */
import type { Rank, RankPeriods, UserServiceInfo } from '../types';
import { RANK_ORDER } from '../types';
import {
  addMonths,
  daysBetween,
  parseISODate,
  payDayOfMonth,
} from './dateUtils';

const MS_PER_SEC = 1000;

/** 계급 구간 (입대일 기준 누적) */
export interface RankBoundary {
  rank: Rank;
  start: Date;
  end: Date;
}

/** 계급별 구간 경계 계산 */
export function getRankBoundaries(service: UserServiceInfo): RankBoundary[] {
  const enlist = parseISODate(service.enlistmentDate);
  const boundaries: RankBoundary[] = [];
  let cursor = enlist;
  for (const rank of RANK_ORDER) {
    const months = service.rankPeriods[rank];
    const start = cursor;
    const end = addMonths(cursor, months);
    boundaries.push({ rank, start, end });
    cursor = end;
  }
  return boundaries;
}

/** 특정 날짜의 계급 */
export function getRankAtDate(service: UserServiceInfo, date: Date): Rank {
  const boundaries = getRankBoundaries(service);
  for (const b of boundaries) {
    if (date < b.end) return b.rank;
  }
  // 마지막 계급 이후로는 병장 유지
  return boundaries[boundaries.length - 1]!.rank;
}

/** 현재 계급 */
export function getCurrentRank(service: UserServiceInfo, now: Date = new Date()): Rank {
  return getRankAtDate(service, now);
}

/** 다음 진급 정보 */
export interface NextPromotion {
  /** 다음 계급 (없으면 null = 이미 병장) */
  nextRank: Rank | null;
  /** 진급일 */
  date: Date | null;
  /** 남은 일수 */
  daysLeft: number | null;
}

export function getNextPromotion(
  service: UserServiceInfo,
  now: Date = new Date(),
): NextPromotion {
  const boundaries = getRankBoundaries(service);
  for (let i = 0; i < boundaries.length; i += 1) {
    const b = boundaries[i]!;
    if (now < b.end && i < boundaries.length - 1) {
      const next = boundaries[i + 1]!;
      return {
        nextRank: next.rank,
        date: next.start,
        daysLeft: daysBetween(now, next.start),
      };
    }
  }
  return { nextRank: null, date: null, daysLeft: null };
}

/** 월급 지급 구간 */
export interface PayPeriod {
  start: Date;
  end: Date;
}

/**
 * 현재 월급 구간 [직전 월급일, 다음 월급일].
 * 표준 월별 지급 사이클 기준.
 */
export function getCurrentPayPeriod(
  service: UserServiceInfo,
  now: Date = new Date(),
): PayPeriod {
  const payDay = service.monthlyPayDay;
  // 이번 달 월급일
  let start = payDayOfMonth(now.getFullYear(), now.getMonth(), payDay);
  if (start.getTime() > now.getTime()) {
    // 아직 이번 달 월급일 전 → 직전 달 월급일이 구간 시작
    const prev = addMonths(start, -1);
    start = payDayOfMonth(prev.getFullYear(), prev.getMonth(), payDay);
  }
  const nextMonth = addMonths(start, 1);
  const end = payDayOfMonth(nextMonth.getFullYear(), nextMonth.getMonth(), payDay);
  return { start, end };
}

/** 다음 월급일 */
export function getNextPayDay(service: UserServiceInfo, now: Date = new Date()): Date {
  return getCurrentPayPeriod(service, now).end;
}

/** 실시간 월급 계산 결과 */
export interface LiveSalary {
  rank: Rank;
  /** 현재 계급 월급 (원/월) */
  salary: number;
  period: PayPeriod;
  /** 구간 총 초 */
  totalSeconds: number;
  /** 경과 초 */
  elapsedSeconds: number;
  /** 현재까지 적립된 금액 (원) */
  accrued: number;
  /** 아직 남은 금액 */
  remaining: number;
  /** 구간 진행률 0~1 */
  progress: number;
  perSecond: number;
  perMinute: number;
  perHour: number;
  perDay: number;
}

/**
 * 실시간 적립 월급 계산.
 * accrued = salary × 경과초 / 구간총초
 */
export function computeLiveSalary(
  service: UserServiceInfo,
  now: Date = new Date(),
): LiveSalary {
  const rank = getCurrentRank(service, now);
  const salary = service.rankSalaryTable[rank];
  const period = getCurrentPayPeriod(service, now);
  const totalSeconds = (period.end.getTime() - period.start.getTime()) / MS_PER_SEC;
  const elapsedSeconds = Math.max(
    0,
    Math.min(totalSeconds, (now.getTime() - period.start.getTime()) / MS_PER_SEC),
  );
  const perSecond = totalSeconds > 0 ? salary / totalSeconds : 0;
  const accrued = perSecond * elapsedSeconds;
  const progress = totalSeconds > 0 ? elapsedSeconds / totalSeconds : 0;
  return {
    rank,
    salary,
    period,
    totalSeconds,
    elapsedSeconds,
    accrued,
    remaining: Math.max(0, salary - accrued),
    progress,
    perSecond,
    perMinute: perSecond * 60,
    perHour: perSecond * 3600,
    perDay: perSecond * 86400,
  };
}

/**
 * 복무 기간 내 모든 월급일 목록.
 * 입대일 이후 첫 월급일부터 전역일 이전 마지막 월급일까지.
 */
export function listPaydays(service: UserServiceInfo): Date[] {
  const enlist = parseISODate(service.enlistmentDate);
  const discharge = parseISODate(service.dischargeDate);
  const payDay = service.monthlyPayDay;
  const paydays: Date[] = [];
  let y = enlist.getFullYear();
  let m = enlist.getMonth();
  // 안전 가드 (최대 600개월)
  for (let guard = 0; guard < 600; guard += 1) {
    const pd = payDayOfMonth(y, m, payDay);
    if (pd.getTime() >= enlist.getTime() && pd.getTime() <= discharge.getTime()) {
      paydays.push(pd);
    }
    if (pd.getTime() > discharge.getTime()) break;
    m += 1;
    if (m > 11) {
      m = 0;
      y += 1;
    }
  }
  return paydays;
}

/** 지금까지 받은 총 월급 (지난 월급일 누적) */
export function getTotalReceived(service: UserServiceInfo, now: Date = new Date()): number {
  return listPaydays(service)
    .filter((pd) => pd.getTime() <= now.getTime())
    .reduce((sum, pd) => sum + service.rankSalaryTable[getRankAtDate(service, pd)], 0);
}

/** 전역까지 앞으로 받을 월급 (미래 월급일 누적) */
export function getFutureSalary(service: UserServiceInfo, now: Date = new Date()): number {
  return listPaydays(service)
    .filter((pd) => pd.getTime() > now.getTime())
    .reduce((sum, pd) => sum + service.rankSalaryTable[getRankAtDate(service, pd)], 0);
}

/** 복무 전체 예상 월급 (모든 월급일 합) */
export function getTotalServiceSalary(service: UserServiceInfo): number {
  return listPaydays(service).reduce(
    (sum, pd) => sum + service.rankSalaryTable[getRankAtDate(service, pd)],
    0,
  );
}

/** 계급별 월급 합계 (통계용) */
export function getSalaryByRank(service: UserServiceInfo): Record<Rank, number> {
  const result: Record<Rank, number> = { 이병: 0, 일병: 0, 상병: 0, 병장: 0 };
  for (const pd of listPaydays(service)) {
    const rank = getRankAtDate(service, pd);
    result[rank] += service.rankSalaryTable[rank];
  }
  return result;
}

/** 복무 전체 기준 하루 평균 월급 가치 */
export function getDailyAverage(service: UserServiceInfo): number {
  const enlist = parseISODate(service.enlistmentDate);
  const discharge = parseISODate(service.dischargeDate);
  const totalDays = Math.max(1, daysBetween(enlist, discharge));
  return getTotalServiceSalary(service) / totalDays;
}

/** 계급 단계 인덱스 (점 개수 표시용, 1~4) */
export function rankLevel(rank: Rank): number {
  return RANK_ORDER.indexOf(rank) + 1;
}

/** 계급별 기간 합계가 전역까지 채워지는지 점검 */
export function rankPeriodsTotalMonths(periods: RankPeriods): number {
  return RANK_ORDER.reduce((sum, r) => sum + periods[r], 0);
}
