# Fusión 2048 — De una idea a un unicornio 🦄

Juego tipo **2048** hecho con **React Native + Expo (SDK 57)** y **Expo Router**. Cada ficha representa una etapa
en el crecimiento de un proyecto: 💡 Idea → 📝 Plan → 📊 Datos → 🤝 Alianza → 💼 Proyecto → 🚀 Lanzamiento →
📈 Crecimiento → 🏆 Premio → 💎 Valor → 👑 Liderazgo → 🦄 Unicornio (2048).

## Ejecutar en un dispositivo físico (Expo Go)

```bash
npm install
npx expo start
```

Escanea el código QR con la app **Expo Go** (Android) o con la cámara (iOS). El teléfono y la computadora deben
estar en la misma red; si no es posible, usa `npx expo start --tunnel`.

## Reglas y puntuación

- Desliza en cualquier dirección: las fichas iguales que chocan se fusionan en el siguiente nivel.
- **Puntos**: cada fusión suma el valor de la ficha creada. Varias fusiones en un solo movimiento dan un
  **combo** de +20 puntos por cada fusión extra.
- Meta: llegar al 🦄 2048 (después puedes seguir jugando).
- La partida termina cuando no hay movimientos posibles ni poderes útiles.

## Poderes especiales

| Poder | Cómo se usa |
| --- | --- |
| 🔀 **Mover** | Toca la ficha y luego el destino. Si la casilla está vacía la ficha se mueve; si está ocupada, ambas intercambian lugar. |
| 🗑️ **Eliminar** | Toca la ficha que quieres quitar del tablero. |

Se empieza con 2 cargas de cada poder y se gana +1 de cada uno al alcanzar un nuevo nivel máximo a partir de
🚀 64 (máximo 5). Usar un poder no cuenta como turno, así que no aparece una ficha nueva.

## Estructura

```
src/
  app/            Pantallas (Expo Router): index (presentación), game, game-over, credits
  components/     Componentes reutilizables: Screen, AppButton, Card, StatBox, Board, TileView, PowerButton
  game/           Lógica pura (logic.ts), niveles/emojis (levels.ts), estado (useGame.ts), controles y vibración
  storage/        Récord persistente con AsyncStorage
  theme/          Colores, tipografía, espaciados y sombras compartidos
  constants/      Textos de la app y créditos (edita aquí tu nombre)
```

## Scripts útiles

```bash
npx tsc --noEmit   # verificación de tipos
npx expo lint      # lint
npx expo-doctor    # diagnóstico de dependencias
```
# P3_2048
