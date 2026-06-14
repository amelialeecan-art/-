/**
 * 콘페티 애니메이션 (전역 축하용)
 * Animated 로 위에서 떨어지는 조각들을 그린다.
 */
import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, useWindowDimensions, View } from 'react-native';

const COLORS = ['#B6FF4D', '#F5C451', '#34D399', '#FFFFFF', '#7FB534'];
const COUNT = 80;

interface Piece {
  left: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
  rotateTo: string;
}

export function Confetti({ runKey = 0 }: { runKey?: number }) {
  const { width, height } = useWindowDimensions();

  const pieces = useMemo<Piece[]>(
    () =>
      Array.from({ length: COUNT }).map((_, i) => ({
        left: Math.random() * width,
        color: COLORS[i % COLORS.length]!,
        size: 6 + Math.random() * 6,
        delay: Math.random() * 600,
        duration: 1800 + Math.random() * 1800,
        rotateTo: `${Math.random() * 720 - 360}deg`,
      })),
    [width, runKey],
  );

  return (
    <View pointerEvents="none" style={styles.layer}>
      {pieces.map((p, i) => (
        <Particle key={`${runKey}-${i}`} piece={p} height={height} />
      ))}
    </View>
  );
}

function Particle({ piece, height }: { piece: Piece; height: number }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.timing(progress, {
      toValue: 1,
      duration: piece.duration,
      delay: piece.delay,
      easing: Easing.linear,
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [progress, piece]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, height + 40],
  });
  const rotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', piece.rotateTo],
  });
  const opacity = progress.interpolate({
    inputRange: [0, 0.85, 1],
    outputRange: [1, 0.9, 0],
  });

  return (
    <Animated.View
      style={[
        styles.piece,
        {
          left: piece.left,
          width: piece.size,
          height: piece.size * 1.6,
          backgroundColor: piece.color,
          opacity,
          transform: [{ translateY }, { rotate }],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: 10,
  },
  piece: {
    position: 'absolute',
    top: 0,
    borderRadius: 2,
  },
});
