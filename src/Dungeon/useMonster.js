import monsters from './Content/Monsters'
import { calculate } from '../Helper/SkillCalculator'
import { random } from '../Helper/Utils'

export const useMonster = (level = 1) => {
  const selectMonster = () => {
    let monster = Object.assign({}, monsters[random(monsters.length)])
    monster.level = level
    monster = calculate(monster)
    return monster
  }

  return selectMonster()
}
