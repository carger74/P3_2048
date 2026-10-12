import { Platform, StyleSheet, TextStyle, ViewStyle } from 'react-native';

/**
 * Identidad visual de Fusión 2048.
 * Paleta corporativa (azul de confianza) con acentos cálidos para un tono amigable.
 * Todas las pantallas y componentes deben consumir estos tokens en lugar de valores sueltos.
 */
export const colors = {
  background: '#F4F6FB',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF2FA',
  primary: '#2F4CDD',
  primaryDark: '#1E2F8F',
  primarySoft: '#E3E8FD',
  accent: '#FF8A3D',
  accentSoft: '#FFE9DA',
  success: '#1FAF7A',
  successSoft: '#DDF6EC',
  danger: '#E5484D',
  dangerSoft: '#FDE4E4',
  text: '#14213D',
  textMuted: '#5B6785',
  textOnPrimary: '#FFFFFF',
  border: '#E1E6F0',
  board: '#C9D3EA',
  cell: '#DFE6F5',
  overlay: 'rgba(20, 33, 61, 0.55)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  pill: 999,
} as const;

const fontFamily = Platform.select({ ios: 'System', android: 'sans-serif', default: undefined });

export const typography = StyleSheet.create({
  display: { fontFamily, fontSize: 40, fontWeight: '900', color: colors.text, letterSpacing: -1 },
  title: { fontFamily, fontSize: 26, fontWeight: '800', color: colors.text },
  subtitle: { fontFamily, fontSize: 18, fontWeight: '700', color: colors.text },
  body: { fontFamily, fontSize: 15, fontWeight: '400', color: colors.text, lineHeight: 22 },
  bodyStrong: { fontFamily, fontSize: 15, fontWeight: '700', color: colors.text, lineHeight: 22 },
  caption: { fontFamily, fontSize: 12, fontWeight: '600', color: colors.textMuted, letterSpacing: 0.4 },
  label: {
    fontFamily,
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
}) satisfies Record<string, TextStyle>;

export const shadows = {
  card: Platform.select<ViewStyle>({
    web: { boxShadow: '0 6px 18px rgba(20, 33, 61, 0.08)' },
    default: {
      shadowColor: '#14213D',
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 3,
    },
  }),
  button: Platform.select<ViewStyle>({
    web: { boxShadow: '0 4px 10px rgba(47, 76, 221, 0.25)' },
    default: {
      shadowColor: '#2F4CDD',
      shadowOpacity: 0.25,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
  }),
};

export const layout = {
  /** Ancho máximo del contenido para que se vea bien en tablets y web. */
  maxContentWidth: 480,
  screenPadding: spacing.lg,
} as const;
