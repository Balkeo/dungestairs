import { EMPTY_CHARACTER } from '../Content/constant'
import Thief from '../../Assets/Thief.png'
import Paladin from '../../Assets/Paladin.png'
import Mage from '../../Assets/Mage.png'

const createCharacter = (
  type = '',
  icon = null,
  hp = 0,
  stats = {
    atq: 0,
    spd: 0,
    def: 0
  },
  level = 0,
  items = [],
  skills = [
    {
      name: '',
      effects: [
        {
          target: 'hp',
          effect: 'hp + 1 * (level - 1)'
        }
      ],
      descriptons: ''
    }
  ],
  price = 0
) => {
  return {
    ...EMPTY_CHARACTER,
    type,
    icon,
    hp,
    maxHp: hp,
    stats,
    level,
    items,
    skills,
    price
  }
}

const PALADIN_SKILLS = [
  {
    icon: null,
    name: 'Holly Book',
    level: 0,
    cost: 50,
    effects: [
      {
        target: 'hp',
        effect: '5 * skills[0].level'
      },
      {
        target: 'maxHp',
        effect: '5 * skills[0].level'
      }
    ],
    description: 'With an hard training increase maximum hit point by 5'
  }
]
const PALADIN = createCharacter('Paladin', Paladin, 25, { atq: 2, def: 1, spd: 1 }, 1, [], PALADIN_SKILLS)
const THIEF_SKILLS = [
  {
    icon: null,
    name: "Assassin's cloak",
    level: 0,
    cost: 50,
    effects: [
      {
        target: 'hp',
        effect: '5 * skills[0].level'
      },
      {
        target: 'maxHp',
        effect: '5 * skills[0].level'
      }
    ],
    description: ''
  }
]
const THIEF = createCharacter('Thief', Thief, 25, { atq: 2, def: 0, spd: 2 }, 1, [], THIEF_SKILLS, 500)

const MAGE_SKILLS = [
  {
    icon: null,
    name: 'Mage\'s staff',
    level: 0,
    cost: 50,
    effects: [
      {
        target: 'hp',
        effect: '5 * skills[0].level'
      },
      {
        target: 'maxHp',
        effect: '5 * skills[0].level'
      }
    ],
    description: ''
  }
]
const MAGE = createCharacter('Mage', Mage, 25, { atq: 3, def: 0, spd: 1 }, 1, [], MAGE_SKILLS, 1000)

const Characters = [
  PALADIN,
  THIEF,
  MAGE
]

export default Characters
