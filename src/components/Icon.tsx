/**
 * 아이콘 컴포넌트 (react-native-svg)
 * 프로토타입 proto.js 의 라인 아이콘 세트를 그대로 포팅.
 */
import React from 'react';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

export type IconName =
  | 'home'
  | 'bank'
  | 'timeline'
  | 'goal'
  | 'settings'
  | 'chev'
  | 'won'
  | 'coins'
  | 'clock'
  | 'flag'
  | 'trend'
  | 'plus'
  | 'check'
  | 'bell'
  | 'shield'
  | 'refresh'
  | 'medal'
  | 'share'
  | 'logo';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

function renderPaths(name: IconName, color: string): React.ReactNode {
  const s = color;
  switch (name) {
    case 'home':
      return <Path d="M3 10.2 12 3l9 7.2V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" stroke={s} />;
    case 'bank':
      return (
        <>
          <Path d="M4 9.5 12 4l8 5.5" stroke={s} />
          <Path d="M5 10v7M9.5 10v7M14.5 10v7M19 10v7" stroke={s} />
          <Path d="M3.5 20.5h17" stroke={s} />
        </>
      );
    case 'timeline':
      return (
        <>
          <Rect x={3.5} y={4.5} width={17} height={16} rx={2.5} stroke={s} />
          <Path d="M3.5 9h17M8 3v3M16 3v3" stroke={s} />
          <Path d="M7 13h4M7 16.5h7" stroke={s} />
        </>
      );
    case 'goal':
      return (
        <>
          <Circle cx={12} cy={12} r={8.2} stroke={s} />
          <Circle cx={12} cy={12} r={4} stroke={s} />
          <Circle cx={12} cy={12} r={0.6} fill={s} stroke={s} />
        </>
      );
    case 'settings':
      return (
        <>
          <Circle cx={12} cy={12} r={3} stroke={s} />
          <Path
            d="M19.4 13a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"
            stroke={s}
          />
        </>
      );
    case 'chev':
      return <Path d="M9 6l6 6-6 6" stroke={s} />;
    case 'won':
      return (
        <>
          <Path d="M4 6l3 12 5-9 5 9 3-12" stroke={s} />
          <Path d="M3 10h18" stroke={s} />
        </>
      );
    case 'coins':
      return (
        <>
          <Ellipse cx={9} cy={7} rx={5.5} ry={2.6} stroke={s} />
          <Path d="M3.5 7v4c0 1.4 2.5 2.6 5.5 2.6" stroke={s} />
          <Ellipse cx={15} cy={13} rx={5.5} ry={2.6} stroke={s} />
          <Path d="M9.5 13v4c0 1.4 2.5 2.6 5.5 2.6s5.5-1.2 5.5-2.6v-4" stroke={s} />
        </>
      );
    case 'clock':
      return (
        <>
          <Circle cx={12} cy={12} r={8.2} stroke={s} />
          <Path d="M12 8v4.2l2.8 1.7" stroke={s} />
        </>
      );
    case 'flag':
      return <Path d="M5 21V4M5 4h11l-2 4 2 4H5" stroke={s} />;
    case 'trend':
      return (
        <>
          <Path d="M3 16l5-5 4 3 6-7" stroke={s} />
          <Path d="M18 7h3v3" stroke={s} />
        </>
      );
    case 'plus':
      return <Path d="M12 5v14M5 12h14" stroke={s} />;
    case 'check':
      return <Path d="M4 12.5l5 5 11-12" stroke={s} />;
    case 'bell':
      return (
        <>
          <Path d="M18 9a6 6 0 1 0-12 0c0 6-2.5 7-2.5 7h17S18 15 18 9" stroke={s} />
          <Path d="M10.5 20a2 2 0 0 0 3 0" stroke={s} />
        </>
      );
    case 'shield':
      return <Path d="M12 3l7 3v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6z" stroke={s} />;
    case 'refresh':
      return (
        <>
          <Path d="M20 11a8 8 0 0 0-14-4.5L4 9M4 13a8 8 0 0 0 14 4.5L20 15" stroke={s} />
          <Path d="M4 5v4h4M20 19v-4h-4" stroke={s} />
        </>
      );
    case 'medal':
      return (
        <>
          <Circle cx={12} cy={15} r={5} stroke={s} />
          <Path d="M12 13.5l1 2M8.5 10 6 3h4l2 4M15.5 10 18 3h-4l-2 4" stroke={s} />
        </>
      );
    case 'share':
      return (
        <>
          <Circle cx={18} cy={5} r={2.6} stroke={s} />
          <Circle cx={6} cy={12} r={2.6} stroke={s} />
          <Circle cx={18} cy={19} r={2.6} stroke={s} />
          <Path d="M8.2 10.8 15.8 6.4M8.2 13.2l7.6 4.4" stroke={s} />
        </>
      );
    case 'logo':
      return (
        <>
          <Path d="M4 16l5-5 4 3 6-8" stroke={s} />
          <Path d="M16 5h4v4" stroke={s} />
        </>
      );
    default:
      return null;
  }
}

export function Icon({ name, size = 22, color = '#fff', strokeWidth = 1.9 }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {renderPaths(name, color)}
    </Svg>
  );
}
