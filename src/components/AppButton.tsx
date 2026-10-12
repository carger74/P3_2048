import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { colors, radii, shadows, spacing, typography } from '@/theme';

type Variant = 'primary' | 'secondary' | 'accent' | 'ghost';
type Size = 'md' | 'sm';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  icon?: string;
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityHint?: string;
};

const VARIANTS: Record<Variant, { container: ViewStyle; text: string }> = {
  primary: { container: { backgroundColor: colors.primary, ...shadows.button }, text: colors.textOnPrimary },
  accent: { container: { backgroundColor: colors.accent }, text: colors.textOnPrimary },
  secondary: {
    container: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.primary },
    text: colors.primary,
  },
  ghost: { container: { backgroundColor: colors.primarySoft }, text: colors.primaryDark },
};

/** Botón estándar de la app; todas las acciones usan este componente para mantener la identidad visual. */
export function AppButton({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  disabled,
  style,
  accessibilityHint,
}: Props) {
  const theme = VARIANTS[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        size === 'sm' ? styles.sm : styles.md,
        theme.container,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.row}>
        {icon ? (
          <Text style={[styles.icon, size === 'sm' && styles.iconSm, { color: theme.text }]}>{icon}</Text>
        ) : null}
        <Text style={[typography.bodyStrong, styles.label, size === 'sm' && styles.labelSm, { color: theme.text }]}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center' },
  md: { paddingVertical: spacing.md + 2, paddingHorizontal: spacing.xl },
  sm: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  icon: { fontSize: 18 },
  iconSm: { fontSize: 14 },
  label: { fontSize: 16 },
  labelSm: { fontSize: 14 },
  pressed: { transform: [{ scale: 0.97 }], opacity: 0.9 },
  disabled: { opacity: 0.45 },
});
