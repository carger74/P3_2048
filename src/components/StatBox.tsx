import { ReactNode } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';

type Props = {
  label: string;
  value: string | number;
  tone?: 'primary' | 'light';
  style?: ViewStyle;
  /** Elemento superpuesto (por ejemplo, la animación de "+puntos"). */
  children?: ReactNode;
};

/** Caja de estadística (puntos, récord, movimientos...). */
export function StatBox({ label, value, tone = 'light', style, children }: Props) {
  const primary = tone === 'primary';
  return (
    <View style={[styles.box, primary ? styles.primary : styles.light, style]}>
      <Text style={[typography.label, primary && styles.primaryLabel]}>{label}</Text>
      <Text
        style={[typography.subtitle, styles.value, primary && styles.primaryValue]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {value}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.md,
  },
  light: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  primary: { backgroundColor: colors.primary },
  primaryLabel: { color: colors.primarySoft },
  value: { fontSize: 20, marginTop: 2 },
  primaryValue: { color: colors.textOnPrimary },
});
