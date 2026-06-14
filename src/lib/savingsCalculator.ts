/**
 * 군적금(장병내일준비적금) 계산 로직
 * 원금 + 정부 매칭지원금 + 예상 이자 = 전역 시 예상 수령액
 */
import type { SavingsConfig, UserServiceInfo } from '../types';
import { listPaydays } from './salaryCalculator';

export interface SavingsResult {
  enabled: boolean;
  /** 월 납입액 */
  monthlyDeposit: number;
  /** 총 납입 개월 수 (복무 기간 기준) */
  totalMonths: number;
  /** 현재까지 납입 완료 개월 수 */
  monthsPaid: number;
  /** 남은 납입 개월 수 */
  monthsRemaining: number;
  /** 현재까지 납입 원금 */
  principalSoFar: number;
  /** 전역 시 총 납입 원금 */
  principalTotal: number;
  /** 현재까지 매칭지원금 */
  matchingSoFar: number;
  /** 전역 시 총 매칭지원금 */
  matchingTotal: number;
  /** 전역 시 예상 이자 (단순 적금 이자 추정) */
  interestTotal: number;
  /** 전역 시 예상 총 수령액 */
  totalExpected: number;
  /** 납입 진행률 0~1 */
  progress: number;
  /** 이번 달 납입 예정액 */
  thisMonthDeposit: number;
}

/**
 * 적금 단순 이자 추정.
 * 매월 같은 금액을 납입하는 적금은 각 회차가 남은 개월만큼 이자를 받는다.
 * interest ≈ deposit × (rate/12) × n(n+1)/2
 */
function estimateInstallmentInterest(
  monthlyDeposit: number,
  months: number,
  annualRate: number,
): number {
  if (months <= 0) return 0;
  const monthlyRate = annualRate / 12;
  return monthlyDeposit * monthlyRate * ((months * (months + 1)) / 2);
}

export function computeSavings(
  service: UserServiceInfo,
  savings: SavingsConfig,
  now: Date = new Date(),
): SavingsResult {
  const paydays = listPaydays(service);
  const totalMonths = paydays.length;
  const monthsPaid = savings.enabled
    ? paydays.filter((pd) => pd.getTime() <= now.getTime()).length
    : 0;
  const monthsRemaining = Math.max(0, totalMonths - monthsPaid);

  const deposit = savings.enabled ? savings.monthlyDeposit : 0;
  const principalSoFar = deposit * monthsPaid;
  const principalTotal = deposit * totalMonths;
  const matchingSoFar = principalSoFar * savings.matchingRate;
  const matchingTotal = principalTotal * savings.matchingRate;
  const interestTotal = estimateInstallmentInterest(
    deposit,
    totalMonths,
    savings.interestRate,
  );
  const totalExpected = principalTotal + matchingTotal + interestTotal;
  const progress = totalMonths > 0 ? monthsPaid / totalMonths : 0;

  return {
    enabled: savings.enabled,
    monthlyDeposit: deposit,
    totalMonths,
    monthsPaid,
    monthsRemaining,
    principalSoFar,
    principalTotal,
    matchingSoFar,
    matchingTotal,
    interestTotal,
    totalExpected,
    progress,
    thisMonthDeposit: deposit,
  };
}
