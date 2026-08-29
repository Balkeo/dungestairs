import jexl from 'jexl-sync'
import Characters from '../Dungeon/Character/Characters'
import Monsters, { Bosses } from '../Dungeon/Monster/Monsters'

const getBaseCharacter = (characterType) => {
  const CharactersAndMonster = Characters.concat(Monsters).concat(Bosses)
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

// A character's final stats are its base values plus the summed contributions of
// its upgraded skills, its equipped items and its "stat" passives. Everything is
// accumulated as an absolute offset from the base so calculate() is idempotent:
// calling it again (e.g. after picking up loot) never double-counts. "threshold"
// and "trigger" passives are situational and resolved during combat instead.
export function calculate (character) {
  const baseCharacter = getBaseCharacter(character.type)
  character = {
    ...character,
    stats: { ...(character.stats || {}) },
    skills: (character.skills || []).map((skill) => ({ ...skill })),
    items: (character.items || []).slice(),
    boons: (character.boons || []).slice(),
    relics: (character.relics || []).slice(),
    passives: character.passives || baseCharacter.passives || []
  }

  const deltas = {}
  const add = (targetPath, amount) => {
    if (targetPath) {
      deltas[targetPath] = (deltas[targetPath] || 0) + amount
    }
  }

  character.skills.forEach((skill, skillIndex) => {
    (skill.effects || []).forEach((effect) => {
      add(effect.target, evalNumber(effect.effect, character))
    })
    character.skills[skillIndex].cost = skill.level * 50
  })

  character.items.forEach((item) => {
    if (!item) {
      return
    }
    // Items may carry a single {target, effect} or several via `effects`.
    if (Array.isArray(item.effects)) {
      item.effects.forEach((effect) => {
        if (effect && effect.target) {
          add(effect.target, evalNumber(effect.effect, character))
        }
      })
    } else if (item.target) {
      add(item.target, evalNumber(item.effect, character))
    }
  })

  // Ally "boons" boost stats like items but are temporary (reset on depth change)
  // and never enter the inventory bag.
  character.boons.forEach((boon) => {
    if (boon && boon.target) {
      add(boon.target, evalNumber(boon.effect, character))
    }
  })

  // Run-long relics: only the "stat" kind adds flat stats here; conditional and
  // triggered relics are handled in combat (resolveFight) like passives.
  character.relics.forEach((relic) => {
    if (relic && relic.kind === 'stat' && relic.target) {
      add(relic.target, evalNumber(relic.amount, character))
    }
  })

  character.passives.forEach((passive) => {
    if (passive.kind === 'stat' && passive.target) {
      add(passive.target, evalNumber(passive.amount, character))
    }
  })

  Object.keys(deltas).forEach((targetPath) => {
    const base = getPath(baseCharacter, targetPath) || 0
    setPath(character, targetPath, base + deltas[targetPath])
  })

  return character
}
