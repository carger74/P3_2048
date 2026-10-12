/**
 * Cada valor de ficha representa una etapa en el crecimiento de un proyecto:
 * de una simple idea hasta convertirse en un "unicornio" (empresa de gran éxito).
 * El emoji indica el tipo de ficha y el color su nivel de "poder".
 */
export type Level = {
  value: number;
  emoji: string;
  name: string;
  background: string;
  foreground: string;
};

export const LEVELS: Level[] = [
  { value: 2, emoji: '💡', name: 'Idea', background: '#FFF4CC', foreground: '#7A5B00' },
  { value: 4, emoji: '📝', name: 'Plan', background: '#FFE3B3', foreground: '#7A4A00' },
  { value: 8, emoji: '📊', name: 'Datos', background: '#FFCFA8', foreground: '#7A3300' },
  { value: 16, emoji: '🤝', name: 'Alianza', background: '#FFB4A2', foreground: '#7A1F0E' },
  { value: 32, emoji: '💼', name: 'Proyecto', background: '#F7A1C4', foreground: '#6E0F3A' },
  { value: 64, emoji: '🚀', name: 'Lanzamiento', background: '#C9B6F2', foreground: '#3A1F7A' },
  { value: 128, emoji: '📈', name: 'Crecimiento', background: '#A9C8F5', foreground: '#0F3A7A' },
  { value: 256, emoji: '🏆', name: 'Premio', background: '#8FDCCB', foreground: '#0B5444' },
  { value: 512, emoji: '💎', name: 'Valor', background: '#7FD1E8', foreground: '#08485A' },
  { value: 1024, emoji: '👑', name: 'Liderazgo', background: '#F5C84C', foreground: '#5A4100' },
  { value: 2048, emoji: '🦄', name: 'Unicornio', background: '#9B6BFF', foreground: '#FFFFFF' },
  { value: 4096, emoji: '🌍', name: 'Global', background: '#2F4CDD', foreground: '#FFFFFF' },
  { value: 8192, emoji: '🌟', name: 'Leyenda', background: '#14213D', foreground: '#FFD86B' },
];

export const WIN_VALUE = 2048;

export function getLevel(value: number): Level {
  const exact = LEVELS.find((level) => level.value === value);
  if (exact) return exact;
  // Valores superiores a la tabla reutilizan el último nivel.
  return { ...LEVELS[LEVELS.length - 1], value };
}
