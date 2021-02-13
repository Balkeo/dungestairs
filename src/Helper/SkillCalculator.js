import jexl from 'jexl-sync'

export function calculate (character) {
  character.skills.forEach(function (skill) {
    skill.effetcs.forEach(function (effect) {
      character[effect.target] = jexl.eval(effect.effect, character)
    })
  })
  return character
}
