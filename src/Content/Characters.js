import Thief from '../Assets/Thief.png'
import Paladin from '../Assets/Paladin.png'
import Mage from '../Assets/Mage.png'

const characters = [
  {
    profile: Paladin,
    class: 'Paladin',
    hp: 50,
    maxHp: 50,
    stats: {
      atq: 4,
      def: 0,
      spd: 2
    },
    level: 1,
    items: [],
    skills: [
      {
        icon: null,
        name: 'Holly Book',
        level: 1,
        effetcs: [
          {
            target: 'hp',
            effect: 'hp + 2 * (skills[0].level - 1)'
          },
          {
            target: 'maxHp',
            effect: 'maxHp + 2 * (skills[0].level - 1)'
          }
        ],
        descriptons: ''
      }
    ]
  },
  {
    profile: Thief,
    class: 'Thief',
    hp: 30,
    maxHp: 30,
    stats: {
      atq: 6,
      def: 0,
      spd: 3
    },
    level: 1,
    items: [],
    skills: [
      {
        icon: null,
        name: "Assassin's dagger",
        level: 1,
        effetcs: [
          {
            target: 'stats.atq',
            effect: 'stats.atq + 1 * (skills[0].level - 1)'
          }
        ],
        descriptons: ''
      }
    ]
  },
  {
    profile: Mage,
    class: 'Mage',
    hp: 30,
    maxHp: 30,
    stats: {
      atq: 6,
      def: 0,
      spd: 3
    },
    level: 1,
    items: [],
    skills: []
  }
]

export default characters
