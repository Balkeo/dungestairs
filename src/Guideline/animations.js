import { keyframes } from 'styled-components'

// Shared keyframes for the game's visual juice layer. Kept in one place so the
// motion vocabulary stays consistent across cells, glyphs and overlays.

// Gentle idle "breathing" for living things (monsters).
export const breathe = keyframes`
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-4px) scale(1.05); }
`

// Quick shake + recoil when something gets hit.
export const shakeHit = keyframes`
  0% { transform: translate(0, 0); }
  20% { transform: translate(-5px, 1px) rotate(-4deg); }
  40% { transform: translate(5px, -1px) rotate(4deg); }
  60% { transform: translate(-3px, 1px) rotate(-2deg); }
  80% { transform: translate(3px, 0) rotate(2deg); }
  100% { transform: translate(0, 0); }
`

// Red flash overlay pulse used on hit.
export const flashRed = keyframes`
  0% { opacity: 0; }
  30% { opacity: 0.55; }
  100% { opacity: 0; }
`

// Death: puff up and fade out.
export const poof = keyframes`
  0% { transform: scale(1); opacity: 1; filter: none; }
  60% { transform: scale(1.4) rotate(8deg); opacity: 0.6; filter: grayscale(1); }
  100% { transform: scale(0.2) rotate(-10deg); opacity: 0; filter: grayscale(1); }
`

// Cell content appearing when a tile is revealed.
export const revealIn = keyframes`
  0% { transform: scale(0.6); opacity: 0; }
  60% { transform: scale(1.12); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
`

// Floating combat text rising and fading.
export const floatUp = keyframes`
  0% { transform: translate(-50%, 0) scale(0.8); opacity: 0; }
  15% { transform: translate(-50%, -6px) scale(1.1); opacity: 1; }
  70% { opacity: 1; }
  100% { transform: translate(-50%, -46px) scale(1); opacity: 0; }
`

// Pulsing golden glow for the key / important tiles.
export const glowPulse = keyframes`
  0%, 100% { transform: translateY(0) scale(1); filter: drop-shadow(0 0 4px rgba(255, 208, 80, 0.8)); }
  50% { transform: translateY(-3px) scale(1.1); filter: drop-shadow(0 0 14px rgba(255, 208, 80, 1)); }
`

// Pulsing outline on enemies you can target with an armed spell.
export const targetPulse = keyframes`
  0%, 100% { opacity: 0.35; transform: scale(0.94); }
  50% { opacity: 0.9; transform: scale(1.02); }
`

// Full-screen depth banner entrance.
export const bannerPop = keyframes`
  0% { transform: scale(0.6); opacity: 0; }
  25% { transform: scale(1.05); opacity: 1; }
  75% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.4); opacity: 0; }
`
