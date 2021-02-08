import Zombie from "../Assets/Zombie.png";
import Skeleton from "../Assets/Skeleton.png";

let monsters = [
  {
    class: "Skeleton",
    icon: Skeleton,
    hp: 2,
    maxHp: 2,
    atq: 3,
    spd: 3,
    level: 1,
    items: [],
    skills: [
      {
        name: "HP",
        type: "hp",
        effect: "hp + 1 * (level - 1)"
      },
      {
        name: "HP",
        type: "maxHp",
        effect: "maxHp + 1 * (level - 1)"
      }
    ]
  },
  {
    class: "Zombie",
    icon: Zombie,
    hp: 3,
    maxHp: 3,
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
