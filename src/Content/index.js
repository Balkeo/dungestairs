// Content loader: assembles playable classes from JSON config files.
//
// Adding new content is data-only:
//   * a new class  -> drop a `*.json` file in `./classes` (auto-discovered)
//   * a new spell  -> add an entry to `spells.json`
//   * a new passive-> add an entry to `passives.json`
//
// Classes reference spells and passives by id; this loader resolves those
// ids to their full definitions so the rest of the app never deals with
// raw ids. Combat effects inside spells/passives are jexl expressions
// evaluated at runtime (see resolveFight.js and CharacterCalculator.js).
import { EMPTY_CHARACTER } from '../Dungeon/Content/constant'
import { resolveIcon } from './assets'
import spells from './spells.json'
import passives from './passives.json'
import items from './items.json'
import relics from './relics.json'

// Auto-discover every class definition in ./classes (Vite import.meta.glob).
const classModules = import.meta.glob('./classes/*.json', { eager: true })
const rawClasses = Object.keys(classModules).map((key) => {
  const mod = classModules[key]
  return mod && mod.default ? mod.default : mod
})

const resolveList = (ids = [], catalog = {}) => {
  return ids
    .map((id) => {
      const def = catalog[id]
      if (!def) {
        console.warn(`Unknown content id "${id}" referenced by a class config`)
        return null
      }
      return { id, ...def }
    })
    .filter(Boolean)
}

const buildCharacter = (config) => {
  return {
    ...EMPTY_CHARACTER,
    id: config.id,
    type: config.type,
    icon: resolveIcon(config.icon),
    glyph: config.glyph || null,
    hp: config.hp,
    maxHp: config.hp,
    stats: { ...config.stats },
    level: config.level || 1,
    items: config.items ? [...config.items] : [],
    skills: config.skills ? config.skills.map((s) => ({ ...s })) : [],
    spells: resolveList(config.spells, spells).map((spell) => ({ level: 1, ...spell })),
    passives: resolveList(config.passives, passives),
    price: config.price || 0
  }
}

// Classes are ordered by price then type so newly dropped-in JSON files slot
// into a deterministic position without any code change.
const Classes = rawClasses
  .map(buildCharacter)
  .sort((a, b) => a.price - b.price || a.type.localeCompare(b.type))

export const Spells = spells
export const Passives = passives
export const Items = Object.keys(items).map((id) => ({ id, ...items[id] }))
export const Relics = Object.keys(relics).map((id) => ({ id, ...relics[id] }))
export default Classes
