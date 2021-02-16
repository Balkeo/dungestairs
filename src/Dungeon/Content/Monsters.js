import Zombie from '../../Assets/Zombie.png'
import Skeleton from '../../Assets/Skeleton.png'

const monsters = [
  {
    class: 'Skeleton',
    icon: Skeleton,
    hp: 2,
    maxHp: 2,
    atq: 2,
    spd: 2,
    level: 1,
    items: [],
    skills: [
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
    ]
  },
  {
    class: 'Zombie',
    icon: Zombie,
    hp: 3,
    maxHp: 3,
    atq: 1,
    spd: 1,
    level: 1,
    items: [],
    skills: [
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
    ]
  }
]

export default monsters
