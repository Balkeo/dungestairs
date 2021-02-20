import React from 'react'
import PropTypes from 'prop-types'

import { useGame } from './useGame'

import Character from './Character'
import { Floor } from './Floor'
import { Cell } from './Cell'

export const Game = ({
  player = {},
  addGold,
  removeSelectedCharacter
}) => {
  const { size, floor, clickOnCell, depth, character } = useGame(player.selectedCharacter, removeSelectedCharacter)

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
                        onClick={() => clickOnCell(cellValue.x, cellValue.y, addGold)}
                    />
                ))}
            </Floor>
        </div>
  )
}
Game.propTypes = {
  player: PropTypes.object,
  addGold: PropTypes.func,
  removeSelectedCharacter: PropTypes.func
}
