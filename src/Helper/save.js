import Characters from '../Dungeon/Character/Characters'

// Versioned save/load. Only the player's *progression* is persisted (gold,
// depth records, and per-character price-paid + upgraded skills). Everything
// content-driven (stats, spells, passives, glyphs) is rebuilt from the live
// config on load, so adding new content never invalidates a save.
//
// Bump SAVE_VERSION whenever the persisted shape changes, and add a migration
// step below so existing saves upgrade instead of breaking.
export const SAVE_VERSION = 1
const KEY = '_dungestairs'

const snapshot = (player) => ({
  version: SAVE_VERSION,
  gold: player.gold || 0,
  depth: player.depth || { max: 0, previous: 0 },
  characters: (player.characters || []).map((character) => ({
    price: character.price,
    skills: character.skills
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
  // Legacy pre-versioning save: the whole player object was stored.
  if (raw.version === undefined) {
    return {
      version: SAVE_VERSION,
      gold: raw.gold || 0,
      depth: raw.depth || { max: 0, previous: 0 },
      characters: (raw.characters || []).map((character) => ({
        price: character && character.price,
        skills: character && character.skills
      }))
    }
  }
  // A save from a newer build than this code: don't guess, start fresh.
  if (raw.version > SAVE_VERSION) {
    return null
  }
  // Older numbered versions would be upgraded step by step here as the schema
  // evolves; for now v1 is the baseline.
  return { ...raw, version: SAVE_VERSION }
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
    return {
      ...base,
      price: character.price !== undefined ? character.price : base.price,
      skills: character.skills || base.skills
    }
  })
  return {
    gold: saved.gold || 0,
    depth: saved.depth || { max: 0, previous: 0 },
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
