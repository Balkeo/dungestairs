import { useState, useEffect } from 'react'
import Characters from './Character/Characters'
import { calculate } from '../Helper/CharacterCalculator'
import { saveGame, loadGame, DEFAULT_STATS } from '../Helper/save'
import { checkAchievements, achievementById } from '../Helper/achievements'

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
          stats: { ...DEFAULT_STATS },
          achievements: [],
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

  // Fold a finished run into the lifetime stats, unlock any newly-earned
  // achievements and pay out their gold rewards. Returns the achievements
  // unlocked by this run so the UI can celebrate them.
  const recordRun = (summary = {}) => {
    const previousStats = player.stats || { ...DEFAULT_STATS }
    const stats = {
      runs: (previousStats.runs || 0) + 1,
      bestDepth: Math.max(previousStats.bestDepth || 0, summary.depth || 0),
      kills: (previousStats.kills || 0) + (summary.kills || 0),
      bossKills: (previousStats.bossKills || 0) + (summary.bossKills || 0),
      goldEarned: (previousStats.goldEarned || 0) + (summary.gold || 0)
    }
    const completed = player.achievements || []
    const newlyIds = checkAchievements(stats, completed)
    const reward = newlyIds.reduce((sum, id) => sum + (achievementById(id).reward || 0), 0)
    setPlayer((previousPlayer) => ({
      ...previousPlayer,
      gold: previousPlayer.gold + reward,
      stats,
      achievements: [...(previousPlayer.achievements || []), ...newlyIds]
    }))
    return newlyIds.map((id) => ({ id, ...achievementById(id) }))
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

  return { player, addGold, removeGold, selectCharacter, removeSelectedCharacter, restartRun, recordRun, buyCharacter, upgradeCharacterSkill }
}
