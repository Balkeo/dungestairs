export function random (max) {
  return Math.floor(Math.random() * max)
}

export function rollDice (max = 6, nbRoll = 1) {
  let result = 0
  for (let i = 0; i < nbRoll; i++) {
    result += Math.floor(Math.random() * max) + 1
  }
  return result
}
