import { useEffect, useState } from 'react';
import { Animated, Platform, StyleSheet } from 'react-native';

import { Gain } from '@/game/useGame';
import { colors } from '@/theme';

const USE_NATIVE_DRIVER = Platform.OS !== 'web';

/** "+puntos" que flota y se desvanece sobre el marcador cada vez que se suman puntos. */
export function ScorePop({ gain }: { gain: Gain | null }) {
  const [progress] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (!gain) return;
    progress.setValue(0);
    Animated.timing(progress, { toValue: 1, duration: 700, useNativeDriver: USE_NATIVE_DRIVER }).start();
  }, [gain, progress]);

  if (!gain) return null;

  return (
    <Animated.Text
      pointerEvents="none"
      style={[
        styles.pop,
        {
          opacity: progress.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 1, 0] }),
          transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [0, -28] }) }],
        },
      ]}
    >
      +{gain.points}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  pop: {
    position: 'absolute',
    bottom: 4,
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: '900',
    color: colors.accent,
  },
});
