import Monsters, { Bosses } from './Monsters'
import { calculate } from '../../Helper/CharacterCalculator'
import { random } from '../../Helper/Utils'

// Regular monster: its level rises every few floors so its HP and ATQ scale.
export const useMonster = (depth = 1) => {
  const monster = Object.assign({}, Monsters[random(Monsters.length)])
  monster.level = 1 + Math.floor(depth / 4)
  return calculate(monster)
}

// Boss for a boss floor: cycles through the roster and scales strongly with the
// full depth (level = depth).
export const makeBoss = (depth = 1) => {
  const index = Math.max(0, Math.floor(depth / 5) - 1) % Bosses.length
  const boss = Object.assign({}, Bosses[index])
  boss.level = 1 + Math.floor(depth / 2)
  boss.isBoss = true
  return calculate(boss)
}
