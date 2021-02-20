import { useState } from 'react'
import { isEqual } from 'lodash'

import characters from './Characters'
import { calculate } from '../../Helper/SkillCalculator'

export const useCharacter = (selectedCharacter = 0) => {
  const selectCharacter = () => {
    const character = Object.assign({}, characters[selectedCharacter])
    return calculate(character)
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
