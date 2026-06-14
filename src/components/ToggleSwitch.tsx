/**
 * 온/오프 토글 스위치 (프로토타입 .toggle 재현)
 */
import React from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { useColors } from '../state/AppContext';

export function ToggleSwitch({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (next: boolean) => void;
}) {
  const c = useColors();
  const anim = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [value, anim]);

  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [2, 22] });

  return (
    <Pressable onPress={() => onChange(!value)}>
      <View
        style={[
          styles.track,
          { backgroundColor: value ? c.lime : 'rgba(255,255,255,0.16)' },
        ]}
      >
        <Animated.View style={[styles.knob, { transform: [{ translateX }] }]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 46,
    height: 26,
    borderRadius: 999,
    justifyContent: 'center',
  },
  knob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
  },
});
