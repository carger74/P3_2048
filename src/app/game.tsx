import { router } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';
import { BackHandler, Modal, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/AppButton';
import { Board } from '@/components/Board';
import { Card } from '@/components/Card';
import { PowerButton } from '@/components/PowerButton';
import { Screen } from '@/components/Screen';
import { ScorePop } from '@/components/ScorePop';
import { StatBox } from '@/components/StatBox';
import { TileBadge } from '@/components/TileView';
import { APP } from '@/constants/app';
import { feedback } from '@/game/feedback';
import { getLevel, WIN_VALUE } from '@/game/levels';
import { useSwipeControls } from '@/game/useControls';
import { GameState, useGame } from '@/game/useGame';
import { submitScore, useBestScore } from '@/storage/bestScore';
import { colors, layout, radii, spacing, typography } from '@/theme';
import { confirmAction } from '@/utils/confirm';

type HintTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'primary';

const HINT_COLORS: Record<HintTone, { background: string; text: string }> = {
  neutral: { background: colors.surfaceAlt, text: colors.textMuted },
  info: { background: colors.primarySoft, text: colors.primaryDark },
  primary: { background: colors.primarySoft, text: colors.primaryDark },
  success: { background: colors.successSoft, text: colors.success },
  warning: { background: colors.accentSoft, text: '#B4530F' },
  danger: { background: colors.dangerSoft, text: colors.danger },
};

function hintFor(state: GameState): { text: string; tone: HintTone } {
  if (state.over) return { text: 'Sin movimientos ni poderes. ¡Fin de la partida!', tone: 'danger' };
  if (state.notice) return { text: state.notice.text, tone: state.notice.tone };
  if (state.mode === 'delete') return { text: '🗑️ Toca la ficha que quieres eliminar.', tone: 'danger' };
  if (state.mode === 'swap') {
    return state.selectedId === null
      ? { text: '🔀 Toca la ficha que quieres mover.', tone: 'primary' }
      : { text: '🔀 Ahora toca el destino: una casilla vacía o una ficha para intercambiar.', tone: 'primary' };
  }
  if (state.stuck) return { text: '¡Sin movimientos! Usa un poder para seguir.', tone: 'warning' };
  return { text: 'Desliza para mover las fichas y fusionar las iguales.', tone: 'neutral' };
}

export default function GameScreen() {
  const { state, newGame, move, togglePower, pressCell, keepPlaying } = useGame();
  const best = useBestScore();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const finishing = useRef(false);

  const usableHeight = height - insets.top - insets.bottom;
  const boardWidth = Math.floor(
    Math.min(width - layout.screenPadding * 2, layout.maxContentWidth, usableHeight * 0.52),
  );
  const showWin = state.won && !state.keepPlaying;
  const swipeHandlers = useSwipeControls(move, state.mode === 'none' && !state.over && !showWin);

  const finish = useCallback(
    async (won: boolean) => {
      if (finishing.current) return;
      finishing.current = true;
      const previousBest = await submitScore(state.score);
      router.replace({
        pathname: '/game-over',
        params: {
          score: String(state.score),
          best: String(Math.max(previousBest, state.score)),
          record: state.score > previousBest ? '1' : '0',
          maxTile: String(state.maxValue),
          moves: String(state.moves),
          powers: String(state.powersUsed),
          won: won ? '1' : '0',
        },
      });
    },
    [state.score, state.maxValue, state.moves, state.powersUsed],
  );

  const leave = useCallback(() => {
    const exit = () => (router.canGoBack() ? router.back() : router.replace('/'));
    if (state.moves === 0) return exit();
    confirmAction('¿Salir de la partida?', 'Perderás el progreso de esta partida.', 'Salir', exit);
  }, [state.moves]);

  const restart = useCallback(() => {
    const reset = () => {
      finishing.current = false;
      newGame();
    };
    if (state.moves === 0) return reset();
    confirmAction('¿Reiniciar?', 'Comenzarás una partida nueva desde cero.', 'Reiniciar', reset);
  }, [newGame, state.moves]);

  // Fin de partida: se deja ver el tablero un momento antes de pasar al resumen.
  const finishRef = useRef(finish);
  useEffect(() => {
    finishRef.current = finish;
  }, [finish]);
  useEffect(() => {
    if (!state.over) return;
    const timer = setTimeout(() => finishRef.current(state.won), 1400);
    return () => clearTimeout(timer);
  }, [state.over, state.won]);

  // Botón "atrás" de Android: confirmar antes de abandonar.
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      leave();
      return true;
    });
    return () => subscription.remove();
  }, [leave]);

  // Retroalimentación háptica.
  useEffect(() => {
    if (state.lastGain) feedback.merge(state.lastGain.combo);
  }, [state.lastGain]);
  useEffect(() => {
    if (state.notice?.tone === 'success') feedback.success();
    if (state.notice?.tone === 'warning') feedback.warning();
  }, [state.notice]);
  useEffect(() => {
    if (state.powersUsed > 0) feedback.power();
  }, [state.powersUsed]);
  useEffect(() => {
    if (state.over) feedback.warning();
  }, [state.over]);

  const hint = hintFor(state);
  const hintColors = HINT_COLORS[hint.tone];
  const current = getLevel(state.maxValue);

  return (
    <Screen>
      <View style={styles.header}>
        <AppButton label="Inicio" icon="←" variant="ghost" size="sm" onPress={leave} />
        <Text style={[typography.subtitle, styles.title]} numberOfLines={1}>
          {APP.name}
        </Text>
        <AppButton label="Reiniciar" icon="↻" variant="ghost" size="sm" onPress={restart} />
      </View>

      <View style={styles.stats}>
        <StatBox label="Puntos" value={state.score} tone="primary">
          <ScorePop gain={state.lastGain} />
        </StatBox>
        <StatBox label="Récord" value={Math.max(best, state.score)} />
        <StatBox label="Movimientos" value={state.moves} />
      </View>

      <View style={styles.progress}>
        <TileBadge value={state.maxValue} size={30} />
        <Text style={[typography.caption, styles.flex1]} numberOfLines={1}>
          Nivel actual: <Text style={styles.progressStrong}>{current.name}</Text>
        </Text>
        <Text style={typography.caption}>Meta: 🦄 {WIN_VALUE}</Text>
      </View>

      <View style={styles.playArea} {...swipeHandlers}>
        <Board
          width={boardWidth}
          tiles={state.tiles}
          ghosts={state.ghosts}
          mode={state.mode}
          selectedId={state.selectedId}
          onCellPress={pressCell}
        />
        <View style={[styles.hint, { backgroundColor: hintColors.background, width: boardWidth }]}>
          <Text style={[typography.bodyStrong, styles.hintText, { color: hintColors.text }]} numberOfLines={2}>
            {hint.text}
          </Text>
        </View>
      </View>

      <View style={styles.powers}>
        <PowerButton
          icon="🔀"
          label="Mover"
          tone="primary"
          charges={state.charges.swap}
          active={state.mode === 'swap'}
          onPress={() => togglePower('swap')}
        />
        <PowerButton
          icon="🗑️"
          label="Eliminar"
          tone="danger"
          charges={state.charges.delete}
          active={state.mode === 'delete'}
          onPress={() => togglePower('delete')}
        />
      </View>

      <Modal visible={showWin} transparent animationType="fade" onRequestClose={keepPlaying}>
        <View style={styles.backdrop}>
          <Card style={styles.modal}>
            <TileBadge value={WIN_VALUE} size={96} style={styles.selfCenter} />
            <Text style={[typography.title, styles.center]}>¡Lo lograste!</Text>
            <Text style={[typography.body, styles.center]}>
              Convertiste una idea en un 🦄 Unicornio con {state.score} puntos. ¿Quieres seguir creciendo?
            </Text>
            <AppButton label="Seguir jugando" icon="🚀" onPress={keepPlaying} />
            <AppButton label="Terminar partida" variant="secondary" onPress={() => finish(true)} />
          </Card>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  center: { textAlign: 'center' },
  selfCenter: { alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  title: { flexShrink: 1, color: colors.primaryDark },
  stats: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  progress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  progressStrong: { color: colors.text, fontWeight: '800' },
  playArea: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  hint: { minHeight: 48, borderRadius: radii.md, paddingHorizontal: spacing.md, justifyContent: 'center' },
  hintText: { textAlign: 'center', fontSize: 14, lineHeight: 19 },
  powers: { flexDirection: 'row', gap: spacing.md, paddingBottom: spacing.sm },
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  modal: { width: '100%', maxWidth: 360, gap: spacing.md },
});
