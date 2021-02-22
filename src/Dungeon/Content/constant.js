export const EMPTY_CHARACTER = {
  type: null,
  icon: null,
  hp: 0,
  maxHp: 0,
  stats: {
    atq: 0,
    def: 0,
    spd: 0
  },
  level: 0,
  items: [],
  skills: []
}

export const EMPTY_CELL = {
  x: 0,
  y: 0,
  offset: 0,
  type: '',
  content: '',
  isOpen: false,
  canClick: false,
  isBlocked: false
}
