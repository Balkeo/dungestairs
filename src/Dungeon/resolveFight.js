// import { random } from '../Helper/Utils'

const attack = (attacker = {}, defender = {}) => {
  if (attacker.hp > 0) {
    let damage = attacker.stats.atq - defender.stats.def
    damage = damage < 0 ? 0 : damage
    const newDefender = {
      ...defender,
      hp: defender.hp - damage
    }
    if (newDefender.hp <= 0) {
      newDefender.hp = 0
    }
    return newDefender
  }
  return defender
}

const attackRound = (character = {}, monster = {}) => {
  if (character.stats.spd < monster.stats.spd) {
    character = attack(monster, character)
    monster = attack(character, monster)
  } else {
    monster = attack(character, monster)
    character = attack(monster, character)
  }

  return {
    character,
    monster
  }
}

export const resolveFight = (
  monster = {},
  character = {}
) => {
  return attackRound(character, monster)
}
