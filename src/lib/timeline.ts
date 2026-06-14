/**
 * 월별 타임라인 생성
 * 입대월 ~ 전역월까지 각 월의 계급/월급/적금/누적 정보를 만든다.
 */
import type { Rank, SavingsConfig, UserServiceInfo } from '../types';
import { getRankAtDate, listPaydays } from './salaryCalculator';

export type MonthStatus = 'past' | 'now' | 'future';

export interface MonthEntry {
  /** 월급일 Date */
  date: Date;
  year: number;
  /** 0-based month */
  monthIndex: number;
  rank: Rank;
  /** 월급액 */
  salary: number;
  /** 적금 납입액 */
  savingsDeposit: number;
  /** 매칭지원금 예상액 */
  matching: number;
  /** 누적 월급 */
  cumulativeSalary: number;
  /** 누적 적금 (원금) */
  cumulativeSavings: number;
  /** 월급 지급일 (일) */
  payDay: number;
  status: MonthStatus;
  /** 이 달에 진급했는지 */
  isPromotion: boolean;
  /** 전역월 여부 */
  isDischargeMonth: boolean;
}

export function buildTimeline(
  service: UserServiceInfo,
  savings: SavingsConfig,
  now: Date = new Date(),
): MonthEntry[] {
  const paydays = listPaydays(service);
  const nowY = now.getFullYear();
  const nowM = now.getMonth();
  const deposit = savings.enabled ? savings.monthlyDeposit : 0;

  let cumulativeSalary = 0;
  let cumulativeSavings = 0;
  let prevRank: Rank | null = null;

  return paydays.map((date, index) => {
    const rank = getRankAtDate(service, date);
    const salary = service.rankSalaryTable[rank];
    cumulativeSalary += salary;
    cumulativeSavings += deposit;

    const y = date.getFullYear();
    const m = date.getMonth();
    let status: MonthStatus;
    if (y < nowY || (y === nowY && m < nowM)) status = 'past';
    else if (y === nowY && m === nowM) status = 'now';
    else status = 'future';

    const entry: MonthEntry = {
      date,
      year: y,
      monthIndex: m,
      rank,
      salary,
      savingsDeposit: deposit,
      matching: deposit * savings.matchingRate,
      cumulativeSalary,
      cumulativeSavings,
      payDay: service.monthlyPayDay,
      status,
      isPromotion: prevRank !== null && rank !== prevRank,
      isDischargeMonth: index === paydays.length - 1,
    };
    prevRank = rank;
    return entry;
  });
}
