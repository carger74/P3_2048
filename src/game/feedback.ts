import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/** Vibraciones cortas para reforzar las acciones del jugador (sin efecto en web). */
const enabled = Platform.OS === 'ios' || Platform.OS === 'android';

function run(effect: () => Promise<void>) {
  if (!enabled) return;
  effect().catch(() => {
    // El dispositivo puede no soportar vibración; no afecta al juego.
  });
}

export const feedback = {
  merge: (combo: number) =>
    run(() =>
      Haptics.impactAsync(combo > 1 ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light),
    ),
  power: () => run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)),
  success: () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  warning: () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
};
