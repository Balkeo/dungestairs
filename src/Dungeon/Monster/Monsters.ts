import { EMPTY_CHARACTER } from '../Content/constant'
import Zombie from '../../Assets/Zombie.png'
import Skeleton from '../../Assets/Skeleton.png'
import Alien from '../../Assets/Alien.png'
import Bat from '../../Assets/Bat.png'
import Ogre from '../../Assets/Ogre.png'
import Ghost from '../../Assets/Ghost.png'
import Dragon from '../../Assets/Dragon.png'
import OgreKing from '../../Assets/OgreKing.png'
import Reaper from '../../Assets/Reaper.png'
import Imp from '../../Assets/Imp.png'
import Orc from '../../Assets/Orc.png'
import Shade from '../../Assets/Shade.png'
import Drake from '../../Assets/Drake.png'
import Revenant from '../../Assets/Revenant.png'
import FrostCaster from '../../Assets/FrostCaster.png'
import Behemoth from '../../Assets/Behemoth.png'

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
const BAT = createMonster('Bat', '🦇', 2, { atq: 1, spd: 4, def: 0 }, scalingSkills(1, 1), Bat)
const OGRE = createMonster('Ogre', '👹', 6, { atq: 3, spd: 1, def: 1 }, scalingSkills(3, 1), Ogre)
const GHOST = createMonster('Ghost', '👻', 3, { atq: 2, spd: 3, def: 0 }, scalingSkills(1, 1), Ghost)
const IMP = createMonster('Imp', '🔥', 2, { atq: 2, spd: 3, def: 0 }, scalingSkills(1, 1), Imp)
const ORC = createMonster('Orc', '👺', 5, { atq: 2, spd: 1, def: 1 }, scalingSkills(2, 1), Orc)
const SHADE = createMonster('Shade', '🌑', 3, { atq: 2, spd: 3, def: 0 }, scalingSkills(1, 1), Shade)
const DRAKE = createMonster('Drake', '🐲', 5, { atq: 2, spd: 2, def: 1 }, scalingSkills(2, 1), Drake)
const REVENANT = createMonster('Revenant', '⚔️', 4, { atq: 2, spd: 1, def: 2 }, scalingSkills(2, 1), Revenant)
const FROST = createMonster('Frost Caster', '❄️', 3, { atq: 3, spd: 2, def: 0 }, scalingSkills(1, 1), FrostCaster)

const Monsters = [
  SKELETON,
  ZOMBIE,
  ALIEN,
  BAT,
  OGRE,
  GHOST,
  IMP,
  ORC,
  SHADE,
  DRAKE,
  REVENANT,
  FROST
]

// Bosses guard the key on every 5th floor. They hit harder and scale faster.
const createBoss = (type, glyph, hp, stats, hpPerLevel, atqPerLevel, icon = null) => {
  const boss: any = createMonster(type, glyph, hp, stats, scalingSkills(hpPerLevel, atqPerLevel), icon)
  boss.isBoss = true
  return boss
}

export const Bosses = [
  createBoss('Dragon', '🐉', 18, { atq: 4, spd: 2, def: 1 }, 4, 1, Dragon),
  createBoss('Ogre King', '👑', 24, { atq: 4, spd: 1, def: 2 }, 5, 1, OgreKing),
  createBoss('Reaper', '☠️', 16, { atq: 5, spd: 4, def: 0 }, 3, 1, Reaper),
  createBoss('Behemoth', '🪲', 22, { atq: 4, spd: 1, def: 2 }, 5, 1, Behemoth)
]

// The run's final boss: beating it wins the run.
export const FinalBoss = (() => {
  const boss: any = createBoss('Seigneur du Donjon', '😈', 40, { atq: 6, spd: 2, def: 3 }, 5, 2, OgreKing)
  boss.isFinalBoss = true
  return boss
})()

export default Monsters
