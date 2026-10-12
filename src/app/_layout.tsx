import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { colors } from '@/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        {/* Sin gesto de "volver" en el juego para no confundirlo con los deslizamientos. */}
        <Stack.Screen name="game" options={{ gestureEnabled: false, animation: 'fade' }} />
        <Stack.Screen name="game-over" options={{ gestureEnabled: false, animation: 'fade_from_bottom' }} />
        <Stack.Screen name="credits" />
      </Stack>
    </>
  );
}
