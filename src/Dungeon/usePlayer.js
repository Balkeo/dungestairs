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
    const savedCharacters = gameLoad.characters || []
    // Content-driven fields (stats, spells, passives, icon) always come from
    // the live config; only the player's progression (gold spent = price,
    // upgraded skills) is restored from the save. This keeps existing saves
    // compatible when new spells/passives are added to a class.
    const characters = Characters.map((base, index) => {
      const saved = savedCharacters[index] || {}
      return {
        ...base,
        price: saved.price !== undefined ? saved.price : base.price,
        skills: saved.skills || base.skills
      }
    })
    const player = {
      ...gameLoad,
      characters,
      selectedCharacter: null,
      inGame: false
    }
    return player
  }

  return null
}

export const usePlayer = () => {
  const loadedPlayer = loadGame()
  const [player, setPlayer] = useState(
    () => {
      if (loadedPlayer !== null) {
        return {
          ...loadedPlayer,
          selectedCharacter: null,
          inGame: false,
          runId: 0
        }
      } else {
        return {
          gold: 0,
          selectedCharacter: null,
          inGame: false,
          runId: 0,
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

  // Start a fresh run with the same character. Bumping runId re-keys (and thus
  // remounts) the Game, giving a new dungeon and a full-HP character.
  const restartRun = (depth) => {
    setPlayer((previousPlayer) => {
      return {
        ...previousPlayer,
        runId: (previousPlayer.runId || 0) + 1,
        depth: {
          max: Math.max(previousPlayer.depth.max, depth),
          previous: depth
        }
      }
    })
  }

  const removeSelectedCharacter = (depth) => {
    setPlayer((previousPlayer) => {
      return {
        ...previousPlayer,
        selectedCharacter: null,
        inGame: false,
        depth: {
          max: Math.max(previousPlayer.depth.max, depth),
          previous: depth
        }
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
        ...player.characters[character],
        skills: player.characters[character].skills.map(
          (existingSkill, index) => (index === skill ? newSkill : existingSkill)
        )
      }
      updateCharacters(character, newCharacter)
    }
  }

  useEffect(() => {
    if (!player.inGame) {
      saveGame(player)
    }
  })

  return { player, addGold, selectCharacter, removeSelectedCharacter, restartRun, buyCharacter, upgradeCharacterSkill }
}
