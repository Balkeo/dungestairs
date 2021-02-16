import { useState } from 'react'

export const usePlayer = () => {
  const [player, setPlayer] = useState(() => {
    return {
      gold: 0,
      selectedCharacter: null,
      inGame: false
    }
  })

  const addGold = (gold = 0) => {
    setPlayer((previousPlayer) => {
      return {
        ...previousPlayer,
        gold: previousPlayer.gold + gold
      }
    })
  }

  const selectCharacter = (character = 0) => {
    setPlayer((previousPlayer) => {
      return {
        ...previousPlayer,
        selectedCharacter: character
      }
    })
  }

  return { player, addGold, selectCharacter }
}
