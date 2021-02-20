import { useCallback, useEffect } from 'react'
import { useDungeon } from './useDungeon'
import { useCharacter } from './Character/useCharacter'
import { resolveFight } from './resolveFight'

export const useGame = (selectedCharacter = 0, removeSelectedCharacter) => {
  const size = 5
  const { floor, openClosedCell, depth, exitToNextDepth, updateCell } = useDungeon(size)
  const { character, updateCharacter } = useCharacter(selectedCharacter)

  useEffect(() => {
    if (character.hp <= 0) {
      removeSelectedCharacter()
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
          cell.content = 0
          updateCell(cell)
          return cell
        } else if (cell.type === 'monster') {
          const fightResult = resolveFight(cell.content, character)
          cell.content = fightResult.monster
          updateCell(cell)
          updateCharacter(fightResult.character)
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
    character
  }
}
