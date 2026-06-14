/**
 * 로컬 영속 저장 (AsyncStorage)
 * 앱을 닫았다 켜도 설정/상태가 유지되도록 직렬화/역직렬화를 담당.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { AppState } from '../types';
import { createDefaultState } from '../constants/defaultConfig';

const STORAGE_KEY = 'gunwolgup:state:v1';

/** 저장된 부분 상태를 기본값과 병합하여 누락 필드 보정 */
function mergeWithDefaults(saved: Partial<AppState> | null): AppState {
  const base = createDefaultState();
  if (!saved) return base;
  return {
    service: { ...base.service, ...saved.service },
    savings: {
      ...base.savings,
      ...saved.savings,
      banks: saved.savings?.banks ?? base.savings.banks,
    },
    settings: { ...base.settings, ...saved.settings },
    notifications: { ...base.notifications, ...saved.notifications },
    goals: saved.goals ?? base.goals,
  };
}

/** 상태 로드 (없으면 기본값) */
export async function loadState(): Promise<AppState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return mergeWithDefaults(parsed);
  } catch (e) {
    console.warn('[appStorage] load failed, using defaults', e);
    return createDefaultState();
  }
}

/** 상태 저장 */
export async function saveState(state: AppState): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('[appStorage] save failed', e);
  }
}

/** 전체 초기화 */
export async function clearState(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('[appStorage] clear failed', e);
  }
}
