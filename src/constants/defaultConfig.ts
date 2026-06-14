/**
 * 기본 설정값
 * 온보딩 전/초기화 시 사용하는 디폴트 데이터.
 */
import type {
  AppState,
  NotificationSettings,
  RankPeriods,
  RankSalaryTable,
  SavingsConfig,
  ServiceType,
} from '../types';
import { addMonths, toISODate } from '../lib/dateUtils';

/** 복무 유형 프리셋 */
export const SERVICE_TYPES: ServiceType[] = [
  { key: 'army', label: '육군 18개월', months: 18 },
  { key: 'navy', label: '해군 20개월', months: 20 },
  { key: 'airforce', label: '공군 21개월', months: 21 },
  { key: 'custom', label: '직접 수정', months: 18 },
];

/** 계급별 기본 기간 (개월) — 합계 18 */
export const DEFAULT_RANK_PERIODS: RankPeriods = {
  이병: 2,
  일병: 6,
  상병: 6,
  병장: 4,
};

/** 계급별 기본 월급 (원) */
export const DEFAULT_RANK_SALARY: RankSalaryTable = {
  이병: 750000,
  일병: 900000,
  상병: 1200000,
  병장: 1500000,
};

/** 기본 군적금 설정 */
export const DEFAULT_SAVINGS: SavingsConfig = {
  enabled: true,
  monthlyDeposit: 400000,
  banks: [
    { id: 'kb', name: '국민은행', amount: 200000 },
    { id: 'ibk', name: '기업은행', amount: 200000 },
  ],
  matchingRate: 0.71,
  interestRate: 0.05,
};

/** 기본 알림 설정 */
export const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  payday: true,
  savings: true,
  promotion: true,
  discharge: true,
};

/** 기본 목표 예시 */
export const DEFAULT_GOALS = [
  { title: '전역 후 여행비', targetAmount: 3000000, icon: '✈️' },
  { title: '노트북', targetAmount: 2000000, icon: '💻' },
  { title: '자취 보증금', targetAmount: 10000000, icon: '🏠' },
  { title: '학비', targetAmount: 5000000, icon: '🎓' },
  { title: '그냥 2,000만 원 모으기', targetAmount: 20000000, icon: '🎯' },
];

/** 초기 전체 상태 생성 (입대일 기본값 = 오늘) */
export function createDefaultState(enlistmentDate?: string): AppState {
  const enlist = enlistmentDate ?? toISODate(new Date());
  const months = 18;
  return {
    service: {
      enlistmentDate: enlist,
      dischargeDate: toISODate(addMonths(new Date(enlist), months)),
      serviceType: 'army',
      monthlyPayDay: 10,
      rankPeriods: { ...DEFAULT_RANK_PERIODS },
      rankSalaryTable: { ...DEFAULT_RANK_SALARY },
    },
    savings: { ...DEFAULT_SAVINGS, banks: DEFAULT_SAVINGS.banks.map((b) => ({ ...b })) },
    settings: {
      decimalPlaces: 10,
      theme: 'dark',
      onboardingCompleted: false,
    },
    notifications: { ...DEFAULT_NOTIFICATIONS },
    goals: DEFAULT_GOALS.map((g, i) => ({
      id: `goal-${i}`,
      title: g.title,
      targetAmount: g.targetAmount,
      icon: g.icon,
      createdAt: new Date().toISOString(),
    })),
  };
}
