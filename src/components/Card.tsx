import { ReactNode } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import { colors, radii, shadows, spacing, typography } from '@/theme';

type Props = {
  title?: string;
  icon?: string;
  children: ReactNode;
  style?: ViewStyle;
};

/** Tarjeta de contenido con título opcional. */
export function Card({ title, icon, children, style }: Props) {
  return (
    <View style={[styles.card, style]}>
      {title ? (
        <View style={styles.header}>
          {icon ? <Text style={styles.icon}>{icon}</Text> : null}
          <Text style={typography.subtitle}>{title}</Text>
        </View>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.card,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  icon: { fontSize: 20 },
});
