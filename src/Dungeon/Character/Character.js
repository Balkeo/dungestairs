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
  background-color: ${Colors.green};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 256px;
  @media only screen and (max-width: 768px) {
    flex-direction: row;
    width: 100%;
    overflow: scroll;
    height: ${({ mobileHeight }) => (mobileHeight)};
    background-color: ${Colors.brown1};
    color: ${Colors.white50}
  }
`

export const Character = ({
  character,
  mobileHeight,
  isMobile
}) => {
  const { isShowing, toggle } = useModal()

  return (
      <Wraper
        mobileHeight={mobileHeight}
        onClick={isMobile ? () => toggle() : null}
      >
          <Stats character={character} mobileHeight={mobileHeight}/>
        {
          isMobile
            ? <Modal
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
  isMobile: PropTypes.bool
}
