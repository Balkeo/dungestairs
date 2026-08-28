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

const Wraper = styled.div`
  box-sizing: border-box;
  background-color: ${Colors.brown1};
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

const PortraitArea = styled.div`
  position: relative;
  display: flex;
  order: 2;
`

const HurtFlash = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 6;
  background: ${({ tone }) => (tone === 'heal'
    ? 'radial-gradient(circle, rgba(46,201,115,0.5) 0%, rgba(46,201,115,0) 70%)'
    : 'radial-gradient(circle, rgba(255,45,85,0.5) 0%, rgba(255,45,85,0) 70%)')};
  ${css`animation: ${flashRed} 0.45s ease-out forwards;`}
`

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
