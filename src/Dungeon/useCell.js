import { random } from '../Helper/Utils'
import { useMonster } from './useMonster'

const CELLTYPE = [
  {
    type: 'empty',
    availableFromFloor: 0
  },
  {
    type: 'chest',
    availableFromFloor: 0
  },
  {
    type: 'monster',
    availableFromFloor: 0
  },
  {
    type: 'trap',
    availableFromFloor: 10
  }
]
const CELL = {
  x: 0,
  y: 0,
  offset: 0,
  type: '',
  content: '',
  isOpen: false,
  canClick: false,
  isBlocked: false
}

const getChestContent = (depth = 1) => {
  return depth + random(5)
}

const initMonsterCell = (depth = 1) => {
  return useMonster(depth)
}

const setContent = (type, depth) => {
  switch (type) {
    case 'empty':
      return ''
    case 'chest':
      return getChestContent(depth)
    case 'monster':
      return initMonsterCell(depth)
    default:
  }
}

const getCellTypesForDepth = (depth = 1) => {
  const types = []
  CELLTYPE.map((cellType) => {
    if (depth >= cellType.availableFromFloor) {
      types.push(cellType.type)
    }
    return cellType
  })

  return types
}

const getTypeForDepthAndTypes = (depth = 1) => {
  const types = getCellTypesForDepth(depth)
  return types[random(types.length)]
}

export const generateCellForDepth = (depth = 1, x = 0, y = 0, boardSize = 5) => {
  const type = getTypeForDepthAndTypes(depth)

  return {
    ...CELL,
    type: type,
    content: setContent(type, depth),
    offset: y * boardSize + x,
    x: x,
    y: y
  }
}

export const getEntranceCell = (boardSize = 5) => {
  const x = (boardSize - 1) / 2
  const y = boardSize - 1
  return {
    ...CELL,
    type: 'Entrance',
    content: '',
    isOpen: true,
    offset: y * boardSize + x,
    x: x,
    y: y
  }
}

export const getKeyCell = (boardSize = 5) => {
  const entranceCell = getEntranceCell(boardSize)
  let x = 0
  let y = 0
  do {
    x = random(boardSize)
    y = random(boardSize)
  } while (y * boardSize + x === entranceCell.offset)

  return {
    ...CELL,
    type: 'Key',
    content: '',
    offset: y * boardSize + x,
    x: x,
    y: y
  }
}
