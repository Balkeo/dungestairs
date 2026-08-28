import jexl from 'jexl-sync'
import { rollDice } from '../Helper/Utils'

// ---------------------------------------------------------------------------
// Combat engine
//
// A "round" is one click on a monster cell. The optional queued spell (chosen
// from the spell bar) resolves first, then damage-over-time ticks, then the
// speed-ordered attack exchange. Passives are resolved here too:
//   * "threshold" passives feed effectiveStats() (conditional stat bonuses)
//   * "trigger" passives fire on attack/hit/damaged events
// Spells and passives describe their numbers as jexl expressions evaluated
// against the acting entity, so new content needs no engine change.
// ---------------------------------------------------------------------------

const evalNumber = (expression, context) => {
  const value = jexl.eval(String(expression), context)
  return typeof value === 'number' && !isNaN(value) ? value : 0
}

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

const cloneEntity = (entity = {}) => {
  return {
    ...entity,
    stats: { ...(entity.stats || {}) },
    cooldowns: { ...(entity.cooldowns || {}) },
    activeEffects: (entity.activeEffects || []).map((effect) => ({ ...effect }))
  }
}

// Stats used for this round = base stats + active stat buffs + threshold passives.
const effectiveStats = (entity) => {
  const stats = { ...(entity.stats || {}) }
  const addToStat = (target, amount) => {
    if (target && target.indexOf('stats.') === 0) {
      const key = target.slice('stats.'.length)
      stats[key] = (stats[key] || 0) + amount
    }
  }
  ;(entity.activeEffects || []).forEach((effect) => {
    if (effect.kind === 'buff') {
      addToStat(effect.target, effect.amount)
    }
  })
  ;(entity.passives || []).forEach((passive) => {
    if (passive.kind === 'threshold' && jexl.eval(String(passive.when), entity)) {
      addToStat(passive.target, evalNumber(passive.amount, entity))
    }
  })
  return stats
}

const triggersFor = (entity, on) => {
  return (entity.passives || []).filter((passive) => passive.kind === 'trigger' && passive.on === on)
}

const heal = (entity, amount) => {
  entity.hp = clamp(entity.hp + amount, 0, entity.maxHp)
}

const applyDamage = (entity, amount) => {
  entity.hp = clamp(entity.hp - amount, 0, entity.maxHp)
}

const addDot = (entity, amount, duration) => {
  entity.activeEffects = [
    ...(entity.activeEffects || []),
    { kind: 'dot', amount, remaining: duration }
  ]
}

// Damage-over-time (poison) ticks at the start of the round and expires.
const tickDots = (entity) => {
  const remaining = []
  let total = 0
  ;(entity.activeEffects || []).forEach((effect) => {
    if (effect.kind === 'dot') {
      total += effect.amount
      if (effect.remaining - 1 > 0) {
        remaining.push({ ...effect, remaining: effect.remaining - 1 })
      }
    } else {
      remaining.push(effect)
    }
  })
  entity.activeEffects = remaining
  if (total > 0) {
    applyDamage(entity, total)
  }
}

// Stat buffs count down at the end of the round.
const tickBuffs = (entity) => {
  entity.activeEffects = (entity.activeEffects || [])
    .map((effect) => (effect.kind === 'buff' ? { ...effect, remaining: effect.remaining - 1 } : effect))
    .filter((effect) => effect.kind !== 'buff' || effect.remaining > 0)
}

const tickCooldowns = (entity) => {
  const cooldowns = { ...(entity.cooldowns || {}) }
  Object.keys(cooldowns).forEach((id) => {
    cooldowns[id] = Math.max(0, cooldowns[id] - 1)
  })
  entity.cooldowns = cooldowns
}

const isSpellReady = (character, spellId) => {
  return (character.cooldowns[spellId] || 0) <= 0
}

const castSpell = (character, monster, spellId) => {
  const spell = (character.spells || []).find((candidate) => candidate.id === spellId)
  if (!spell || !isSpellReady(character, spellId)) {
    return
  }
  ;(spell.actions || []).forEach((action) => {
    const amount = evalNumber(action.amount, character)
    switch (action.kind) {
      case 'damage':
        applyDamage(monster, amount)
        break
      case 'heal':
        heal(character, amount)
        break
      case 'buff':
        character.activeEffects = [
          ...character.activeEffects,
          { kind: 'buff', target: action.target, amount, remaining: action.duration || 1 }
        ]
        break
      case 'dot':
        addDot(monster, amount, action.duration || 1)
        break
      default:
        break
    }
  })
  character.cooldowns = { ...character.cooldowns, [spellId]: spell.cooldown || 0 }
}

// One combatant strikes the other, firing crit / on-hit / on-damaged triggers.
const strike = (attacker, defender, attackerStats, defenderStats) => {
  if (attacker.hp <= 0) {
    return
  }
  let damage = Math.max(0, attackerStats.atq - defenderStats.def)

  const critTrigger = triggersFor(attacker, 'attack').find((trigger) => trigger.effect === 'crit')
  if (critTrigger && Math.random() < evalNumber(critTrigger.amount, attacker)) {
    damage *= 2
  }

  applyDamage(defender, damage)

  if (damage > 0) {
    const hitContext = { ...attacker, damageDealt: damage }
    triggersFor(attacker, 'hit').forEach((trigger) => {
      if (trigger.effect === 'lifesteal') {
        heal(attacker, Math.floor(evalNumber(trigger.amount, hitContext) * damage))
      } else if (trigger.effect === 'dot') {
        addDot(defender, evalNumber(trigger.amount, attacker), trigger.duration || 1)
      }
    })

    // Defender's "damaged" triggers (e.g. Thorns) reflect straight back.
    if (defender.hp > 0) {
      triggersFor(defender, 'damaged').forEach((trigger) => {
        if (trigger.effect === 'riposte') {
          applyDamage(attacker, evalNumber(trigger.amount, defender))
        }
      })
    }
  }
}

const attackRound = (character, monster) => {
  const characterStats = effectiveStats(character)
  const monsterStats = effectiveStats(monster)
  const characterSpd = rollDice(6, characterStats.spd)
  const monsterSpd = rollDice(6, monsterStats.spd)

  if (characterSpd < monsterSpd) {
    strike(monster, character, monsterStats, characterStats)
    strike(character, monster, characterStats, monsterStats)
  } else {
    strike(character, monster, characterStats, monsterStats)
    strike(monster, character, monsterStats, characterStats)
  }
}

export const resolveFight = (monster = {}, character = {}, queuedSpellId = null) => {
  const nextCharacter = cloneEntity(character)
  const nextMonster = cloneEntity(monster)

  tickCooldowns(nextCharacter)

  if (queuedSpellId) {
    castSpell(nextCharacter, nextMonster, queuedSpellId)
  }

  tickDots(nextMonster)
  tickDots(nextCharacter)

  // Skip the melee exchange if the spell or poison already finished the enemy.
  if (nextMonster.hp > 0 && nextCharacter.hp > 0) {
    attackRound(nextCharacter, nextMonster)
  }

  tickBuffs(nextCharacter)
  tickBuffs(nextMonster)

  return {
    character: nextCharacter,
    monster: nextMonster
  }
}
