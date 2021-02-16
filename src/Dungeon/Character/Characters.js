import Thief from '../../Assets/Thief.png'
import Paladin from '../../Assets/Paladin.png'
import Mage from '../../Assets/Mage.png'

const characters = [
  {
    profile: Paladin,
    class: 'Paladin',
    hp: 25,
    maxHp: 25,
    stats: {
      atq: 2,
      def: 1,
      spd: 1
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
        description: 'With an hard training increase maximum hit point by 2'
      }
    ]
  },
  {
    profile: Thief,
    class: 'Thief',
    hp: 25,
    maxHp: 25,
    stats: {
      atq: 2,
      def: 0,
      spd: 2
    },
    level: 1,
    items: [],
    skills: [
      {
        icon: null,
        name: "Assassin's cloak",
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
        description: ''
      }
    ]
  },
  {
    profile: Mage,
    class: 'Mage',
    hp: 25,
    maxHp: 25,
    stats: {
      atq: 3,
      def: 0,
      spd: 1
    },
    level: 1,
    items: [],
    skills: [
      {
        icon: null,
        name: 'Mage\'s staff',
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
        description: ''
      }
    ]
  }
]

export default characters
