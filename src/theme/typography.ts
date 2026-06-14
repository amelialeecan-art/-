/**
 * 타이포그래피 / 라운드 / 간격 토큰
 */
import { Platform } from 'react-native';

/** 숫자 강조용 monospace 계열 (금융 앱 느낌) */
export const numFontFamily = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
});

export const radius = {
  sm: 11,
  md: 16,
  lg: 20,
  xl: 26,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
};

export const fontSize = {
  tiny: 11,
  small: 13,
  body: 15,
  label: 13,
  h2: 20,
  h1: 26,
};
