import { useCallback, useEffect, useState } from 'react'
import { isEqual } from 'lodash'
import { generateCellForDepth, getEntranceCell, getKeyCell } from './useCell'

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

  return cells
}

export const useDungeon = (size = 5, dungeonDepth = 1) => {
  const [depth, setDepth] = useState(() => dungeonDepth)
  let [cells, setCells] = useState(() => generateCells(size, depth))

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

  const monsterTakeDamage = (monster, damage = 0) => {
    const newMonster = {
      ...monster,
      hp: monster.hp - damage
    }
    if (newMonster.hp <= 0) {
      newMonster.hp = 0
    }
    return newMonster
  }

  const openClosedCell = useCallback(
    (x, y, characterDamage = 0) => {
      const offset = y * 5 + x
      if (!assertCellExist(x, y)) {
        return
      }
      setCells((previousCells) => {
        let newCells = [...previousCells]
        if (!newCells[offset].isOpen) {
          newCells[offset].isOpen = true
          newCells[offset].canClick = isEmptyCell(newCells[offset])
        } else {
          switch (newCells[offset].type) {
            case 'empty':
              break
            case 'chest':
              newCells[offset].content = 0
              break
            case 'monster':
              newCells[offset].content = monsterTakeDamage(newCells[offset].content, characterDamage)
              break
            case 'Key':
              setDepth(depth + 1)
              newCells = generateCells(size, depth)
              break
            default:
              break
          }
        }
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

  return { floor: cells, openClosedCell, depth }
}
