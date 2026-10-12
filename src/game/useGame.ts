import { useCallback, useEffect, useReducer } from 'react';

import { getLevel, WIN_VALUE } from './levels';
import {
  canSlide,
  Cell,
  comboBonus,
  Direction,
  hasDuplicateValues,
  MAX_CHARGES,
  maxTileValue,
  moveOrSwap,
  POWER_REWARD_FROM_VALUE,
  slide,
  spawnTile,
  Tile,
  tileAt,
} from './logic';

export type PowerMode = 'none' | 'swap' | 'delete';
export type Power = Exclude<PowerMode, 'none'>;

export type NoticeTone = 'info' | 'success' | 'warning';
export type Notice = { id: number; text: string; tone: NoticeTone };
export type Gain = { id: number; points: number; combo: number };

export type GameState = {
  tiles: Tile[];
  ghosts: Tile[];
  nextId: number;
  eventId: number;
  score: number;
  moves: number;
  maxValue: number;
  charges: Record<Power, number>;
  powersUsed: number;
  mode: PowerMode;
  selectedId: number | null;
  lastGain: Gain | null;
  notice: Notice | null;
  won: boolean;
  keepPlaying: boolean;
  stuck: boolean;
  over: boolean;
};

type Action =
  | { type: 'NEW_GAME' }
  | { type: 'SLIDE'; direction: Direction }
  | { type: 'TOGGLE_POWER'; power: Power }
  | { type: 'CELL_PRESS'; cell: Cell }
  | { type: 'CLEAR_GHOSTS' }
  | { type: 'KEEP_PLAYING' };

export const INITIAL_CHARGES: Record<Power, number> = { swap: 2, delete: 2 };

export const POWER_LABELS: Record<Power, string> = { swap: 'Mover', delete: 'Eliminar' };

export function createGame(): GameState {
  let tiles: Tile[] = [];
  tiles = spawnTile(tiles, 1);
  tiles = spawnTile(tiles, 2);
  return {
    tiles,
    ghosts: [],
    nextId: 3,
    eventId: 0,
    score: 0,
    moves: 0,
    maxValue: maxTileValue(tiles),
    charges: { ...INITIAL_CHARGES },
    powersUsed: 0,
    mode: 'none',
    selectedId: null,
    lastGain: null,
    notice: null,
    won: false,
    keepPlaying: false,
    stuck: false,
    over: false,
  };
}

function withNotice(state: GameState, text: string, tone: NoticeTone = 'info'): GameState {
  const eventId = state.eventId + 1;
  return { ...state, eventId, notice: { id: eventId, text, tone } };
}

/** Recalcula si el tablero está bloqueado y si la partida terminó. */
function evaluateBoard(state: GameState): GameState {
  const stuck = !canSlide(state.tiles);
  const swapHelps = state.charges.swap > 0 && hasDuplicateValues(state.tiles);
  const over = stuck && state.charges.delete === 0 && !swapHelps;
  const next = { ...state, stuck, over };
  if (stuck && !over) return withNotice(next, '¡Sin movimientos! Usa un poder para seguir.', 'warning');
  return next;
}

export function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'NEW_GAME':
      return createGame();

    case 'CLEAR_GHOSTS':
      return state.ghosts.length ? { ...state, ghosts: [] } : state;

    case 'KEEP_PLAYING':
      return { ...state, keepPlaying: true };

    case 'SLIDE': {
      if (state.over || state.mode !== 'none') return state;
      const result = slide(state.tiles, action.direction);
      if (!result.moved) return state;

      const bonus = comboBonus(result.merges);
      const points = result.gained + bonus;
      const tiles = spawnTile(result.tiles, state.nextId);
      const newMax = maxTileValue(tiles);

      let next: GameState = {
        ...state,
        tiles,
        ghosts: result.ghosts,
        nextId: state.nextId + 1,
        score: state.score + points,
        moves: state.moves + 1,
        maxValue: Math.max(state.maxValue, newMax),
        notice: null,
      };

      if (points > 0) {
        next.eventId += 1;
        next.lastGain = { id: next.eventId, points, combo: result.merges };
      }

      // Recompensa: cada nuevo nivel máximo (desde 🚀 64) recarga los poderes.
      if (newMax > state.maxValue && newMax >= POWER_REWARD_FROM_VALUE) {
        const level = getLevel(newMax);
        next.charges = {
          swap: Math.min(MAX_CHARGES, state.charges.swap + 1),
          delete: Math.min(MAX_CHARGES, state.charges.delete + 1),
        };
        next = withNotice(next, `¡Nuevo nivel ${level.emoji} ${level.name}! +1 a cada poder`, 'success');
      } else if (result.merges > 1) {
        next = withNotice(next, `¡Combo x${result.merges}! +${bonus} puntos extra`, 'success');
      }

      if (newMax >= WIN_VALUE && !state.won) next.won = true;

      return evaluateBoard(next);
    }

    case 'TOGGLE_POWER': {
      if (state.over) return state;
      if (state.mode === action.power) {
        return { ...state, mode: 'none', selectedId: null, notice: null };
      }
      if (state.charges[action.power] === 0) {
        return withNotice(
          state,
          `Sin cargas de "${POWER_LABELS[action.power]}". Gana más al crear una ficha de nivel superior.`,
          'warning',
        );
      }
      return { ...state, mode: action.power, selectedId: null, notice: null };
    }

    case 'CELL_PRESS': {
      const tile = tileAt(state.tiles, action.cell.row, action.cell.col);

      if (state.mode === 'delete') {
        if (!tile) return withNotice(state, 'Toca una ficha para eliminarla.');
        if (state.tiles.length <= 1) return withNotice(state, 'No puedes eliminar la última ficha.', 'warning');
        return evaluateBoard({
          ...state,
          tiles: state.tiles.filter((t) => t.id !== tile.id),
          ghosts: [{ ...tile, vanishing: true, isNew: false }],
          charges: { ...state.charges, delete: state.charges.delete - 1 },
          powersUsed: state.powersUsed + 1,
          mode: 'none',
          selectedId: null,
          notice: null,
        });
      }

      if (state.mode === 'swap') {
        if (state.selectedId === null) {
          if (!tile) return withNotice(state, 'Primero elige la ficha que quieres mover.');
          return { ...state, selectedId: tile.id, notice: null };
        }
        if (tile && tile.id === state.selectedId) {
          return { ...state, selectedId: null };
        }
        return evaluateBoard({
          ...state,
          tiles: moveOrSwap(state.tiles, state.selectedId, action.cell),
          ghosts: [],
          charges: { ...state.charges, swap: state.charges.swap - 1 },
          powersUsed: state.powersUsed + 1,
          mode: 'none',
          selectedId: null,
          notice: null,
        });
      }

      return state;
    }
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, undefined, createGame);

  // Las fichas absorbidas o eliminadas solo se muestran mientras dura su animación.
  useEffect(() => {
    if (state.ghosts.length === 0) return;
    const timer = setTimeout(() => dispatch({ type: 'CLEAR_GHOSTS' }), 220);
    return () => clearTimeout(timer);
  }, [state.ghosts]);

  return {
    state,
    newGame: useCallback(() => dispatch({ type: 'NEW_GAME' }), []),
    move: useCallback((direction: Direction) => dispatch({ type: 'SLIDE', direction }), []),
    togglePower: useCallback((power: Power) => dispatch({ type: 'TOGGLE_POWER', power }), []),
    pressCell: useCallback((cell: Cell) => dispatch({ type: 'CELL_PRESS', cell }), []),
    keepPlaying: useCallback(() => dispatch({ type: 'KEEP_PLAYING' }), []),
  };
}
