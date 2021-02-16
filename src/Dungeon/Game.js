import React from 'react'
import PropTypes from 'prop-types'

import { useDungeon } from './useDungeon'
import { useCharacter } from './Character/useCharacter'

import Character from './Character'
import { Floor } from './Floor'
import { Cell } from './Cell'

export const Game = ({
  player = {},
  addGold
}) => {
  const size = 5
  const { floor, openClosedCell, depth } = useDungeon(size)
  const { character, takeDamage } = useCharacter(player.selectedCharacter)

  return (
        <div
            style={{
              display: 'flex',
              height: '100%'
            }}
        >
            <Character character={character} />
            <Floor size={size} depth={depth} player={player}>
                {floor.map((cellValue, cellOffset) => (
                    <Cell
                        key={cellOffset}
                        cellValue={cellValue}
                        character={character}
                        openCell={() => openClosedCell(cellValue.x, cellValue.y, character.stats.atq)}
                        addGold={() => addGold(cellValue.content)}
                        takeDamage={cellValue.type === 'monster' ? () => takeDamage(cellValue.content) : null}
                    />
                ))}
            </Floor>
        </div>
  )
}
Game.propTypes = {
  player: PropTypes.object,
  addGold: PropTypes.func
}
