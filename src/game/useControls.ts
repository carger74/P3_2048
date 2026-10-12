import { useEffect, useMemo } from 'react';
import { PanResponder, Platform } from 'react-native';

import { Direction } from './logic';

const MIN_SWIPE_DISTANCE = 24;

const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right',
};

/**
 * Detecta deslizamientos (táctil) y flechas del teclado (web) para mover las fichas.
 * Devuelve los panHandlers que deben aplicarse al área de juego.
 */
export function useSwipeControls(onSwipe: (direction: Direction) => void, enabled: boolean) {
  useEffect(() => {
    if (!enabled || Platform.OS !== 'web' || typeof window === 'undefined') return;
    const onKeyDown = (event: KeyboardEvent) => {
      const direction = KEY_TO_DIRECTION[event.key];
      if (!direction) return;
      event.preventDefault();
      onSwipe(direction);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onSwipe, enabled]);

  return useMemo(() => {
    if (!enabled) return {};
    return PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 8 || Math.abs(g.dy) > 8,
      onPanResponderTerminationRequest: () => false,
      onPanResponderRelease: (_, g) => {
        const absX = Math.abs(g.dx);
        const absY = Math.abs(g.dy);
        if (Math.max(absX, absY) < MIN_SWIPE_DISTANCE) return;
        const direction: Direction = absX > absY ? (g.dx > 0 ? 'right' : 'left') : g.dy > 0 ? 'down' : 'up';
        onSwipe(direction);
      },
    }).panHandlers;
  }, [onSwipe, enabled]);
}
