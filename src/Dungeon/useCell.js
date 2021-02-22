import { random, rollDice } from '../Helper/Utils'
import { useMonster } from './Monster/useMonster'
import { EMPTY_CELL } from './Content/constant'

const TYPES = [
  {
    type: 'trap',
    probability: 5
  },
  {
    type: 'empty',
    probability: 10
  },
  {
    type: 'ally',
    probability: 15
  },
  {
    type: 'loot',
    probability: 20
  },
  {
    type: 'encounter',
    probability: 50
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

const getChestContent = (depth = 1) => {
  return depth + rollDice(6, depth)
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
