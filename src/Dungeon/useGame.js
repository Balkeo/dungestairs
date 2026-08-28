import { useCallback, useEffect, useRef, useState } from 'react'
import { useDungeon } from './useDungeon'
import { useCharacter } from './Character/useCharacter'
import { resolveFight } from './resolveFight'

export const useGame = (player = {}, removeSelectedCharacter) => {
  const size = 5
  const { floor, openClosedCell, depth, exitToNextDepth, updateCell } = useDungeon(size)
  const { character, updateCharacter } = useCharacter(player.characters[player.selectedCharacter])

  // The spell queued from the spell bar. Kept in a ref as well so the
  // (non-memoized) click handler always reads the latest value.
  const [queuedSpell, setQueuedSpell] = useState(null)
  const queuedSpellRef = useRef(null)

  const queueSpell = (spellId) => {
    const next = queuedSpellRef.current === spellId ? null : spellId
    queuedSpellRef.current = next
    setQueuedSpell(next)
  }

  const clearQueuedSpell = () => {
    queuedSpellRef.current = null
    setQueuedSpell(null)
  }

  useEffect(() => {
    if (character.hp <= 0) {
      removeSelectedCharacter(depth)
    }
  }, [character])

  const clickOnCell = useCallback(
    (x, y, addGold) => {
      const offset = y * 5 + x
      const cell = floor[offset]
      if (!cell.canClick || cell.isBlocked) {
        return cell
      } else if (!cell.isOpen) {
        openClosedCell(x, y)
      } else {
        if (cell.type === 'chest') {
          addGold(cell.content)
          // Build a new cell object rather than mutating floor[offset]:
          // updateCell diffs against the previous cell, so an in-place
          // mutation would compare the object to itself and never re-render.
          updateCell({ ...cell, content: 0 })
          return cell
        } else if (cell.type === 'monster') {
          const spellId = queuedSpellRef.current
          const fightResult = resolveFight(cell.content, character, spellId)
          updateCell({ ...cell, content: fightResult.monster })
          updateCharacter(fightResult.character)
          if (spellId) {
            clearQueuedSpell()
          }
          return cell
        } else if (cell.type === 'Key') {
          exitToNextDepth()
        }
      }
    }
  )

  return {
    size,
    floor,
    clickOnCell,
    depth,
    character,
    queuedSpell,
    queueSpell
  }
}
