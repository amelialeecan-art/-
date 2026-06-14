/**
 * 네비게이션 파라미터 타입
 */
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

export type RootStackParamList = {
  Splash: undefined;
  OnboardingService: undefined;
  OnboardingSalary: undefined;
  OnboardingSavings: undefined;
  Main: undefined;
  SalaryDetail: undefined;
  Assets: undefined;
  Stats: undefined;
  Notifications: undefined;
  NotificationSettings: undefined;
  Celebration: { preview?: boolean } | undefined;
};

export type TabParamList = {
  Home: undefined;
  Savings: undefined;
  Timeline: undefined;
  Goals: undefined;
  Settings: undefined;
};

export type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

/** 루트 스택으로 이동 가능한 typed navigation 훅 */
export function useAppNavigation(): RootNavigation {
  return useNavigation<RootNavigation>();
}
