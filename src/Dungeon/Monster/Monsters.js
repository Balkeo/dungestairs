import { EMPTY_CHARACTER } from '../Content/constant'
import Zombie from '../../Assets/Zombie.png'
import Skeleton from '../../Assets/Skeleton.png'
import Alien from '../../Assets/Alien.png'

const createMonster = (
  type = null,
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
      effetcs: [
        {
          target: 'hp',
          effect: 'hp + 1 * (level - 1)'
        }
      ],
      descriptons: ''
    }
  ]
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
    skills
  }
}

const SKELETON = createMonster('Skeleton', Skeleton, 2, { atq: 2, spd: 2, def: 0 }, 1, [], [
  {
    name: 'HP',
    effetcs: [
      {
        target: 'hp',
        effect: 'hp + 1 * (level - 1)'
      },
      {
        target: 'maxHp',
        effect: 'maxHp + 1 * (level - 1)'
      }
    ],
    descriptons: ''
  }
])

const ZOMBIE = createMonster('Zombie', Zombie, 3, { atq: 1, spd: 1, def: 0 }, 1, [], [
  {
    name: 'HP',
    effetcs: [
      {
        target: 'hp',
        effect: 'hp + 2 * (level - 1)'
      },
      {
        target: 'maxHp',
        effect: 'maxHp + 2 * (level - 1)'
      }
    ],
    descriptons: ''
  }
])

const ALIEN = createMonster('Alien', Alien, 2, { atq: 1, spd: 1, def: 1 }, 1, [], [
  {
    name: 'HP',
    effetcs: [
      {
        target: 'hp',
        effect: 'hp + 2 * (level - 1)'
      },
      {
        target: 'maxHp',
        effect: 'maxHp + 2 * (level - 1)'
      }
    ],
    descriptons: ''
  }
])

const monsters = [
  SKELETON,
  ZOMBIE,
  ALIEN
]

export default monsters
