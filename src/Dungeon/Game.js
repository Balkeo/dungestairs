import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { useGame } from './useGame'

import Character from './Character'
import { SpellBar } from './Character/SpellBar'
import { Floor } from './Floor'
import { Cell } from './Cell'
import { DepthBanner } from './DepthBanner'
import { DeathScreen } from './DeathScreen'
import { Shop } from './Shop'
import { InventoryModal } from './InventoryModal'
import { useModal } from '../Guideline/Modal'
import Colors from '../Helper/Colors'
import useWindowDimensions from '../useWindowDimensions'

const InventoryButton = styled.button`
  position: fixed;
  top: 12px;
  right: 150px;
  z-index: 1030;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 2px solid ${Colors.white30};
  background: ${Colors.brown2};
  color: ${Colors.white75};
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { color: ${Colors.white100}; border-color: ${Colors.white75}; }
`

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
  removeGold,
  removeSelectedCharacter,
  restartRun,
  recordRun
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
    depthBanner,
    runOver,
    shop,
    buyItem,
    closeShop
  } = useGame(player, recordRun, addGold, removeGold)
  const { width, height } = useWindowDimensions()
  const isMobile = (width <= 768)
  const inventoryModal = useModal()
  const bagFull = (character.items || []).filter(Boolean).length >= 8

  return (
        <Wraper>
            <InventoryButton title="Équipement" onClick={inventoryModal.toggle}>🎒</InventoryButton>
            <InventoryModal
              isShowing={inventoryModal.isShowing}
              hide={inventoryModal.toggle}
              character={character}
            />
            <Shop
              shop={shop}
              gold={player.gold}
              bagFull={bagFull}
              onBuy={buyItem}
              onClose={closeShop}
            />
            <DepthBanner banner={depthBanner} />
            <DeathScreen
              summary={runOver}
              onReplay={() => restartRun(runOver.depth)}
              onMenu={() => removeSelectedCharacter(runOver.depth)}
            />
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
                        targetable={!!queuedSpell && cellValue.type === 'monster' && cellValue.isOpen && cellValue.canClick && cellValue.content && cellValue.content.hp > 0}
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
  removeSelectedCharacter: PropTypes.func,
  restartRun: PropTypes.func,
  recordRun: PropTypes.func
}
