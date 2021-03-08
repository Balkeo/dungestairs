import { random, rollDice } from '../Helper/Utils'
import { useMonster } from './Monster/useMonster'
import { EMPTY_CELL } from './Content/constant'

const TYPES = [
  {
    type: 'trap',
    probability: 5
  },
  {
    type: 'ally',
    probability: 5
  },
  {
    type: 'loot',
    probability: 15
  },
  {
    type: 'empty',
    probability: 30
  },
  {
    type: 'encounter',
    probability: 40
  }
]

const CELL_TYPE_FOR_TYPE = {
  empty: [
    'empty'
  ],
  encounter: [
    'monster'
  ],
  loot: [
    'chest'
  ],
  ally: [
    'healer',
    'mage',
    'knight'
  ],
  trap: [
    'trap'
  ]
}

const scaleDepthToLevel = (depth = 0) => {
  const scale = parseInt(depth / 55)
  let depthLevel = 1 + depth % 55
  depthLevel = parseInt(Math.log(depthLevel))
  return 1 + scale + depthLevel
}

const getChestContent = (level = 1) => {
  return level + rollDice(6, level)
}

const initMonsterCell = (level = 1) => {
  return useMonster(level)
}

const setContent = (type, depth) => {
  const level = scaleDepthToLevel(depth)
  switch (type) {
    case 'empty':
      return ''
    case 'chest':
      return getChestContent(level)
    case 'monster':
      return initMonsterCell(level)
    default:
  }
}

const getType = () => {
  let randomCellType = rollDice(100)
  let type = null
  TYPES.forEach((cellType) => {
    if (type === null && randomCellType <= cellType.probability) {
      type = cellType.type
    } else {
      randomCellType = randomCellType - cellType.probability
    }
  })
  switch (type) {
    case 'encounter':
      return CELL_TYPE_FOR_TYPE.encounter
    case 'loot':
      return CELL_TYPE_FOR_TYPE.loot
    case 'ally':
      return CELL_TYPE_FOR_TYPE.ally
    case 'trap':
      return CELL_TYPE_FOR_TYPE.trap
    case 'empty':
    default :
      return CELL_TYPE_FOR_TYPE.empty
  }
}

const getCellType = () => {
  const types = getType()
  return types[random(types.length)]
}

export const generateCellForDepth = (depth = 1, x = 0, y = 0, boardSize = 5) => {
  const type = getCellType()

  return {
    ...EMPTY_CELL,
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
    ...EMPTY_CELL,
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
    ...EMPTY_CELL,
    type: 'Key',
    content: '',
    offset: y * boardSize + x,
    x: x,
    y: y
  }
}
