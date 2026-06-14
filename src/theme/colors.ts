/**
 * 군월급 컬러 팔레트
 * 프로토타입의 다크/라이트 테마 변수를 그대로 옮겨왔다.
 * 라임 그린이 포인트 컬러.
 */
import type { ThemeMode } from '../types';

export interface ThemeColors {
  bg: string;
  card: string;
  card2: string;
  card3: string;
  inset: string;
  tx: string;
  tx2: string;
  tx3: string;
  line: string;
  line2: string;
  lime: string;
  limeDim: string;
  /** 라임 위에 올리는 글자색 (대비) */
  onLime: string;
  gold: string;
  up: string;
  danger: string;
  /** 누적 그래프 세그먼트 */
  segPay: string;
  segPrin: string;
}

const dark: ThemeColors = {
  bg: '#0B1014',
  card: '#141C24',
  card2: '#1A2530',
  card3: '#212E3A',
  inset: '#1E2A35',
  tx: '#F2F5F8',
  tx2: '#93A1AE',
  tx3: '#5E6B77',
  line: 'rgba(255,255,255,0.08)',
  line2: 'rgba(255,255,255,0.05)',
  lime: '#B6FF4D',
  limeDim: '#7FB534',
  onLime: '#0A0F08',
  gold: '#F5C451',
  up: '#34D399',
  danger: '#FF5A5F',
  segPay: '#5C6B7B',
  segPrin: '#3A4A5C',
};

const light: ThemeColors = {
  bg: '#EDF1F6',
  card: '#FFFFFF',
  card2: '#F3F6FA',
  card3: '#E7ECF2',
  inset: '#EEF2F7',
  tx: '#0F1722',
  tx2: '#5C6B7B',
  tx3: '#9AA7B5',
  line: 'rgba(15,23,34,0.09)',
  line2: 'rgba(15,23,34,0.06)',
  lime: '#5FA300',
  limeDim: '#7FB534',
  onLime: '#FFFFFF',
  gold: '#B8860B',
  up: '#0F9B63',
  danger: '#E5484D',
  segPay: '#7E93A8',
  segPrin: '#8A9CAE',
};

export const palettes: Record<ThemeMode, ThemeColors> = { dark, light };

export function getColors(mode: ThemeMode): ThemeColors {
  return palettes[mode];
}
