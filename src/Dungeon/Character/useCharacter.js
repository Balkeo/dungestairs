import { useState } from 'react'

import characters from './Characters'
import { calculate } from '../../Helper/SkillCalculator'

export const useCharacter = (selectedCharacter = 0) => {
  const selectCharacter = () => {
    const character = Object.assign({}, characters[selectedCharacter])
    return calculate(character)
  }

  const [character, setCharacter] = useState(() => selectCharacter())

  const takeDamage = (monster = {}) => {
    if (monster.hp > 0) {
      let damage = monster.atq - character.stats.def
      damage = damage < 0 ? 0 : damage
      setCharacter((previousCharacter) => {
        const newCharacter = {
          ...previousCharacter,
          hp: previousCharacter.hp - damage
        }
        if (newCharacter.hp <= 0) {
          newCharacter.hp = 0
        }
        return newCharacter
      })
    }
  }

  return { character, takeDamage }
}
