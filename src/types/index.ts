/**
 * 군월급 앱 전역 타입 정의
 * 모든 도메인 데이터 구조를 한 곳에서 관리한다.
 */

/** 병사 계급 */
export type Rank = '이병' | '일병' | '상병' | '병장';

/** 계급 순서 (진급 계산 기준) */
export const RANK_ORDER: Rank[] = ['이병', '일병', '상병', '병장'];

/** 계급별 복무 개월 수 */
export type RankPeriods = Record<Rank, number>;

/** 계급별 월급 (원) */
export type RankSalaryTable = Record<Rank, number>;

/** 군 복무 유형 프리셋 */
export interface ServiceType {
  /** 식별 키 */
  key: string;
  /** 표시 이름 (예: 육군 18개월) */
  label: string;
  /** 총 복무 개월 수 */
  months: number;
}

/** 사용자 복무 정보 */
export interface UserServiceInfo {
  /** 입대일 (ISO yyyy-mm-dd) */
  enlistmentDate: string;
  /** 전역일 (ISO yyyy-mm-dd) */
  dischargeDate: string;
  /** 복무 유형 키 */
  serviceType: string;
  /** 월급 지급일 (1~28일) */
  monthlyPayDay: number;
  /** 계급별 기간 (개월) */
  rankPeriods: RankPeriods;
  /** 계급별 월급 (원) */
  rankSalaryTable: RankSalaryTable;
}

/** 적금 가입 은행 */
export interface SavingsBank {
  id: string;
  name: string;
  /** 월 납입액 (원) */
  amount: number;
}

/** 군적금(장병내일준비적금) 설정 */
export interface SavingsConfig {
  /** 가입 여부 */
  enabled: boolean;
  /** 월 납입액 합계 (원) */
  monthlyDeposit: number;
  /** 은행별 납입 */
  banks: SavingsBank[];
  /** 정부 매칭지원금 비율 (0~1, 예: 0.71) */
  matchingRate: number;
  /** 예상 연 금리 (0~1, 예: 0.05) */
  interestRate: number;
}

/** 테마 모드 */
export type ThemeMode = 'dark' | 'light';

/** 소수점 표시 자리수 옵션 */
export type DecimalPlaces = 0 | 2 | 5 | 10;

/** 앱 설정 */
export interface AppSettings {
  /** 실시간 카운터 소수점 자리수 */
  decimalPlaces: DecimalPlaces;
  /** 테마 */
  theme: ThemeMode;
  /** 온보딩 완료 여부 */
  onboardingCompleted: boolean;
}

/** 알림 설정 종류 */
export interface NotificationSettings {
  /** 월급날 알림 */
  payday: boolean;
  /** 적금 납입 알림 */
  savings: boolean;
  /** 진급 예정 알림 */
  promotion: boolean;
  /** 전역 D-day 알림 */
  discharge: boolean;
}

/** 사용자 목표 */
export interface Goal {
  id: string;
  title: string;
  /** 목표 금액 (원) */
  targetAmount: number;
  /** 이모지 아이콘 */
  icon: string;
  /** 생성 시각 (ISO) */
  createdAt: string;
}

/** 앱 전역 상태 (영속화 대상) */
export interface AppState {
  service: UserServiceInfo;
  savings: SavingsConfig;
  settings: AppSettings;
  notifications: NotificationSettings;
  goals: Goal[];
}
