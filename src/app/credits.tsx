import Constants from 'expo-constants';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { TileBadge } from '@/components/TileView';
import { APP, CREDITS } from '@/constants/app';
import { colors, radii, spacing, typography } from '@/theme';

const TECHNOLOGIES = [
  'React Native',
  'Expo SDK 57',
  'Expo Router',
  'Expo Haptics',
  'AsyncStorage',
  'TypeScript',
];

function Row({ label, values }: { label: string; values: string[] }) {
  return (
    <View style={styles.rowItem}>
      <Text style={typography.label}>{label}</Text>
      {values.map((value) => (
        <Text key={value} style={typography.bodyStrong}>
          {value}
        </Text>
      ))}
    </View>
  );
}

export default function CreditsScreen() {
  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <Screen scroll footer={<AppButton label="Volver" icon="←" variant="secondary" onPress={goBack} />}>
      <View style={styles.hero}>
        <TileBadge value={2048} size={80} />
        <Text style={typography.title}>Créditos</Text>
        <Text style={[typography.body, styles.muted]}>
          {APP.name} · versión {Constants.expoConfig?.version ?? '1.0.0'}
        </Text>
      </View>

      <View style={styles.sections}>
        <Card title="Equipo" icon="👥">
          <Row label="Desarrollo" values={CREDITS.team} />
          <Row label="Práctica" values={[CREDITS.project]} />
        </Card>

        <Card title="Concepto" icon="💡">
          <Text style={typography.body}>
            Basado en el juego 2048 creado por Gabriele Cirulli (2014). Esta versión agrega una temática de
            crecimiento empresarial y dos poderes especiales: 🔀 Mover y 🗑️ Eliminar.
          </Text>
        </Card>

        <Card title="Tecnologías" icon="🛠️">
          <View style={styles.chips}>
            {TECHNOLOGIES.map((tech) => (
              <View key={tech} style={styles.chip}>
                <Text style={[typography.caption, styles.chipText]}>{tech}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card title="Gráficos" icon="🎨">
          <Text style={typography.body}>
            Las fichas usan emojis Unicode del sistema, por lo que su apariencia puede variar ligeramente entre
            dispositivos.
          </Text>
        </Card>

        <Text style={[typography.caption, styles.thanks]}>Hecho con 💙 para entretener de forma sana.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  muted: { color: colors.textMuted },
  hero: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xl },
  sections: { gap: spacing.lg },
  rowItem: { gap: 2 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    backgroundColor: colors.primarySoft,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
  },
  chipText: { color: colors.primaryDark },
  thanks: { textAlign: 'center', marginTop: spacing.sm },
});
