import { useState } from 'react'

export const usePlayer = () => {
  const [player, setPlayer] = useState(() => {
    return {
      gold: 0
    }
  })

  const addGold = (gold = 0) => {
    setPlayer((previousPlayer) => {
      return {
        gold: previousPlayer.gold + gold
      }
    })
  }

  return { player, addGold }
}
