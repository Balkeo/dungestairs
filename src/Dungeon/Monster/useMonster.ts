import Monsters, { Bosses, FinalBoss } from './Monsters'
import { calculate } from '../../Helper/CharacterCalculator'
import { random } from '../../Helper/Utils'
import { rng } from '../../Helper/rng'
import { getRunModifiers } from '../../Helper/challenges'

// The run is endless (die-and-retry): you descend as deep as you can. The
// "Seigneur du Donjon" apex boss guards every APEX_INTERVAL floors as a
// milestone; beating it is celebrated but the descent continues.
export const APEX_INTERVAL = 20

// Regular monster: its level rises every few floors so its HP and ATQ scale.
// From depth 3 on, a monster can roll into an "elite" variant: much tankier and
// harder hitting, but it drops bonus loot (handled in useGame).
export const useMonster = (depth = 1) => {
  const monster = Object.assign({}, Monsters[random(Monsters.length)])
  monster.level = 1 + Math.floor(depth / 2)
  const calculated = calculate(monster)

  // Extra HP the deeper you go, so a strong hero can't one-shot everything.
  const depthHp = 1 + depth * 0.08
  calculated.maxHp = Math.round(calculated.maxHp * depthHp)
  calculated.hp = calculated.maxHp

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
  const scaleHp = (boss) => {
    const calc = calculate(boss)
    calc.maxHp = Math.round(calc.maxHp * (1 + depth * 0.1))
    calc.hp = calc.maxHp
    return calc
  }
  if (depth % APEX_INTERVAL === 0) {
    const apex: any = Object.assign({}, FinalBoss)
    apex.level = 1 + Math.floor(depth / 3)
    apex.isBoss = true
    apex.isFinalBoss = true
    return scaleHp(apex)
  }
  const index = Math.max(0, Math.floor(depth / 5) - 1) % Bosses.length
  const boss: any = Object.assign({}, Bosses[index])
  boss.level = 1 + Math.floor(depth / 3)
  boss.isBoss = true
  return scaleHp(boss)
}
