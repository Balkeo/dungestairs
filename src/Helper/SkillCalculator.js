import jexl from "jexl-sync";

export function calculate(character) {
  character.skills.forEach(function (item) {
    character[item.type] = jexl.eval(item.effect, character)
  })
  return character;
}