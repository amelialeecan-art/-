/**
 * 전역 예상 자산 종합 계산
 * 복무 전체 월급 + 군적금 원금 + 매칭지원금 + 예상 이자
 * (프로토타입 모델: 각 항목을 합산하여 전역 시 총자산을 산출)
 */
import type { Goal, SavingsConfig, UserServiceInfo } from '../types';
import { dDay, parseISODate } from './dateUtils';
import { getTotalServiceSalary } from './salaryCalculator';
import { computeSavings } from './savingsCalculator';

export interface AssetSummary {
  /** 복무 전체 예상 월급 */
  serviceSalary: number;
  /** 군적금 원금 */
  principal: number;
  /** 정부 매칭지원금 */
  matching: number;
  /** 예상 이자 */
  interest: number;
  /** 전역 시 예상 총자산 */
  total: number;
  dischargeDate: Date;
  dDay: number;
}

export function computeAssets(
  service: UserServiceInfo,
  savings: SavingsConfig,
  now: Date = new Date(),
): AssetSummary {
  const serviceSalary = getTotalServiceSalary(service);
  const s = computeSavings(service, savings, now);
  const dischargeDate = parseISODate(service.dischargeDate);
  const total = serviceSalary + s.principalTotal + s.matchingTotal + s.interestTotal;
  return {
    serviceSalary,
    principal: s.principalTotal,
    matching: s.matchingTotal,
    interest: s.interestTotal,
    total,
    dischargeDate,
    dDay: dDay(dischargeDate, now),
  };
}

/** 목표 달성 판정 결과 */
export interface GoalProgress {
  goal: Goal;
  /** 달성률 0~1 (현재 누적 자산 대비) */
  progress: number;
  /** 전역 시 달성 가능 여부 */
  achievableAtDischarge: boolean;
}

/**
 * 목표 달성률 = 전역 예상 총자산 대비 비율.
 * 전역 총자산이 목표 금액 이상이면 달성 가능.
 */
export function evaluateGoal(goal: Goal, totalAssets: number): GoalProgress {
  const progress = goal.targetAmount > 0 ? totalAssets / goal.targetAmount : 0;
  return {
    goal,
    progress,
    achievableAtDischarge: totalAssets >= goal.targetAmount,
  };
}
