import monsters from './Monsters'
import { calculate } from '../../Helper/SkillCalculator'
import { random } from '../../Helper/Utils'

export const useMonster = (depth = 1) => {
  const selectMonster = () => {
    let monster = Object.assign({}, monsters[random(monsters.length)])
    monster.level = 1 + Math.floor(depth / 10)
    monster = calculate(monster)
    return monster
  }

  return selectMonster()
}
