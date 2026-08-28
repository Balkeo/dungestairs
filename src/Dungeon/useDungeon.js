import { useCallback, useEffect, useState } from 'react'
import { isEqual } from 'lodash'
import { generateCellForDepth, getEntranceCell, getKeyCell } from './useCell'
import { makeBoss } from './Monster/useMonster'
import { EMPTY_CELL } from './Content/constant'

const BOSS_INTERVAL = 5

// On a boss floor, drop a boss on a tile next to the key so it blocks the exit
// until it is defeated.
const placeBoss = (cells, size, depth, keyCell) => {
  const neighbours = [
    { x: keyCell.x + 1, y: keyCell.y },
    { x: keyCell.x - 1, y: keyCell.y },
    { x: keyCell.x, y: keyCell.y + 1 },
    { x: keyCell.x, y: keyCell.y - 1 }
  ]
  const entrance = getEntranceCell(size)
  for (const spot of neighbours) {
    if (spot.x < 0 || spot.y < 0 || spot.x >= size || spot.y >= size) {
      continue
    }
    const offset = spot.y * size + spot.x
    if (offset === entrance.offset || offset === keyCell.offset) {
      continue
    }
    cells[offset] = {
      ...EMPTY_CELL,
      type: 'monster',
      content: makeBoss(depth),
      offset,
      x: spot.x,
      y: spot.y
    }
    return
  }
}

const generateCells = (size, depth) => {
  const cells = []
  const entranceCell = getEntranceCell(size)
  const keyCell = getKeyCell(size)

  for (let row = 0; row < size; row++) {
    for (let cell = 0; cell < size; cell++) {
      const offset = row * size + cell
      cells[offset] = generateCellForDepth(depth, cell, row, size)
    }
  }

  cells[entranceCell.offset] = entranceCell
  cells[keyCell.offset] = keyCell

  if (depth % BOSS_INTERVAL === 0) {
    placeBoss(cells, size, depth, keyCell)
  }

  return cells
}

export const useDungeon = (size = 5, dungeonDepth = 1) => {
  const [depth, setDepth] = useState(() => dungeonDepth)
  let [cells, setCells] = useState(() => generateCells(size, depth))

  const exitToNextDepth = () => {
    const nextDepth = depth + 1
    setDepth(nextDepth)
    setCells(generateCells(size, nextDepth))
  }

  const assertCellExist = (x, y) => {
    if (x < 0 || y < 0 || x >= size || y >= size) {
      return false
    }
    const offset = y * 5 + x
    return typeof cells[offset] !== 'undefined'
  }

  const isOpen = (cell) => {
    return cell.isOpen
  }

  const isMonsterCell = (cell) => {
    return isOpen(cell) && cell.type === 'monster'
  }

  const isChestCell = (cell) => {
    return isOpen(cell) && cell.type === 'chest'
  }

  const isEmptyCell = (cell) => {
    return isOpen(cell) && cell.type === 'empty'
  }

  const isClearedCell = (cell) => {
    if (isEmptyCell(cell)) {
      return true
    }
    if (isMonsterCell(cell)) {
      return cell.content.hp <= 0
    }
    if (isChestCell(cell)) {
      return cell.content === 0
    }
  }

  const getAdjacentCells = (cell) => {
    const x = cell.x
    const y = cell.y
    const adjacentCells = []
    let offset = 0
    if (assertCellExist(x - 1, y)) {
      offset = y * 5 + (x - 1)
      adjacentCells.push(cells[offset])
    }
    if (assertCellExist(x + 1, y)) {
      offset = y * 5 + (x + 1)
      adjacentCells.push(cells[offset])
    }
    if (assertCellExist(x, y - 1)) {
      offset = (y - 1) * 5 + x
      adjacentCells.push(cells[offset])
    }
    if (assertCellExist(x, y + 1)) {
      offset = (y + 1) * 5 + x
      adjacentCells.push(cells[offset])
    }

    return adjacentCells
  }

  const haveMonsterInAdjacentCells = (adjacentCells) => {
    let haveMonsterInAdjacentCells = false
    adjacentCells.map((adjacentCell) => {
      if (isMonsterCell(adjacentCell) && !isClearedCell(adjacentCell)) {
        haveMonsterInAdjacentCells = true
      }
      return adjacentCell
    })
    return haveMonsterInAdjacentCells
  }

  const canClickOnCell = (cell) => {
    let canClick = cell.canClick
    let haveMonsterInAdjacentCells = false
    const adjacentCells = getAdjacentCells(cell)
    adjacentCells.map((adjacentCell) => {
      if (isMonsterCell(adjacentCell) && !isClearedCell(adjacentCell)) {
        haveMonsterInAdjacentCells = true
      }
      if (isOpen(adjacentCell)) {
        canClick = true
      }
      return adjacentCell
    })
    if (haveMonsterInAdjacentCells) {
      return false
    }

    return canClick && !isClearedCell(cell)
  }

  const checkOpenStatusOfAllCells = () => {
    cells = cells.map((cellValue) => {
      const temp = Object.assign({}, cellValue)
      temp.canClick = canClickOnCell(cellValue)
      temp.isBlocked = haveMonsterInAdjacentCells(getAdjacentCells(cellValue))
      return temp
    })
    return cells
  }

  const updateCell = (cell = {}) => {
    setCells((previousCells) => {
      const oldCell = previousCells[cell.offset]
      if (isEqual(oldCell, cell)) {
        return previousCells
      }
      const newCells = [...previousCells]
      newCells[cell.offset] = cell
      return newCells
    })
  }

  const openClosedCell = useCallback(
    (x, y) => {
      const offset = y * 5 + x
      if (!assertCellExist(x, y)) {
        return
      }
      setCells((previousCells) => {
        const newCells = [...previousCells]
        const openedCell = { ...newCells[offset], isOpen: true }
        openedCell.canClick = isEmptyCell(openedCell)
        newCells[offset] = openedCell
        return newCells
      })
    },
    [cells, size, depth]
  )

  useEffect(() => {
    setCells((previousCells) => {
      const tempsCells = checkOpenStatusOfAllCells(cells)
      if (!isEqual(previousCells, tempsCells)) {
        return tempsCells
      }
      return previousCells
    })
  }, [cells])

  return { floor: cells, openClosedCell, depth, exitToNextDepth, updateCell }
}
