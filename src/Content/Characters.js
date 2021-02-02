import Thief from "../Assets/Thief.jpg";

let characters = [
  {
    profile: Thief,
    class: "Paladin",
    hp: 50,
    atq: 4,
    spd: 2,
    level: 1,
    items: [],
    skills: [
      {
        name: "Holly Book",
        type: 'hp',
        effect: "hp + 25 * (skills[0].level - 1)",
        level: 1
      },
    ]
  },
  {
    profile: Thief,
    class: "Thief",
    hp: 30,
    atq: 6,
    spd: 3,
    level: 1,
    items: [],
    skills: [
      {
        name: "Assassin's dagger",
        type: 'atq',
        effect: "atq + 1 * (skills[0].level - 1)",
        level: 1
      },
    ]
  }
]

export default characters