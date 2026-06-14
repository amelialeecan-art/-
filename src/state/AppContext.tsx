/**
 * 앱 전역 상태 컨텍스트
 * 상태 보관 + 영속화 + 테마 색상 제공.
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type {
  AppSettings,
  AppState,
  Goal,
  NotificationSettings,
  SavingsConfig,
  UserServiceInfo,
} from '../types';
import { createDefaultState } from '../constants/defaultConfig';
import { clearState, loadState, saveState } from '../storage/appStorage';
import { getColors, ThemeColors } from '../theme/colors';

interface AppContextValue {
  state: AppState;
  loading: boolean;
  colors: ThemeColors;
  updateService: (patch: Partial<UserServiceInfo>) => void;
  updateSavings: (patch: Partial<SavingsConfig>) => void;
  updateSettings: (patch: Partial<AppSettings>) => void;
  updateNotifications: (patch: Partial<NotificationSettings>) => void;
  toggleTheme: () => void;
  completeOnboarding: () => void;
  setGoals: (goals: Goal[]) => void;
  addGoal: (goal: Goal) => void;
  removeGoal: (id: string) => void;
  resetAll: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => createDefaultState());
  const [loading, setLoading] = useState(true);
  const hydrated = useRef(false);

  // 최초 로드
  useEffect(() => {
    let mounted = true;
    loadState().then((loaded) => {
      if (!mounted) return;
      setState(loaded);
      hydrated.current = true;
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // 변경 시마다 자동 저장 (하이드레이션 이후)
  useEffect(() => {
    if (!hydrated.current) return;
    saveState(state);
  }, [state]);

  const updateService = useCallback((patch: Partial<UserServiceInfo>) => {
    setState((s) => ({ ...s, service: { ...s.service, ...patch } }));
  }, []);

  const updateSavings = useCallback((patch: Partial<SavingsConfig>) => {
    setState((s) => ({ ...s, savings: { ...s.savings, ...patch } }));
  }, []);

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setState((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
  }, []);

  const updateNotifications = useCallback((patch: Partial<NotificationSettings>) => {
    setState((s) => ({ ...s, notifications: { ...s.notifications, ...patch } }));
  }, []);

  const toggleTheme = useCallback(() => {
    setState((s) => ({
      ...s,
      settings: { ...s.settings, theme: s.settings.theme === 'dark' ? 'light' : 'dark' },
    }));
  }, []);

  const completeOnboarding = useCallback(() => {
    setState((s) => ({ ...s, settings: { ...s.settings, onboardingCompleted: true } }));
  }, []);

  const setGoals = useCallback((goals: Goal[]) => {
    setState((s) => ({ ...s, goals }));
  }, []);

  const addGoal = useCallback((goal: Goal) => {
    setState((s) => ({ ...s, goals: [...s.goals, goal] }));
  }, []);

  const removeGoal = useCallback((id: string) => {
    setState((s) => ({ ...s, goals: s.goals.filter((g) => g.id !== id) }));
  }, []);

  const resetAll = useCallback(() => {
    const fresh = createDefaultState();
    setState(fresh);
    clearState();
  }, []);

  const colors = useMemo(() => getColors(state.settings.theme), [state.settings.theme]);

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      loading,
      colors,
      updateService,
      updateSavings,
      updateSettings,
      updateNotifications,
      toggleTheme,
      completeOnboarding,
      setGoals,
      addGoal,
      removeGoal,
      resetAll,
    }),
    [
      state,
      loading,
      colors,
      updateService,
      updateSavings,
      updateSettings,
      updateNotifications,
      toggleTheme,
      completeOnboarding,
      setGoals,
      addGoal,
      removeGoal,
      resetAll,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

/** 테마 색상만 필요할 때 */
export function useColors(): ThemeColors {
  return useApp().colors;
}
