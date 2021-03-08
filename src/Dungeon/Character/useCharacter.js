import { useState } from 'react'
import { isEqual } from 'lodash'

import { calculate } from '../../Helper/CharacterCalculator'

export const useCharacter = (selectedCharacter) => {
  const selectCharacter = () => {
    const character = Object.assign({}, selectedCharacter)
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
