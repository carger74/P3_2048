import { Pressable, StyleSheet, View } from 'react-native';

import { BOARD_SIZE, Cell, Tile, tileAt } from '@/game/logic';
import { PowerMode } from '@/game/useGame';
import { colors, radii } from '@/theme';

import { TileView } from './TileView';

type Props = {
  width: number;
  tiles: Tile[];
  ghosts: Tile[];
  mode: PowerMode;
  selectedId: number | null;
  onCellPress: (cell: Cell) => void;
};

const CELLS: Cell[] = Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, i) => ({
  row: Math.floor(i / BOARD_SIZE),
  col: i % BOARD_SIZE,
}));

export function boardMetrics(width: number) {
  const gap = Math.round(width * 0.028);
  const tileSize = (width - gap * (BOARD_SIZE + 1)) / BOARD_SIZE;
  return { gap, tileSize };
}

/** Tablero 4x4: casillas de fondo, fichas animadas y, en modo poder, casillas seleccionables. */
export function Board({ width, tiles, ghosts, mode, selectedId, onCellPress }: Props) {
  const { gap, tileSize } = boardMetrics(width);
  const cellStyle = (cell: Cell) => ({
    left: gap + cell.col * (tileSize + gap),
    top: gap + cell.row * (tileSize + gap),
    width: tileSize,
    height: tileSize,
    borderRadius: tileSize * 0.16,
  });

  return (
    <View style={[styles.board, { width, height: width, borderRadius: radii.lg }]}>
      {CELLS.map((cell) => (
        <View key={`cell-${cell.row}-${cell.col}`} style={[styles.cell, cellStyle(cell)]} />
      ))}

      {/* Los "fantasmas" se dibujan primero para quedar debajo de las fichas vivas. */}
      {[...ghosts, ...tiles].map((tile) => (
        <TileView key={tile.id} tile={tile} size={tileSize} gap={gap} selected={tile.id === selectedId} />
      ))}

      {mode !== 'none'
        ? CELLS.map((cell) => {
            const tile = tileAt(tiles, cell.row, cell.col);
            const isSelected = tile !== undefined && tile.id === selectedId;
            const isTarget =
              mode === 'delete'
                ? tile !== undefined
                : selectedId === null
                  ? tile !== undefined
                  : !isSelected;
            const targetColor = mode === 'delete' ? colors.danger : colors.primary;
            return (
              <Pressable
                key={`target-${cell.row}-${cell.col}`}
                accessibilityRole="button"
                accessibilityLabel={
                  tile ? `Ficha ${tile.value}, fila ${cell.row + 1}, columna ${cell.col + 1}` : 'Casilla vacía'
                }
                onPress={() => onCellPress(cell)}
                style={({ pressed }) => [
                  styles.target,
                  cellStyle(cell),
                  isTarget && { borderColor: targetColor, borderStyle: 'dashed' },
                  pressed && { backgroundColor: mode === 'delete' ? colors.dangerSoft : colors.primarySoft, opacity: 0.6 },
                ]}
              />
            );
          })
        : null}
    </View>
  );
}

const styles = StyleSheet.create({
  board: { backgroundColor: colors.board, position: 'relative', overflow: 'hidden' },
  cell: { position: 'absolute', backgroundColor: colors.cell },
  target: { position: 'absolute', borderWidth: 3, borderColor: 'transparent' },
});
