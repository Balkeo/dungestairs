import Monsters from './Monsters'
import { calculate } from '../../Helper/CharacterCalculator'
import { random } from '../../Helper/Utils'

export const useMonster = (depth = 1) => {
  const selectMonster = () => {
    let monster = Object.assign({}, Monsters[random(Monsters.length)])
    monster.level = 1 + Math.floor(depth / 10)
    monster = calculate(monster)
    return monster
  }

  return selectMonster()
}
