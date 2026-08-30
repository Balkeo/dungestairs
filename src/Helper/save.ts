import Characters from '../Dungeon/Character/Characters'
import { calculate } from './CharacterCalculator'

// Versioned save/load. Only the player's *progression* is persisted (gold,
// depth records, and per-character price-paid + upgraded skills). Everything
// content-driven (stats, spells, passives, glyphs) is rebuilt from the live
// config on load, so adding new content never invalidates a save.
//
// Bump SAVE_VERSION whenever the persisted shape changes, and add a migration
// step below so existing saves upgrade instead of breaking.
export const SAVE_VERSION = 3
const KEY = '_dungestairs'

export const DEFAULT_STATS = { runs: 0, bestDepth: 0, kills: 0, bossKills: 0, goldEarned: 0 }

// Persist only progression levels (not the full skill/spell objects), so the
// content can change shape without invalidating saves.
const snapshot = (player) => ({
  version: SAVE_VERSION,
  gold: player.gold || 0,
  depth: player.depth || { max: 0, previous: 0 },
  stats: player.stats || { ...DEFAULT_STATS },
  achievements: player.achievements || [],
  characters: (player.characters || []).map((character) => ({
    price: character.price,
    skillLevels: (character.skills || []).map((skill) => skill.level || 1),
    spellLevels: (character.spells || []).reduce((acc, spell) => {
      acc[spell.id] = spell.level || 1
      return acc
    }, {})
  }))
})

export const saveGame = (player) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(snapshot(player)))
  } catch (err) {
    /* localStorage unavailable (private mode, quota) - progress is lost but the
       game keeps running */
  }
}

// Bring any stored blob up to the current snapshot shape, or return null to
// start fresh when it cannot be understood.
const migrate = (raw) => {
  if (!raw || typeof raw !== 'object') {
    return null
  }
  if (raw.version === SAVE_VERSION) {
    return raw
  }
  // A save from a newer build than this code: don't guess, start fresh.
  if (raw.version > SAVE_VERSION) {
    return null
  }
  // Normalise any older (or pre-versioning) save into the base fields, then let
  // the field defaults below fill in whatever that version didn't carry.
  const base = raw.version === undefined
    ? {
        gold: raw.gold || 0,
        depth: raw.depth || { max: 0, previous: 0 },
        characters: (raw.characters || []).map((character) => ({
          price: character && character.price,
          skills: character && character.skills
        }))
      }
    : raw
  return {
    ...base,
    version: SAVE_VERSION,
    stats: { ...DEFAULT_STATS, ...(base.stats || {}) },
    achievements: base.achievements || []
  }
}

export const loadGame = () => {
  let raw = null
  try {
    raw = JSON.parse(localStorage.getItem(KEY))
  } catch (err) {
    return null
  }
  const saved = migrate(raw)
  if (!saved) {
    return null
  }
  const savedCharacters = saved.characters || []
  const characters = Characters.map((base, index) => {
    const character = savedCharacters[index] || {}
    const skillLevels = character.skillLevels || []
    const spellLevels = character.spellLevels || {}
    const rebuilt = {
      ...base,
      price: character.price !== undefined ? character.price : base.price,
      skills: (base.skills || []).map((skill, i) => ({ ...skill, level: skillLevels[i] || skill.level || 1 })),
      spells: (base.spells || []).map((spell) => ({ ...spell, level: spellLevels[spell.id] || spell.level || 1 }))
    }
    // Recompute so the menu reflects saved stat upgrades (spell levels are just
    // carried through by calculate).
    return calculate(rebuilt)
  })
  return {
    gold: saved.gold || 0,
    depth: saved.depth || { max: 0, previous: 0 },
    stats: { ...DEFAULT_STATS, ...(saved.stats || {}) },
    achievements: saved.achievements || [],
    characters,
    selectedCharacter: null,
    inGame: false,
    runId: 0
  }
}

export const clearSave = () => {
  try {
    localStorage.removeItem(KEY)
  } catch (err) {
    /* ignore */
  }
}
