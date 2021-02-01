let characters = [
  {
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
  }
]

export default characters