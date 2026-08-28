import jexl from 'jexl-sync'
import achievements from '../Content/achievements.json'

// Ordered list of achievements. Each has a `when` condition (a jexl expression
// evaluated against the player's lifetime stats) and a gold `reward`.
export const ACHIEVEMENTS = Object.keys(achievements).map((id) => ({ id, ...achievements[id] }))

// Return the ids of achievements whose condition is now met and that are not
// already completed.
export const checkAchievements = (stats = {}, completedIds = []) => {
  return ACHIEVEMENTS
    .filter((achievement) => !completedIds.includes(achievement.id))
    .filter((achievement) => {
      try {
        return !!jexl.eval(String(achievement.when), stats)
      } catch (err) {
        return false
      }
    })
    .map((achievement) => achievement.id)
}

export const achievementById = (id) => achievements[id]
