import { useState } from 'react'

import characters from '../Content/Characters'
import { calculate } from '../Helper/SkillCalculator'

export const useCharacter = (selectedCharacter = 0) => {
  const selectCharacter = () => {
    const character = Object.assign({}, characters[selectedCharacter])
    return calculate(character)
  }

  const [character, setCharacter] = useState(() => selectCharacter())

  const takeDamage = (monster = {}) => {
    if (monster.hp > 0) {
      const damage = monster.atq
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
