// Emoji glyphs used to represent tile content in the dungeon. Data only, so
// changing a monster's or tile's look is a one-line edit (monsters carry their
// own `glyph` field in Monsters.js / class configs).
export const CELL_GLYPHS = {
  Key: '🗝️',
  Entrance: '🚪',
  trap: '⚠️',
  chest: '💰',
  healer: '💚',
  mage: '🔮',
  knight: '🛡️',
  merchant: '🧪',
  event: '❓',
  void: '🕳️'
}

// An opened (empty) chest shows nothing rather than a leftover glyph.
export const CHEST_EMPTY_GLYPH = null
