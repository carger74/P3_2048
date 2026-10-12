import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, layout, spacing } from '@/theme';

type Props = {
  children: ReactNode;
  /** Contenido desplazable (pantallas informativas). */
  scroll?: boolean;
  /** Barra fija inferior, por ejemplo con los botones principales. */
  footer?: ReactNode;
  contentStyle?: ViewStyle;
};

/** Contenedor base de todas las pantallas: respeta las áreas seguras y limita el ancho. */
export function Screen({ children, scroll, footer, contentStyle }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.scrollContent, contentStyle]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.column}>{children}</View>
        </ScrollView>
      ) : (
        <View style={[styles.flex, styles.column, styles.fixedContent, contentStyle]}>{children}</View>
      )}
      {footer ? (
        <View style={styles.footer}>
          <View style={styles.column}>{footer}</View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  column: { width: '100%', maxWidth: layout.maxContentWidth, alignSelf: 'center' },
  scrollContent: { padding: layout.screenPadding, paddingBottom: spacing.xxl },
  fixedContent: { paddingHorizontal: layout.screenPadding, paddingTop: spacing.sm },
  footer: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
});
