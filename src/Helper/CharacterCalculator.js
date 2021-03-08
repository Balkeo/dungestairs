// @flow
import jexl from 'jexl-sync'
import type { CHARACTER_TYPE } from '../Dungeon/Content/constant'
import Characters from '../Dungeon/Character/Characters'
import Monsters from '../Dungeon/Monster/Monsters'

const getBaseCharacter = (characterType) => {
  const CharactersAndMonster = Characters.concat(Monsters)
  let baseCharacter = {}
  CharactersAndMonster.forEach((character: CHARACTER_TYPE) => {
    if (character.type === characterType) {
      baseCharacter = character
    }
  })
  return baseCharacter
}

const applySkills = (character: CHARACTER_TYPE, baseCharacter: CHARACTER_TYPE): CHARACTER_TYPE => {
  character.skills.forEach(function (skill, skillIndex) {
    skill.effects.forEach(function (effect) {
      character[effect.target] = baseCharacter[effect.target] + jexl.eval(effect.effect, character)
    })
    character.skills[skillIndex].cost = skill.level * 50
  })
  return character
}

const applyItems = (character: CHARACTER_TYPE, baseCharacter: CHARACTER_TYPE): CHARACTER_TYPE => {
  for (let index = 0; index < 8; index++) {
    const item = character.items[index]
    if (typeof item !== 'undefined') {
      character[item.target] = baseCharacter[item.target] + jexl.eval(item.effect, character)
    }
  }
  return character
}

export function calculate (character: CHARACTER_TYPE): CHARACTER_TYPE {
  const baseCharacter = getBaseCharacter(character.type)
  character = applySkills(character, baseCharacter)
  character = applyItems(character, baseCharacter)
  return character
}
