import { useState } from 'react'
import { isEqual } from 'lodash'

import Characters from './Characters'
import { calculate } from '../../Helper/CharacterCalculator'

export const useCharacter = (selectedCharacter = 0) => {
  const selectCharacter = () => {
    const character = Object.assign({}, Characters[selectedCharacter])
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
