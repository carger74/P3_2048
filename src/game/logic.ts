/**
 * Lógica pura del juego 2048 (sin React), para poder razonarla y probarla de forma aislada.
 */
export const BOARD_SIZE = 4;

export type Direction = 'up' | 'down' | 'left' | 'right';

export type Tile = {
  id: number;
  value: number;
  row: number;
  col: number;
  /** La ficha acaba de aparecer: se anima con un "pop". */
  isNew?: boolean;
  /** La ficha está desapareciendo (eliminada con el poder). */
  vanishing?: boolean;
};

export type Cell = { row: number; col: number };

export type SlideResult = {
  tiles: Tile[];
  /** Fichas absorbidas en una fusión: se dibujan un instante deslizándose hacia su destino. */
  ghosts: Tile[];
  moved: boolean;
  merges: number;
  /** Puntos base: suma de los valores creados por fusión. */
  gained: number;
};

/** Puntos extra cuando un solo deslizamiento produce varias fusiones. */
export const COMBO_BONUS_PER_EXTRA_MERGE = 20;

/** Máximo de cargas acumulables por poder. */
export const MAX_CHARGES = 5;

/** A partir de este valor, cada nuevo récord de ficha otorga cargas de poder. */
export const POWER_REWARD_FROM_VALUE = 64;

export function tileAt(tiles: Tile[], row: number, col: number): Tile | undefined {
  return tiles.find((tile) => tile.row === row && tile.col === col);
}

export function emptyCells(tiles: Tile[]): Cell[] {
  const cells: Cell[] = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (!tileAt(tiles, row, col)) cells.push({ row, col });
    }
  }
  return cells;
}

/** Agrega una ficha (90% 2, 10% 4) en una casilla vacía al azar. */
export function spawnTile(tiles: Tile[], id: number, random: () => number = Math.random): Tile[] {
  const free = emptyCells(tiles);
  if (free.length === 0) return tiles;
  const cell = free[Math.floor(random() * free.length)];
  const value = random() < 0.9 ? 2 : 4;
  return [...tiles, { id, value, row: cell.row, col: cell.col, isNew: true }];
}

/**
 * Devuelve las casillas de cada línea en el orden en que se "empujan" las fichas.
 * Por ejemplo, para "left" cada fila se recorre de la columna 0 a la 3.
 */
function linesFor(direction: Direction): Cell[][] {
  const lines: Cell[][] = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    const line: Cell[] = [];
    for (let j = 0; j < BOARD_SIZE; j++) {
      const k = direction === 'right' || direction === 'down' ? BOARD_SIZE - 1 - j : j;
      line.push(direction === 'left' || direction === 'right' ? { row: i, col: k } : { row: k, col: i });
    }
    lines.push(line);
  }
  return lines;
}

export function slide(tiles: Tile[], direction: Direction): SlideResult {
  const nextTiles: Tile[] = [];
  const ghosts: Tile[] = [];
  let merges = 0;
  let gained = 0;
  let moved = false;

  for (const line of linesFor(direction)) {
    const lineTiles = line
      .map((cell) => tileAt(tiles, cell.row, cell.col))
      .filter((tile): tile is Tile => tile !== undefined);

    let target = 0;
    let i = 0;
    while (i < lineTiles.length) {
      const current = lineTiles[i];
      const next = lineTiles[i + 1];
      const dest = line[target];

      if (next && next.value === current.value) {
        const value = current.value * 2;
        nextTiles.push({ id: current.id, value, row: dest.row, col: dest.col });
        ghosts.push({ ...next, row: dest.row, col: dest.col, isNew: false });
        merges++;
        gained += value;
        moved = true;
        i += 2;
      } else {
        if (current.row !== dest.row || current.col !== dest.col) moved = true;
        nextTiles.push({ ...current, row: dest.row, col: dest.col, isNew: false });
        i += 1;
      }
      target++;
    }
  }

  return { tiles: nextTiles, ghosts, moved, merges, gained };
}

export function comboBonus(merges: number): number {
  return merges > 1 ? (merges - 1) * COMBO_BONUS_PER_EXTRA_MERGE : 0;
}

/** ¿Existe algún deslizamiento que cambie el tablero? */
export function canSlide(tiles: Tile[]): boolean {
  if (tiles.length === 0) return false;
  if (tiles.length < BOARD_SIZE * BOARD_SIZE) return true;
  for (const tile of tiles) {
    const right = tileAt(tiles, tile.row, tile.col + 1);
    const down = tileAt(tiles, tile.row + 1, tile.col);
    if ((right && right.value === tile.value) || (down && down.value === tile.value)) return true;
  }
  return false;
}

/** Intercambiar fichas solo sirve para desbloquear si hay al menos dos fichas iguales. */
export function hasDuplicateValues(tiles: Tile[]): boolean {
  const seen = new Set<number>();
  for (const tile of tiles) {
    if (seen.has(tile.value)) return true;
    seen.add(tile.value);
  }
  return false;
}

export function maxTileValue(tiles: Tile[]): number {
  return tiles.reduce((max, tile) => Math.max(max, tile.value), 0);
}

/** Mueve una ficha a otra casilla; si está ocupada, ambas fichas intercambian lugar. */
export function moveOrSwap(tiles: Tile[], tileId: number, target: Cell): Tile[] {
  const source = tiles.find((tile) => tile.id === tileId);
  if (!source) return tiles;
  const occupant = tileAt(tiles, target.row, target.col);
  return tiles.map((tile) => {
    if (tile.id === source.id) return { ...tile, row: target.row, col: target.col, isNew: false };
    if (occupant && tile.id === occupant.id) return { ...tile, row: source.row, col: source.col, isNew: false };
    return tile;
  });
}
