import React, { useState } from 'react'
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
import { EventModal } from './EventModal'
import { InventoryModal } from './InventoryModal'
import { useModal } from '../Guideline/Modal'
import Colors from '../Helper/Colors'
import useWindowDimensions from '../useWindowDimensions'

const SeedBadge = styled.button<any>`
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 1030;
  display: flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 10px;
  border-radius: 15px;
  border: 2px solid ${Colors.woodDark};
  background: ${Colors.wood};
  color: ${Colors.goldLight};
  font-family: Helvetica, monospace;
  font-size: 12px;
  letter-spacing: 1px;
  cursor: pointer;
  &:hover { color: ${Colors.white100}; border-color: ${Colors.goldLight}; }
`

const ChallengeMark = styled.span<any>`
  color: ${Colors.yellow};
  font-weight: 800;
`

const InventoryButton = styled.button<any>`
  position: fixed;
  top: 12px;
  right: 150px;
  z-index: 1030;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 2px solid ${Colors.woodDark};
  background: ${Colors.wood};
  color: ${Colors.goldLight};
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { color: ${Colors.white100}; border-color: ${Colors.goldLight}; }
`

const Wraper = styled.div<any>`
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
  height: 100%;
  @media only screen and (max-width: 768px) {
    justify-content: space-evenly;
  }
`

export const Game = ({
  player = ({} as any),
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
    sellItem,
    closeShop,
    event,
    resolveEventChoice,
    closeEvent
  } = useGame(player, recordRun, addGold, removeGold)
  const { width, height } = useWindowDimensions()
  const isMobile = (width <= 768)
  const inventoryModal = useModal()
  const bagFull = (character.items || []).filter(Boolean).length >= 8
  const [seedCopied, setSeedCopied] = useState(false)
  const copySeed = () => {
    try {
      if (navigator.clipboard) navigator.clipboard.writeText(player.seed || '')
    } catch (err) { /* clipboard blocked; the seed is still shown */ }
    setSeedCopied(true)
    setTimeout(() => setSeedCopied(false), 1200)
  }

  return (
        <Wraper>
            {player.seed && (
              <SeedBadge onClick={copySeed} title="Copier la seed pour la partager">
                {player.challenge && <ChallengeMark>{player.challenge.glyph} {player.challenge.name}</ChallengeMark>}
                🌱 {player.seed}
                <span>{seedCopied ? '✓' : '📋'}</span>
              </SeedBadge>
            )}
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
              bag={character.items}
              onBuy={buyItem}
              onSell={sellItem}
              onClose={closeShop}
            />
            <EventModal
              event={event}
              gold={player.gold}
              onChoose={resolveEventChoice}
              onClose={closeEvent}
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
