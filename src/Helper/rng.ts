// Deterministic, seedable RNG for reproducible runs. All *game* randomness goes
// through `rng()` (see Helper/Utils and the callers that used Math.random), so a
// given seed always produces the same dungeon. Floors are re-seeded from
// (seed, depth) in useDungeon, which makes each floor's layout independent of
// what happened on earlier floors.

const fnv1a = (str) => {
  let hash = 2166136261 >>> 0
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

const mulberry32 = (seed) => {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

let currentSeed = 'default'
let generator = mulberry32(fnv1a(currentSeed))

// Random-looking human-shareable seed (uppercase letters + digits).
export const randomSeed = () => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = ''
  for (let i = 0; i < 8; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return out
}

// Start a run's RNG from a seed string.
export const setSeed = (seed) => {
  currentSeed = String(seed || 'default')
  generator = mulberry32(fnv1a(currentSeed))
}

// Re-seed deterministically from the current seed plus a sub-key (e.g. a floor
// number), so that sub-stream is reproducible regardless of earlier draws.
export const reseed = (subkey) => {
  generator = mulberry32(fnv1a(currentSeed + ':' + subkey))
}

export const getSeed = () => currentSeed

// The one random primitive everything else builds on: a float in [0, 1).
export const rng = () => generator()
