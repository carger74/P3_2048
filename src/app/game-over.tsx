import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { StatBox } from '@/components/StatBox';
import { TileBadge } from '@/components/TileView';
import { getLevel, WIN_VALUE } from '@/game/levels';
import { colors, radii, spacing, typography } from '@/theme';

type Params = {
  score?: string;
  best?: string;
  record?: string;
  maxTile?: string;
  moves?: string;
  powers?: string;
  won?: string;
};

function toNumber(value: string | undefined, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function messageFor(maxTile: number, won: boolean): string {
  if (won || maxTile >= WIN_VALUE) return 'Llevaste una idea hasta la cima. ¡Eres todo un estratega!';
  if (maxTile >= 512) return '¡Muy cerca del unicornio! Tu proyecto ya genera mucho valor.';
  if (maxTile >= 128) return 'Tu proyecto está creciendo. Planea tus fusiones y usa los poderes a tiempo.';
  if (maxTile >= 32) return 'Buen arranque. Intenta mantener la ficha más grande en una esquina.';
  return 'Toda gran empresa empieza con una idea. ¡Inténtalo de nuevo!';
}

export default function GameOverScreen() {
  const params = useLocalSearchParams<Params>();
  const score = toNumber(params.score);
  const best = toNumber(params.best, score);
  const maxTile = toNumber(params.maxTile, 2);
  const moves = toNumber(params.moves);
  const powers = toNumber(params.powers);
  const won = params.won === '1';
  const isRecord = params.record === '1' && score > 0;
  const level = getLevel(maxTile);

  return (
    <Screen
      scroll
      footer={
        <View style={styles.footer}>
          <AppButton label="Jugar de nuevo" icon="↻" onPress={() => router.replace('/game')} />
          <View style={styles.row}>
            <AppButton label="Inicio" variant="secondary" onPress={() => router.dismissTo('/')} style={styles.flex1} />
            <AppButton label="Créditos" variant="ghost" onPress={() => router.push('/credits')} style={styles.flex1} />
          </View>
        </View>
      }
    >
      <View style={styles.hero}>
        <Text style={[typography.label, styles.kicker]}>{won ? 'Misión cumplida' : 'Juego terminado'}</Text>
        <TileBadge value={maxTile} size={112} />
        <Text style={[typography.bodyStrong, styles.levelName]}>Nivel alcanzado: {level.name}</Text>
        <Text style={[typography.title, styles.center]}>{won ? '¡Unicornio alcanzado! 🦄' : '¡Fin de la partida!'}</Text>
        <Text style={[typography.body, styles.center, styles.muted]}>{messageFor(maxTile, won)}</Text>
        {isRecord ? (
          <View style={styles.recordChip}>
            <Text style={[typography.bodyStrong, styles.recordText]}>🏅 ¡Nuevo récord!</Text>
          </View>
        ) : null}
      </View>

      <Card>
        <Text style={[typography.label, styles.center]}>Puntuación final</Text>
        <Text style={styles.score}>{score}</Text>
        <View style={styles.row}>
          <StatBox label="Récord" value={best} />
          <StatBox label="Movimientos" value={moves} />
        </View>
        <View style={styles.row}>
          <StatBox label="Ficha máxima" value={`${level.emoji} ${maxTile}`} />
          <StatBox label="Poderes usados" value={powers} />
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  center: { textAlign: 'center' },
  muted: { color: colors.textMuted },
  row: { flexDirection: 'row', gap: spacing.md },
  footer: { gap: spacing.md },
  hero: { alignItems: 'center', gap: spacing.md, paddingTop: spacing.xl, paddingBottom: spacing.xl },
  kicker: { color: colors.accent },
  levelName: { color: colors.primary, textAlign: 'center' },
  recordChip: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
    backgroundColor: colors.successSoft,
  },
  recordText: { color: colors.success },
  score: {
    ...typography.display,
    fontSize: 56,
    textAlign: 'center',
    color: colors.primary,
  },
});
