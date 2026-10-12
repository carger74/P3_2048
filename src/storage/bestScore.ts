import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

const BEST_SCORE_KEY = 'fusion2048:bestScore';

export async function getBestScore(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(BEST_SCORE_KEY);
    const value = raw ? Number(raw) : 0;
    return Number.isFinite(value) ? value : 0;
  } catch {
    return 0;
  }
}

/** Guarda la puntuación si supera el récord. Devuelve el récord anterior. */
export async function submitScore(score: number): Promise<number> {
  const previous = await getBestScore();
  if (score > previous) {
    try {
      await AsyncStorage.setItem(BEST_SCORE_KEY, String(score));
    } catch {
      // Si el almacenamiento falla, el juego sigue funcionando sin récord persistente.
    }
  }
  return previous;
}

/** Récord actual; se vuelve a leer cada vez que la pantalla recibe el foco. */
export function useBestScore(): number {
  const [best, setBest] = useState(0);
  useFocusEffect(
    useCallback(() => {
      let active = true;
      getBestScore().then((value) => {
        if (active) setBest(value);
      });
      return () => {
        active = false;
      };
    }, []),
  );
  return best;
}
