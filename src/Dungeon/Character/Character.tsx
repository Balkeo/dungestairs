import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Colors from '../../Helper/Colors'
import { Inventory } from './Inventory'
import { Skills } from './Skills'
import { Stats } from './Stats'
import styled, { css } from 'styled-components'
import Modal, { useModal } from '../../Guideline/Modal'
import { FloatingLayer, useFloatingQueue } from '../../Guideline/FloatingText'
import { flashRed } from '../../Guideline/animations'

const Wraper = styled.div<any>`
  box-sizing: border-box;
  background-color: ${Colors.woodDark};
  color: ${Colors.white50};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  @media only screen and (max-width: 768px) {
    overflow: scroll;
    height: ${({ mobileHeight }) => (mobileHeight)};
  }
`

const PortraitArea = styled.div<any>`
  position: relative;
  display: flex;
  order: 2;
`

const HurtFlash = styled.div<any>`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 6;
  background: ${({ tone }) => (tone === 'heal'
    ? 'radial-gradient(circle, rgba(46,201,115,0.5) 0%, rgba(46,201,115,0) 70%)'
    : 'radial-gradient(circle, rgba(255,45,85,0.5) 0%, rgba(255,45,85,0) 70%)')};
  ${css`animation: ${flashRed} 0.45s ease-out forwards;`}
`

const Buffs = styled.div<any>`
  position: absolute;
  top: 4px;
  left: 4px;
  z-index: 6;
  display: flex;
  flex-direction: column;
  gap: 4px;
  pointer-events: none;
`

const Buff = styled.span<any>`
  font-family: Helvetica, sans-serif;
  font-size: 10px;
  font-weight: 700;
  color: ${Colors.blueLight};
  background: rgba(0, 0, 0, 0.55);
  border: 1px solid ${Colors.blueLight};
  border-radius: 4px;
  padding: 1px 5px;
`

const RelicBar = styled.div<any>`
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 6;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 3px;
  max-width: 46%;
`

const Relic = styled.span<any>`
  font-size: 15px;
  line-height: 1;
  background: rgba(0, 0, 0, 0.55);
  border: 1px solid ${Colors.yellow};
  border-radius: 5px;
  padding: 2px 3px;
  cursor: help;
`

const STAT_LABEL = { atq: 'ATQ', def: 'DEF', spd: 'SPD' }

const activeBuffs = (character) => {
  const combat = (character.activeEffects || [])
    .filter((effect) => effect.kind === 'buff' && effect.remaining > 0)
    .map((effect) => {
      const key = (effect.target || '').replace('stats.', '')
      return `${STAT_LABEL[key] || key} +${effect.amount} · ${effect.remaining}`
    })
  // Temporary ally boons (this floor only) are shown as buffs, not inventory.
  const boons = (character.boons || []).map((boon) => `${boon.glyph || ''} ${boon.description || ''}`.trim())
  return [...combat, ...boons]
}

export const Character = ({
  character,
  mobileHeight,
  isMobile,
  depth,
  player,
  action
}) => {
  const { isShowing, toggle } = useModal()
  const [floats, pushFloat] = useFloatingQueue()
  const [flash, setFlash] = useState(null)

  const actionId = action ? action.id : null
  useEffect(() => {
    if (action && action.id && action.texts && action.texts.length > 0) {
      pushFloat(action.texts)
      const tookDamage = action.texts.some((t) => t.text && t.text.startsWith('-'))
      setFlash({ id: action.id, tone: tookDamage ? 'hurt' : 'heal' })
    }
  }, [actionId]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
      <Wraper
        mobileHeight={mobileHeight}
        onClick={isMobile && !isShowing ? () => toggle() : null}
      >
        <PortraitArea>
          <Stats character={character} mobileHeight={mobileHeight}/>
          <FloatingLayer items={floats} />
          <Buffs>
            {activeBuffs(character).map((label) => (
              <Buff key={label}>{label}</Buff>
            ))}
          </Buffs>
          {(character.relics || []).length > 0 && (
            <RelicBar>
              {character.relics.map((relic) => (
                <Relic key={relic.id} title={`${relic.name} — ${relic.description}`}>
                  {relic.glyph || '✦'}
                </Relic>
              ))}
            </RelicBar>
          )}
          {flash && <HurtFlash key={flash.id} tone={flash.tone} />}
        </PortraitArea>
        {
          isMobile
            ? <Modal
              title={
                (
                  <>
                    Gold : {player.gold ? player.gold : '0'}
                    <br/>
                    Depth : {depth}
                  </>
                )
              }
              isShowing={isShowing}
              hide={toggle}
            >
              <Skills skills={character.skills} />
              <Inventory items={character.items} />
            </Modal>
            : (
              <>
                <Skills skills={character.skills} />
                <Inventory items={character.items} />
              </>
              )
        }
      </Wraper>
  )
}
Character.propTypes = {
  character: PropTypes.object,
  mobileHeight: PropTypes.number,
  isMobile: PropTypes.bool,
  depth: PropTypes.number,
  player: PropTypes.object,
  action: PropTypes.object
}
