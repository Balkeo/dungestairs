import Colors from '../Helper/Colors'
import { rarityColor } from '../Content/rarity'

// Turn combat engine events into floating-text descriptors ({ text, color,
// size }) for a given side ('monster' or 'character').
const mapEvent = (event) => {
  switch (event.type) {
    case 'hit':
      return { text: `-${event.amount}`, color: Colors.white100, size: 18 }
    case 'spell':
      return { text: `-${event.amount}`, color: Colors.blueLight, size: 20 }
    case 'crit':
      return { text: `-${event.amount}!`, color: Colors.yellow, size: 26 }
    case 'heal':
      return { text: `+${event.amount}`, color: Colors.greenLight, size: 18 }
    case 'poison':
      return { text: `-${event.amount}`, color: Colors.pink, size: 16 }
    case 'buff':
      return { text: event.text || 'Buff', color: Colors.blueLight, size: 15 }
    case 'ko':
      return { text: 'K.O.', color: Colors.red, size: 24 }
    default:
      return null
  }
}

export const eventsToTexts = (events = [], on) => {
  return events.filter((event) => event.on === on).map(mapEvent).filter(Boolean)
}

export const goldText = (amount) => {
  return { text: `+${amount}`, color: Colors.yellow, size: 18 }
}

export const itemText = (item) => {
  return { text: `${item.glyph || ''} ${item.name}`.trim(), color: rarityColor(item.rarity), size: 14 }
}

export const plainText = (text, color = Colors.white100, size = 16) => {
  return { text, color, size }
}
