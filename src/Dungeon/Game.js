import React from 'react'
import PropTypes from 'prop-types'

import { useDungeon } from './useDungeon'
import { useCharacter } from './useCharacter'
import { usePlayer } from './usePlayer'

import { Character } from './Character'
import { Floor } from './Floor'
import { Cell } from './Cell'

import colors from '../Helper/Colors'

export const Game = ({ selectedCharacter = 0 }) => {
  const size = 5
  const { floor, openClosedCell, depth } = useDungeon(size)
  const { character, takeDamage } = useCharacter(selectedCharacter)
  const { player, addGold } = usePlayer()

  return (
        <div
            style={{
              backgroundColor: colors.light,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%'
            }}
        >
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
            <Character character={character} />
        </div>
  )
}
Game.propTypes = {
  selectedCharacter: PropTypes.number
}
