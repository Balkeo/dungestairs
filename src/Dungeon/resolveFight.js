import { rollDice } from '../Helper/Utils'

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
  const characterSpd = rollDice(6, character.stats.spd)
  const monsterSpd = rollDice(6, monster.stats.spd)
  console.log(`Character ${characterSpd} VS Monster ${monsterSpd}`)
  if (characterSpd < monsterSpd) {
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
