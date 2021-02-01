import Zombie from "../Assets/Zombie.png";
import Skeleton from "../Assets/Skeleton.png";

let monsters = [
  {
    class: "Skeleton",
    icon: Skeleton,
    hp: 5,
    maxHp: 5,
    atq: 3,
    spd: 3,
    level: 1,
    items: [],
    skills: [
      {
        name: "HP",
        type: "hp",
        effect: "hp + 2 * (level - 1)"
      },
      {
        name: "HP",
        type: "maxHp",
        effect: "maxHp + 2 * (level - 1)"
      }
    ]
  },
  {
    class: "Zombie",
    icon: Zombie,
    hp: 10,
    maxHp: 10,
    atq: 1,
    spd: 1,
    level: 1,
    items: [],
    skills: [
      {
        name: "HP",
        type: "hp",
        effect: "hp + 2 * (level - 1)"
      },
      {
        name: "HP",
        type: "maxHp",
        effect: "maxHp + 2 * (level - 1)"
      }
    ]
  }
];

export default monsters;
