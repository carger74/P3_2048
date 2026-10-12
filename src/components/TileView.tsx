import { memo, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { getLevel } from '@/game/levels';
import { Tile } from '@/game/logic';
import { colors, typography } from '@/theme';

const USE_NATIVE_DRIVER = Platform.OS !== 'web';
const SLIDE_MS = 110;

type FaceProps = { value: number; size: number };

/** Apariencia de una ficha: emoji del nivel + valor numérico sobre el color de su nivel. */
export function TileFace({ value, size }: FaceProps) {
  const level = getLevel(value);
  const digits = String(value).length;
  return (
    <View style={[styles.face, { width: size, height: size, backgroundColor: level.background }]}>
      <Text style={{ fontSize: size * 0.42, lineHeight: size * 0.52 }} allowFontScaling={false}>
        {level.emoji}
      </Text>
      <Text
        allowFontScaling={false}
        style={[
          styles.value,
          { color: level.foreground, fontSize: size * (digits > 3 ? 0.15 : 0.18), lineHeight: size * 0.22 },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

/** Ficha estática para leyendas y resúmenes. */
export function TileBadge({ value, size = 56, style }: { value: number; size?: number; style?: ViewStyle }) {
  return (
    <View style={[styles.badge, { borderRadius: size * 0.2 }, style]}>
      <TileFace value={value} size={size} />
    </View>
  );
}

type Props = {
  tile: Tile;
  size: number;
  gap: number;
  selected?: boolean;
};

/** Ficha del tablero con animaciones de desplazamiento, aparición, fusión y eliminación. */
export const TileView = memo(function TileView({ tile, size, gap, selected }: Props) {
  const x = gap + tile.col * (size + gap);
  const y = gap + tile.row * (size + gap);
  const [position] = useState(() => new Animated.ValueXY({ x, y }));
  const [scale] = useState(() => new Animated.Value(tile.isNew ? 0 : 1));
  const previousValue = useRef(tile.value);

  useEffect(() => {
    Animated.timing(position, {
      toValue: { x, y },
      duration: SLIDE_MS,
      easing: Easing.out(Easing.quad),
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start();
  }, [position, x, y]);

  useEffect(() => {
    if (!tile.isNew) return;
    // La ficha nueva aparece cuando las demás terminan de deslizarse.
    Animated.sequence([
      Animated.delay(SLIDE_MS),
      Animated.spring(scale, { toValue: 1, friction: 6, tension: 120, useNativeDriver: USE_NATIVE_DRIVER }),
    ]).start();
    // Una ficha solo es "nueva" al montarse, así que esto se ejecuta una vez.
  }, [scale, tile.isNew]);

  useEffect(() => {
    if (previousValue.current === tile.value) return;
    previousValue.current = tile.value;
    Animated.sequence([
      Animated.delay(SLIDE_MS * 0.6),
      Animated.timing(scale, { toValue: 1.16, duration: 90, useNativeDriver: USE_NATIVE_DRIVER }),
      Animated.timing(scale, { toValue: 1, duration: 110, useNativeDriver: USE_NATIVE_DRIVER }),
    ]).start();
  }, [scale, tile.value]);

  useEffect(() => {
    if (!tile.vanishing) return;
    Animated.timing(scale, {
      toValue: 0,
      duration: 200,
      easing: Easing.in(Easing.back(2)),
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start();
  }, [scale, tile.vanishing]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          borderRadius: size * 0.16,
          transform: [{ translateX: position.x }, { translateY: position.y }, { scale }],
        },
      ]}
    >
      <TileFace value={tile.value} size={size} />
      {selected ? <View style={[styles.ring, { borderRadius: size * 0.16 }]} /> : null}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  face: { alignItems: 'center', justifyContent: 'center' },
  value: { ...typography.bodyStrong, fontWeight: '900' },
  badge: { overflow: 'hidden' },
  tile: { position: 'absolute', left: 0, top: 0, overflow: 'hidden' },
  ring: { ...StyleSheet.absoluteFill, borderWidth: 4, borderColor: colors.accent },
});
