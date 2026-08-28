import { useState } from 'react'
import { isEqual } from 'lodash'

import { calculate } from '../../Helper/CharacterCalculator'

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

  return { character, updateCharacter, addItem }
}
