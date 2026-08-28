import { Items } from '../Content'

// Roll for an item drop appropriate to the current depth. Returns a fresh item
// object (with its id) or null when nothing drops. Items are weighted and gated
// by a minimum depth so better gear appears deeper.
export const rollItemDrop = (depth = 1, chance = 0.45) => {
  if (Math.random() > chance) {
    return null
  }
  const pool = Items.filter((item) => (item.minDepth || 1) <= depth)
  if (pool.length === 0) {
    return null
  }
  const total = pool.reduce((sum, item) => sum + (item.weight || 1), 0)
  let roll = Math.random() * total
  for (const item of pool) {
    roll -= item.weight || 1
    if (roll <= 0) {
      return { ...item }
    }
  }
  return { ...pool[pool.length - 1] }
}

// A "blessing" granted by an ally tile, modelled as an inventory item so it
// flows through the same stat pipeline.
export const blessing = (id, name, glyph, target, effect, description) => {
  return { id, name, glyph, target, effect, description, rarity: 'uncommon', blessing: true }
}
