import React from 'react'
import PropTypes from 'prop-types'
import Colors from '../../Helper/Colors'
import { Inventory } from './Inventory'
import { Skills } from './Skills'
import { Stats } from './Stats'
import styled from 'styled-components'
import Modal, { useModal } from '../../Guideline/Modal'

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

export const Character = ({
  character,
  mobileHeight,
  isMobile,
  depth,
  player
}) => {
  const { isShowing, toggle } = useModal()

  return (
      <Wraper
        mobileHeight={mobileHeight}
        onClick={isMobile && !isShowing ? () => toggle() : null}
      >
        <Stats character={character} mobileHeight={mobileHeight}/>
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
  player: PropTypes.object
}
