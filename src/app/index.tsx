import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { TileBadge } from '@/components/TileView';
import { APP } from '@/constants/app';
import { LEVELS, WIN_VALUE } from '@/game/levels';
import { COMBO_BONUS_PER_EXTRA_MERGE, MAX_CHARGES } from '@/game/logic';
import { INITIAL_CHARGES } from '@/game/useGame';
import { useBestScore } from '@/storage/bestScore';
import { colors, radii, spacing, typography } from '@/theme';

const STEPS = [
  'Desliza el dedo hacia arriba, abajo, izquierda o derecha: todas las fichas se mueven en esa dirección.',
  'Cuando dos fichas iguales chocan se fusionan en el siguiente nivel y ganas su valor en puntos.',
  `Si haces varias fusiones en un solo movimiento obtienes un combo: +${COMBO_BONUS_PER_EXTRA_MERGE} puntos por cada fusión extra.`,
  'Después de cada movimiento aparece una nueva 💡 Idea (o un 📝 Plan).',
  `Tu meta es llegar al 🦄 Unicornio (${WIN_VALUE}). La partida termina cuando ya no puedes moverte ni usar poderes.`,
];

const HERO_VALUES = [2, 64, 2048];

export default function HomeScreen() {
  const best = useBestScore();

  return (
    <Screen
      scroll
      footer={
        <View style={styles.footer}>
          <AppButton label="Créditos" variant="secondary" onPress={() => router.push('/credits')} style={styles.flex1} />
          <AppButton label="Jugar" icon="▶" onPress={() => router.push('/game')} style={styles.flex2} />
        </View>
      }
    >
      <View style={styles.hero}>
        <View style={styles.heroTiles}>
          {HERO_VALUES.map((value, i) => (
            <View key={value} style={styles.heroTileRow}>
              {i > 0 ? <Text style={styles.arrow}>→</Text> : null}
              <TileBadge value={value} size={64} />
            </View>
          ))}
        </View>
        <Text style={[typography.display, styles.center]}>{APP.name}</Text>
        <Text style={[typography.subtitle, styles.tagline]}>{APP.tagline}</Text>
        {best > 0 ? (
          <View style={styles.bestChip}>
            <Text style={[typography.bodyStrong, styles.bestText]}>🏅 Tu récord: {best}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.sections}>
        <Card title="¿De qué se trata?" icon="🎯">
          <Text style={typography.body}>{APP.description}</Text>
        </Card>

        <Card title="Cómo jugar" icon="🕹️">
          {STEPS.map((step, i) => (
            <View key={i} style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{i + 1}</Text>
              </View>
              <Text style={[typography.body, styles.flex1]}>{step}</Text>
            </View>
          ))}
        </Card>

        <Card title="Poderes especiales" icon="⚡">
          <View style={styles.power}>
            <Text style={styles.powerIcon}>🔀</Text>
            <View style={styles.flex1}>
              <Text style={typography.bodyStrong}>Mover</Text>
              <Text style={typography.body}>
                Elige una ficha y después la casilla a donde quieres llevarla. Si está vacía, la ficha se mueve; si
                hay otra ficha, intercambian lugares.
              </Text>
            </View>
          </View>
          <View style={styles.power}>
            <Text style={styles.powerIcon}>🗑️</Text>
            <View style={styles.flex1}>
              <Text style={typography.bodyStrong}>Eliminar</Text>
              <Text style={typography.body}>Elige cualquier ficha del tablero para quitarla.</Text>
            </View>
          </View>
          <View style={styles.note}>
            <Text style={[typography.body, styles.noteText]}>
              Empiezas con {INITIAL_CHARGES.swap} cargas de cada poder y ganas +1 de cada uno al alcanzar un nuevo
              nivel a partir de 🚀 64 (máximo {MAX_CHARGES}). Usar un poder no cuenta como turno.
            </Text>
          </View>
        </Card>

        <Card title="Niveles" icon="📶">
          <View style={styles.levels}>
            {LEVELS.filter((level) => level.value <= WIN_VALUE).map((level) => (
              <View key={level.value} style={styles.level}>
                <TileBadge value={level.value} size={52} />
                <Text style={[typography.caption, styles.levelName]} numberOfLines={1} adjustsFontSizeToFit>
                  {level.name}
                </Text>
              </View>
            ))}
          </View>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  flex2: { flex: 2 },
  center: { textAlign: 'center' },
  footer: { flexDirection: 'row', gap: spacing.md },
  hero: { alignItems: 'center', gap: spacing.sm, paddingTop: spacing.lg, paddingBottom: spacing.xl },
  heroTiles: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  heroTileRow: { flexDirection: 'row', alignItems: 'center' },
  arrow: { fontSize: 22, color: colors.textMuted, marginHorizontal: spacing.sm, fontWeight: '800' },
  tagline: { color: colors.accent, textAlign: 'center' },
  bestChip: {
    marginTop: spacing.sm,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: colors.successSoft,
  },
  bestText: { color: colors.success },
  sections: { gap: spacing.lg },
  step: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  stepNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumberText: { color: colors.textOnPrimary, fontWeight: '800', fontSize: 13 },
  power: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  powerIcon: { fontSize: 28, width: 36, textAlign: 'center' },
  note: { backgroundColor: colors.accentSoft, borderRadius: radii.md, padding: spacing.md },
  noteText: { fontSize: 14 },
  levels: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center' },
  level: { width: 68, alignItems: 'center', gap: 4 },
  levelName: { fontSize: 11, letterSpacing: 0, textAlign: 'center' },
});
