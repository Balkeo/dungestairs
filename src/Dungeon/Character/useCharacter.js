import { useState } from 'react'
import { isEqual } from 'lodash'

import { calculate } from '../../Helper/CharacterCalculator'

// A run can hold only ONE relic — it's a build-defining pick, not a stack.
export const MAX_RELICS = 1

export const useCharacter = (selectedCharacter) => {
  const selectCharacter = () => {
    const character = calculate(Object.assign({}, selectedCharacter))
    // Combat runtime state is reset for each dungeon run: full HP, no spell
    // cooldowns and no lingering buffs / poisons.
    character.hp = character.maxHp
    character.cooldowns = {}
    character.activeEffects = []
    return character
  }

  const [character, setCharacter] = useState(() => selectCharacter())

  const updateCharacter = (newCharacter = {}) => {
    setCharacter((previousCharacter) => {
      if (!isEqual(previousCharacter, newCharacter)) {
        return newCharacter
      } else {
        return previousCharacter
      }
    })
  }

  // Equip a looted item: recompute stats but keep the current HP (and add any
  // Max HP the item grants), so loot never acts as a free full heal. Returns
  // whether the item was actually added (the bag holds 8).
  const addItem = (item) => {
    let added = false
    setCharacter((previousCharacter) => {
      const currentItems = (previousCharacter.items || []).filter(Boolean)
      if (!item || currentItems.length >= 8) {
        return previousCharacter
      }
      added = true
      const recalculated = calculate({ ...previousCharacter, items: [...currentItems, item] })
      const maxHpGain = recalculated.maxHp - previousCharacter.maxHp
      recalculated.hp = Math.min(previousCharacter.hp + Math.max(0, maxHpGain), recalculated.maxHp)
      recalculated.cooldowns = previousCharacter.cooldowns
      recalculated.activeEffects = previousCharacter.activeEffects
      return recalculated
    })
    return added
  }

  // Remove an equipped item (e.g. sold to a merchant): recompute stats, clamping
  // HP to the possibly-lower max. Returns the removed item, or null.
  const removeItem = (index) => {
    let removed = null
    setCharacter((previousCharacter) => {
      const items = (previousCharacter.items || []).filter(Boolean)
      if (index < 0 || index >= items.length) {
        return previousCharacter
      }
      removed = items[index]
      const nextItems = items.slice()
      nextItems.splice(index, 1)
      const recalculated = calculate({ ...previousCharacter, items: nextItems })
      recalculated.hp = Math.min(previousCharacter.hp, recalculated.maxHp)
      recalculated.cooldowns = previousCharacter.cooldowns
      recalculated.activeEffects = previousCharacter.activeEffects
      return recalculated
    })
    return removed
  }

  // Grant a temporary ally boon: recompute stats with the extra boon but keep the
  // current HP. Boons live outside the inventory bag and are wiped on depth change.
  const addBoon = (boon) => {
    if (!boon) {
      return
    }
    setCharacter((previousCharacter) => {
      const boons = [...(previousCharacter.boons || []), boon]
      const recalculated = calculate({ ...previousCharacter, boons })
      recalculated.hp = Math.min(previousCharacter.hp, recalculated.maxHp)
      recalculated.cooldowns = previousCharacter.cooldowns
      recalculated.activeEffects = previousCharacter.activeEffects
      return recalculated
    })
  }

  // Acquire a run-long relic (unique). Recompute stats and grant any Max HP it
  // adds as current HP too. No-op if the relic is already owned.
  const addRelic = (relic) => {
    if (!relic) {
      return
    }
    setCharacter((previousCharacter) => {
      const owned = previousCharacter.relics || []
      // The reliquary is small on purpose: relics are build-defining, not stacked.
      if (owned.length >= MAX_RELICS || owned.some((r) => r.id === relic.id)) {
        return previousCharacter
      }
      const relics = [...owned, relic]
      const recalculated = calculate({ ...previousCharacter, relics })
      const maxHpGain = recalculated.maxHp - previousCharacter.maxHp
      recalculated.hp = Math.min(previousCharacter.hp + Math.max(0, maxHpGain), recalculated.maxHp)
      recalculated.cooldowns = previousCharacter.cooldowns
      recalculated.activeEffects = previousCharacter.activeEffects
      return recalculated
    })
  }

  // Drop every boon (called when descending to a new floor) and recompute stats.
  const clearBoons = () => {
    setCharacter((previousCharacter) => {
      if (!previousCharacter.boons || previousCharacter.boons.length === 0) {
        return previousCharacter
      }
      const recalculated = calculate({ ...previousCharacter, boons: [] })
      recalculated.hp = Math.min(previousCharacter.hp, recalculated.maxHp)
      recalculated.cooldowns = previousCharacter.cooldowns
      recalculated.activeEffects = previousCharacter.activeEffects
      return recalculated
    })
  }

  return { character, updateCharacter, addItem, removeItem, addBoon, clearBoons, addRelic }
}
