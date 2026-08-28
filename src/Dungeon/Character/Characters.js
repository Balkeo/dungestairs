// Playable classes are now defined in data (src/Content/classes/*.json) and
// assembled by the content loader. This module stays as the app-wide entry
// point for the class list so existing imports keep working, while adding a
// new class requires no code change here.
import Classes from '../../Content'

const Characters = Classes

export default Characters
