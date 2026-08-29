// Central registry mapping an "icon" key used in JSON config files to the
// actual imported image asset. JSON cannot `import` images, so classes,
// spells and passives reference an icon by name (e.g. "Paladin") and this
// registry resolves it to a bundled asset. Add a new key here when you add
// a new art asset; leave it out and the UI falls back to a default icon.
import Thief from '../Assets/Thief.png'
import Paladin from '../Assets/Paladin.png'
import Mage from '../Assets/Mage.png'
import Berserker from '../Assets/Berserker.png'
import Ranger from '../Assets/Ranger.png'
import Skills from '../Assets/Skills.png'

const ASSETS = {
  Thief,
  Paladin,
  Mage,
  Berserker,
  Ranger,
  Skills
}

// Resolve an icon key to an asset, or null when unknown (callers fall back
// to a default icon). Passing null/undefined is safe and returns null.
export const resolveIcon = (key) => {
  if (!key) {
    return null
  }
  return ASSETS[key] || null
}

export default ASSETS
