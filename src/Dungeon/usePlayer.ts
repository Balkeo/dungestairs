import { useState, useEffect, useRef } from 'react'
import Characters from './Character/Characters'
import { calculate } from '../Helper/CharacterCalculator'
import { saveGame, loadGame, DEFAULT_STATS } from '../Helper/save'
import { checkAchievements, achievementById } from '../Helper/achievements'
import { randomSeed } from '../Helper/rng'
import { matchChallenge } from '../Helper/challenges'

export const usePlayer = () => {
  const loadedPlayer = loadGame()
  const [player, setPlayer] = useState<any>(
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

  // Snapshot of persistent progression taken when a seeded (no-progression) run
  // starts, so it can be restored untouched when the run ends.
  const preSeedSnapshotRef = useRef(null)

  const selectCharacter = (character = 0, seedInput = '') => {
    const forced = String(seedInput || '').trim()
    const seed = forced || randomSeed()
    const seeded = !!forced
    const challenge = matchChallenge(seed)
    setPlayer((previousPlayer) => {
      preSeedSnapshotRef.current = seeded
        ? {
            gold: previousPlayer.gold,
            stats: previousPlayer.stats,
            achievements: previousPlayer.achievements,
            depth: previousPlayer.depth
          }
        : null
      return {
        ...previousPlayer,
        selectedCharacter: character,
        inGame: true,
        seed,
        seeded,
        challenge: challenge || null,
        runId: (previousPlayer.runId || 0) + 1
      }
    })
  }

  // Fold a finished run into the lifetime stats, unlock any newly-earned
  // achievements and pay out their gold rewards. Returns the achievements
  // unlocked by this run so the UI can celebrate them.
  const recordRun = (summary = ({} as any)) => {
    // Seeded / challenge runs don't touch global progression.
    if (player.seeded) {
      return []
    }
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
      // A seeded replay keeps the same seed and records no progression.
      if (previousPlayer.seeded) {
        return { ...previousPlayer, runId: (previousPlayer.runId || 0) + 1 }
      }
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
    const snapshot = preSeedSnapshotRef.current
    setPlayer((previousPlayer) => {
      // Leaving a seeded run restores the pre-run progression, untouched.
      const restore = previousPlayer.seeded && snapshot ? snapshot : null
      return {
        ...previousPlayer,
        ...(restore || {}),
        selectedCharacter: null,
        inGame: false,
        seed: null,
        seeded: false,
        challenge: null,
        depth: restore
          ? restore.depth
          : { max: Math.max(previousPlayer.depth.max, depth), previous: depth }
      }
    })
    preSeedSnapshotRef.current = null
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

  // Each spell levels up independently, scaling its own effect. Cost grows with
  // the spell's current level.
  const spellUpgradeCost = (spell) => (spell.level || 1) * 60

  const upgradeCharacterSpell = (character, spellId) => {
    const target = player.characters[character].spells.find((spell) => spell.id === spellId)
    if (!target || player.gold < spellUpgradeCost(target)) {
      return
    }
    removeGold(spellUpgradeCost(target))
    const newCharacter = {
      ...player.characters[character],
      spells: player.characters[character].spells.map(
        (spell) => (spell.id === spellId ? { ...spell, level: (spell.level || 1) + 1 } : spell)
      )
    }
    updateCharacters(character, newCharacter)
  }

  useEffect(() => {
    // Never persist during a seeded run (it must leave no trace).
    if (!player.inGame && !player.seeded) {
      saveGame(player)
    }
  })

  return { player, addGold, removeGold, selectCharacter, removeSelectedCharacter, restartRun, recordRun, buyCharacter, upgradeCharacterSkill, upgradeCharacterSpell }
}
