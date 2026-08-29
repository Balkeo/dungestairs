import Monsters, { Bosses, FinalBoss } from './Monsters'
import { calculate } from '../../Helper/CharacterCalculator'
import { random } from '../../Helper/Utils'
import { rng } from '../../Helper/rng'
import { getRunModifiers } from '../../Helper/challenges'

// The floor whose boss is the run's final boss (must be a boss floor, i.e. a
// multiple of 5). Beating it wins the run.
export const FINAL_DEPTH = 20

// Regular monster: its level rises every few floors so its HP and ATQ scale.
// From depth 3 on, a monster can roll into an "elite" variant: much tankier and
// harder hitting, but it drops bonus loot (handled in useGame).
export const useMonster = (depth = 1) => {
  const monster = Object.assign({}, Monsters[random(Monsters.length)])
  monster.level = 1 + Math.floor(depth / 3)
  const calculated = calculate(monster)

  const mods = getRunModifiers()
  const eliteChance = Math.min(0.28, 0.06 + depth * 0.015)
  if (mods.allElite || (depth >= 3 && rng() < eliteChance)) {
    calculated.isElite = true
    calculated.maxHp = Math.round(calculated.maxHp * 2)
    calculated.hp = calculated.maxHp
    calculated.stats = {
      ...calculated.stats,
      atq: calculated.stats.atq + 1 + Math.floor(depth / 6),
      def: calculated.stats.def + 1
    }
  }
  if (mods.monsterAtqBonus) {
    calculated.stats = { ...calculated.stats, atq: calculated.stats.atq + mods.monsterAtqBonus }
  }
  return calculated
}

// Boss for a boss floor: cycles through the roster and scales strongly with the
// full depth (level = depth).
export const makeBoss = (depth = 1) => {
  if (depth >= FINAL_DEPTH) {
    const finalBoss = Object.assign({}, FinalBoss)
    finalBoss.level = 1 + Math.floor(depth / 3)
    finalBoss.isBoss = true
    finalBoss.isFinalBoss = true
    return calculate(finalBoss)
  }
  const index = Math.max(0, Math.floor(depth / 5) - 1) % Bosses.length
  const boss = Object.assign({}, Bosses[index])
  boss.level = 1 + Math.floor(depth / 3)
  boss.isBoss = true
  return calculate(boss)
}
