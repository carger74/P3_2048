import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MAX_CHARGES } from '@/game/logic';
import { colors, radii, spacing, typography } from '@/theme';

type Props = {
  icon: string;
  label: string;
  charges: number;
  active: boolean;
  tone: 'primary' | 'danger';
  onPress: () => void;
};

/** Botón de poder especial con indicador de cargas disponibles. */
export function PowerButton({ icon, label, charges, active, tone, onPress }: Props) {
  const main = tone === 'danger' ? colors.danger : colors.primary;
  const soft = tone === 'danger' ? colors.dangerSoft : colors.primarySoft;
  const empty = charges === 0;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${charges} cargas`}
      accessibilityState={{ selected: active, disabled: empty }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { borderColor: main, backgroundColor: active ? main : soft },
        empty && !active && styles.empty,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.icon}>{icon}</Text>
      <View style={styles.texts}>
        <Text style={[typography.bodyStrong, { color: active ? colors.textOnPrimary : colors.text }]}>
          {active ? 'Cancelar' : label}
        </Text>
        <View style={styles.dots}>
          {Array.from({ length: MAX_CHARGES }, (_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { borderColor: active ? colors.textOnPrimary : main },
                i < charges && { backgroundColor: active ? colors.textOnPrimary : main },
              ]}
            />
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    borderWidth: 2,
  },
  icon: { fontSize: 26 },
  texts: { gap: 4 },
  dots: { flexDirection: 'row', gap: 4 },
  dot: { width: 9, height: 9, borderRadius: 5, borderWidth: 1.5 },
  empty: { opacity: 0.5 },
  pressed: { transform: [{ scale: 0.97 }] },
});
