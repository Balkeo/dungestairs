import { useState, useEffect } from 'react'
import Characters from './Character/Characters'
import { calculate } from '../Helper/CharacterCalculator'

const saveGame = (player) => {
  try {
    localStorage.setItem('_dungestairs', JSON.stringify(player))
  } catch (err) {
    console.log('Cannot access localStorage - browser may be old or storage may be corrupt')
  }
}

const loadGame = () => {
  const gameLoad = JSON.parse(localStorage.getItem('_dungestairs'))
  if (gameLoad !== null) {
    const player = {
      ...gameLoad,
      selectedCharacter: null,
      inGame: false
    }
    player.characters = Object.assign(Characters, player.characters)
    return player
  }

  return null
}

export const usePlayer = () => {
  const loadedPlayer = loadGame()
  console.log(loadedPlayer)
  const [player, setPlayer] = useState(
    () => {
      if (loadedPlayer !== null) {
        return {
          ...loadedPlayer,
          selectedCharacter: null,
          inGame: false
        }
      } else {
        return {
          gold: 0,
          selectedCharacter: null,
          inGame: false,
          depth: {
            max: 0,
            previous: 0
          },
          characters: Characters
        }
      }
    }
  )

  const addGold = (gold = 0) => {
    setPlayer((previousPlayer) => {
      return {
        ...previousPlayer,
        gold: previousPlayer.gold + gold
      }
    })
  }

  const removeGold = (gold = 0) => {
    setPlayer((previousPlayer) => {
      return {
        ...previousPlayer,
        gold: previousPlayer.gold - gold
      }
    })
  }

  const selectCharacter = (character = 0) => {
    setPlayer((previousPlayer) => {
      return {
        ...previousPlayer,
        selectedCharacter: character,
        inGame: true
      }
    })
  }

  const removeSelectedCharacter = (depth) => {
    const playerDepth = player.depth
    if (playerDepth.max < depth) {
      playerDepth.max = depth
    }
    playerDepth.previous = depth
    setPlayer((previousPlayer) => {
      return {
        ...previousPlayer,
        selectedCharacter: null,
        inGame: false,
        depth: playerDepth
      }
    })
  }

  const updateCharacters = (index, newCharacter) => {
    setPlayer((previousPlayer) => {
      const newCharacters = [
        ...previousPlayer.characters
      ]
      newCharacters[index] = calculate(newCharacter)
      return {
        ...previousPlayer,
        characters: newCharacters
      }
    })
  }

  const buyCharacter = (characterToBeBuy) => {
    if (player.gold >= player.characters[characterToBeBuy].price) {
      removeGold(player.characters[characterToBeBuy].price)
      const character = {
        ...player.characters[characterToBeBuy],
        price: 0
      }
      updateCharacters(characterToBeBuy, character)
    }
  }

  const upgradeCharacterSkill = (character, skill) => {
    if (player.gold >= player.characters[character].skills[skill].cost) {
      removeGold(player.characters[character].skills[skill].cost)
      const newSkill = {
        ...player.characters[character].skills[skill],
        level: player.characters[character].skills[skill].level + 1
      }
      const newCharacter = {
        ...player.characters[character]
      }
      newCharacter.skills[skill] = newSkill
      updateCharacters(character, newCharacter)
    }
  }

  useEffect(() => {
    if (!player.inGame) {
      saveGame(player)
    }
  })

  return { player, addGold, selectCharacter, removeSelectedCharacter, buyCharacter, upgradeCharacterSkill }
}
