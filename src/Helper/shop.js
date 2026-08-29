import { Items } from '../Content'
import { rng } from './rng'

// Fallback price if an item has no explicit `price` (keyed by rarity).
const RARITY_PRICE = {
  common: 25,
  uncommon: 60,
  rare: 130,
  epic: 220
}

export const itemPrice = (item = {}) => {
  return item.price || RARITY_PRICE[item.rarity] || 40
}

// Build a merchant's stock: up to `count` distinct, depth-appropriate items,
// drawn with the same rarity weighting as loot so cheap gear shows up more
// often. Each entry is a fresh item copy plus a `price` and a `sold` flag.
export const rollShopStock = (depth = 1, count = 3) => {
  const pool = Items.filter((item) => (item.minDepth || 1) <= depth)
  const stock = []
  const available = [...pool]
  while (stock.length < count && available.length > 0) {
    const total = available.reduce((sum, item) => sum + (item.weight || 1), 0)
    let roll = rng() * total
    let pickIndex = available.length - 1
    for (let i = 0; i < available.length; i++) {
      roll -= available[i].weight || 1
      if (roll <= 0) {
        pickIndex = i
        break
      }
    }
    const [picked] = available.splice(pickIndex, 1)
    stock.push({ ...picked, price: itemPrice(picked), sold: false })
  }
  return stock
}
