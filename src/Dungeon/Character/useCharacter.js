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

  return { character, updateCharacter }
}
