// Named challenge seeds. Typing one of these as the seed turns the run into a
// modified "challenge run". Modifiers are read by the generator / combat loop
// via getRunModifiers().

export const CHALLENGES = {
  COMEBACK: {
    id: 'comeback',
    name: 'COMEBACK',
    glyph: '💀',
    title: 'Comeback',
    description: 'Les ennemis vaincus finissent par revenir à la vie. Ne traîne pas.',
    modifiers: { respawn: 0.18 }
  },
  NIGHTMARE: {
    id: 'nightmare',
    name: 'NIGHTMARE',
    glyph: '😱',
    title: 'Cauchemar',
    description: 'Chaque monstre est une élite. Bonne chance.',
    modifiers: { allElite: true }
  },
  ELDORADO: {
    id: 'eldorado',
    name: 'ELDORADO',
    glyph: '🪙',
    title: 'Eldorado',
    description: 'L\'or coule à flots (×2), mais les ennemis frappent plus fort.',
    modifiers: { goldMultiplier: 2, monsterAtqBonus: 1 }
  }
}

// Resolve a seed string to a challenge definition, if it names one.
export const matchChallenge = (seed) => {
  const key = String(seed || '').trim().toUpperCase()
  return CHALLENGES[key] || null
}

// Active modifiers for the in-progress run (set at run start, read during
// generation and combat).
let active = {}
export const setRunModifiers = (modifiers) => { active = modifiers || {} }
export const getRunModifiers = () => active
