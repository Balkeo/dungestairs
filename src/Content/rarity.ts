import Colors from '../Helper/Colors'

// Colour coding for item rarity, reused by the inventory and by the floating
// pickup text.
const RARITY_COLOR = {
  common: Colors.white75,
  uncommon: Colors.green,
  rare: Colors.blue,
  epic: Colors.pink
}

export const rarityColor = (rarity) => RARITY_COLOR[rarity] || Colors.white75
