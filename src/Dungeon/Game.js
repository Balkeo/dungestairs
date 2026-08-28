import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { useGame } from './useGame'

import Character from './Character'
import { SpellBar } from './Character/SpellBar'
import { Floor } from './Floor'
import { Cell } from './Cell'
import { DepthBanner } from './DepthBanner'
import useWindowDimensions from '../useWindowDimensions'

const Wraper = styled.div`
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
  height: 100%;
  @media only screen and (max-width: 768px) {
    justify-content: space-evenly;
  }
`

export const Game = ({
  player = {},
  addGold,
  removeSelectedCharacter
}) => {
  const {
    size,
    floor,
    clickOnCell,
    depth,
    character,
    queuedSpell,
    queueSpell,
    cellAction,
    characterAction,
    depthBanner
  } = useGame(player, removeSelectedCharacter)
  const { width, height } = useWindowDimensions()
  const isMobile = (width <= 768)

  return (
        <Wraper>
            <DepthBanner banner={depthBanner} />
            <Character
              character={character}
              mobileHeight={height - width - 20}
              isMobile={isMobile}
              player={player}
              depth={depth}
              action={characterAction}
            />
            <SpellBar
              character={character}
              queuedSpell={queuedSpell}
              queueSpell={queueSpell}
            />
            <Floor size={size} depth={depth} player={player}>
                {floor.map((cellValue, cellOffset) => (
                    <Cell
                        key={cellOffset}
                        cellValue={cellValue}
                        action={cellAction && cellAction.offset === cellOffset ? cellAction : null}
                        onClick={() => clickOnCell(cellValue.x, cellValue.y, addGold)}
                    />
                ))}
            </Floor>
        </Wraper>
  )
}
Game.propTypes = {
  player: PropTypes.object,
  addGold: PropTypes.func,
  removeSelectedCharacter: PropTypes.func
}
