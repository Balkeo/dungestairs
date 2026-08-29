import { rng } from './rng'

export function random (max) {
  return Math.floor(rng() * max)
}

export function rollDice (max = 6, nbRoll = 1) {
  let result = 0
  for (let i = 0; i < nbRoll; i++) {
    result += Math.floor(rng() * max) + 1
  }
  return result
}
