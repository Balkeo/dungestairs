import jexl from 'jexl-sync'
import Characters from '../Dungeon/Character/Characters'
import Monsters from '../Dungeon/Monster/Monsters'

const getBaseCharacter = (characterType) => {
  const CharactersAndMonster = Characters.concat(Monsters)
  let baseCharacter = {}
  CharactersAndMonster.forEach((character) => {
    if (character.type === characterType) {
      baseCharacter = character
    }
  })
  return baseCharacter
}

const getPath = (obj, path) => {
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj)
}

const setPath = (obj, path, value) => {
  const keys = path.split('.')
  const last = keys.pop()
  let target = obj
  keys.forEach((key) => {
    if (target[key] == null) {
      target[key] = {}
    }
    target = target[key]
  })
  target[last] = value
}

const evalNumber = (expression, context) => {
  const value = jexl.eval(String(expression), context)
  return typeof value === 'number' && !isNaN(value) ? value : 0
}

const applySkills = (character, baseCharacter) => {
  character.skills.forEach(function (skill, skillIndex) {
    skill.effects.forEach(function (effect) {
      character[effect.target] = baseCharacter[effect.target] + jexl.eval(effect.effect, character)
    })
    character.skills[skillIndex].cost = skill.level * 50
  })
  return character
}

const applyItems = (character, baseCharacter) => {
  for (let index = 0; index < 8; index++) {
    const item = character.items[index]
    if (typeof item !== 'undefined') {
      character[item.target] = baseCharacter[item.target] + jexl.eval(item.effect, character)
    }
  }
  return character
}

// "stat" passives are permanent, always-on bonuses (e.g. +1 DEF). They are
// summed per target and applied as an absolute offset from the base value so
// that calculate() stays idempotent when called repeatedly. "threshold" and
// "trigger" passives are situational and resolved during combat instead.
const applyPassives = (character, baseCharacter) => {
  if (!Array.isArray(character.passives)) {
    return character
  }
  const deltas = {}
  character.passives.forEach((passive) => {
    if (passive.kind === 'stat' && passive.target) {
      deltas[passive.target] = (deltas[passive.target] || 0) + evalNumber(passive.amount, character)
    }
  })
  Object.keys(deltas).forEach((target) => {
    const base = getPath(baseCharacter, target) || 0
    setPath(character, target, base + deltas[target])
  })
  return character
}

export function calculate (character) {
  const baseCharacter = getBaseCharacter(character.type)
  // Defensive clone: stats and skills would otherwise be shared by reference
  // with the base config, so mutating them here would corrupt the template.
  character = {
    ...character,
    stats: { ...(character.stats || {}) },
    skills: (character.skills || []).map((skill) => ({ ...skill })),
    passives: character.passives || baseCharacter.passives || []
  }
  character = applySkills(character, baseCharacter)
  character = applyItems(character, baseCharacter)
  character = applyPassives(character, baseCharacter)
  return character
}
