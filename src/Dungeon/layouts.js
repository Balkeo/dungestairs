import { random, rollDice } from '../Helper/Utils'
import { getEntranceCell } from './useCell'

// Room layouts carve "void" tiles (impassable chasms) out of the square board to
// vary its shape. Every template keeps the walkable area 4-connected and always
// leaves the entrance (bottom-centre) walkable; callers additionally verify the
// key sits on a tile reachable from the entrance, so a run is never soft-locked.

const idx = (x, y, size) => y * size + x

// No chasms: the classic full board.
const full = () => new Set()

// Hollow centre with a usable border ring — a pit you must skirt around.
const pit = (size) => {
  const voids = new Set()
  for (let y = 1; y < size - 1; y++) {
    for (let x = 1; x < size - 1; x++) {
      voids.add(idx(x, y, size))
    }
  }
  return voids
}

// A central corridor leading up to a boss room along the top row; the flanks are
// chasm. Reads as a guided "path to the boss".
const corridor = (size) => {
  const voids = new Set()
  const mid = (size - 1) / 2
  const cols = [Math.floor(mid), Math.ceil(mid)]
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const onColumn = cols.includes(x)
      const onTopRow = y === 0
      if (!onColumn && !onTopRow) {
        voids.add(idx(x, y, size))
      }
    }
  }
  return voids
}

// Scattered single-tile pillars to weave around; most of the room stays open.
const pillars = (size) => {
  const voids = new Set()
  for (let y = 1; y < size - 1; y += 2) {
    for (let x = 1; x < size - 1; x += 2) {
      voids.add(idx(x, y, size))
    }
  }
  return voids
}

// Blocked corners leave a diamond-shaped arena.
const diamond = (size) => {
  const voids = new Set()
  const mid = (size - 1) / 2
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (Math.abs(x - mid) + Math.abs(y - mid) > mid) {
        voids.add(idx(x, y, size))
      }
    }
  }
  return voids
}

const LAYOUTS = { full, pit, corridor, pillars, diamond }

// Weighted pick. Boss floors favour the corridor so the boss sits at the end of a
// deliberate path; early/other floors stay mostly open with occasional shapes.
const weightedName = (depth) => {
  if (depth <= 1) {
    return 'full'
  }
  const isBossFloor = depth % 5 === 0
  const table = isBossFloor
    ? [['corridor', 70], ['full', 30]]
    : [['full', 40], ['pit', 20], ['pillars', 20], ['diamond', 20]]
  let roll = rollDice(100)
  for (const [name, weight] of table) {
    if (roll <= weight) {
      return name
    }
    roll -= weight
  }
  return 'full'
}

// Offsets reachable from `start` walking 4-directionally over non-void tiles.
export const reachableOffsets = (voids, size, start) => {
  const seen = new Set([start])
  const stack = [start]
  while (stack.length) {
    const off = stack.pop()
    const x = off % size
    const y = Math.floor(off / size)
    const neighbours = [
      [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]
    ]
    for (const [nx, ny] of neighbours) {
      if (nx < 0 || ny < 0 || nx >= size || ny >= size) {
        continue
      }
      const nOff = idx(nx, ny, size)
      if (voids.has(nOff) || seen.has(nOff)) {
        continue
      }
      seen.add(nOff)
      stack.push(nOff)
    }
  }
  return seen
}

// Pick a layout for a floor. Returns the void offsets (entrance always cleared)
// and the layout name. The entrance is guaranteed walkable.
export const pickLayout = (depth = 1, size = 5) => {
  const name = weightedName(depth)
  const voids = (LAYOUTS[name] || full)(size)
  const entrance = getEntranceCell(size)
  voids.delete(entrance.offset)
  return { name, voids }
}

// Choose the key tile on a floor: a random non-entrance tile reachable from the
// entrance. On boss floors, prefer a tile that has a free neighbour where the
// boss can stand and block the exit.
export const pickReachableKey = (voids, size, needsBossSpot = false) => {
  const entrance = getEntranceCell(size)
  const reachable = [...reachableOffsets(voids, size, entrance.offset)].filter(
    (off) => off !== entrance.offset
  )
  const hasBossSpot = (off) => {
    const x = off % size
    const y = Math.floor(off / size)
    return [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]].some(([nx, ny]) => {
      if (nx < 0 || ny < 0 || nx >= size || ny >= size) {
        return false
      }
      const nOff = idx(nx, ny, size)
      return !voids.has(nOff) && nOff !== entrance.offset
    })
  }
  let pool = reachable
  if (needsBossSpot) {
    const withSpot = reachable.filter(hasBossSpot)
    if (withSpot.length) {
      pool = withSpot
    }
  }
  const offset = pool[random(pool.length)]
  return { offset, x: offset % size, y: Math.floor(offset / size) }
}
