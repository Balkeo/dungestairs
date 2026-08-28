import { EMPTY_CHARACTER } from '../Content/constant'
import Zombie from '../../Assets/Zombie.png'
import Skeleton from '../../Assets/Skeleton.png'
import Alien from '../../Assets/Alien.png'

// Standard "growth" skill: HP and ATQ both scale with the monster's level (which
// is derived from the dungeon depth), so encounters get tougher the deeper you
// go instead of staying trivial.
const scalingSkills = (hpPerLevel = 1, atqPerLevel = 1) => ([
  {
    name: 'Growth',
    effects: [
      { target: 'hp', effect: `${hpPerLevel} * (level - 1)` },
      { target: 'maxHp', effect: `${hpPerLevel} * (level - 1)` },
      { target: 'stats.atq', effect: `${atqPerLevel} * (level - 1)` }
    ],
    descriptons: ''
  }
])

const createMonster = (
  type = null,
  glyph = null,
  hp = 0,
  stats = { atq: 0, spd: 0, def: 0 },
  skills = scalingSkills(1, 1),
  icon = null
) => {
  return {
    ...EMPTY_CHARACTER,
    type,
    icon,
    glyph,
    hp,
    maxHp: hp,
    stats,
    level: 1,
    items: [],
    skills
  }
}

const SKELETON = createMonster('Skeleton', '💀', 2, { atq: 2, spd: 2, def: 0 }, scalingSkills(1, 1), Skeleton)
const ZOMBIE = createMonster('Zombie', '🧟', 4, { atq: 1, spd: 1, def: 0 }, scalingSkills(2, 1), Zombie)
const ALIEN = createMonster('Alien', '👽', 3, { atq: 1, spd: 1, def: 1 }, scalingSkills(2, 1), Alien)
const BAT = createMonster('Bat', '🦇', 2, { atq: 1, spd: 4, def: 0 }, scalingSkills(1, 1))
const OGRE = createMonster('Ogre', '👹', 6, { atq: 3, spd: 1, def: 1 }, scalingSkills(3, 1))
const GHOST = createMonster('Ghost', '👻', 3, { atq: 2, spd: 3, def: 0 }, scalingSkills(1, 1))

const Monsters = [
  SKELETON,
  ZOMBIE,
  ALIEN,
  BAT,
  OGRE,
  GHOST
]

// Bosses guard the key on every 5th floor. They hit harder and scale faster.
const createBoss = (type, glyph, hp, stats, hpPerLevel, atqPerLevel) => {
  const boss = createMonster(type, glyph, hp, stats, scalingSkills(hpPerLevel, atqPerLevel))
  boss.isBoss = true
  return boss
}

export const Bosses = [
  createBoss('Dragon', '🐉', 20, { atq: 5, spd: 2, def: 2 }, 5, 2),
  createBoss('Ogre King', '👑', 30, { atq: 4, spd: 1, def: 3 }, 6, 2),
  createBoss('Reaper', '☠️', 18, { atq: 6, spd: 4, def: 1 }, 4, 2)
]

export default Monsters
