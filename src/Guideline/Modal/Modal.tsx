import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Colors from '../../Helper/Colors'
import { parchmentFill, BODY_FONT } from '../theme'

const ModalOverlay = styled.div<any>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1040;
  background-color: ${Colors.black50};
  backdrop-filter: blur(8px);
`

const Wrapper = styled.div<any>`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1050;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  outline: 0;
  display: flex;
  align-items: center;
`

const _Modal = styled.div<any>`
  z-index: 100;
  ${parchmentFill}
  color: ${Colors.ink};
  font-family: ${BODY_FONT};
  position: relative;
  margin: auto;
  border: 3px solid ${Colors.woodDark};
  border-radius: 16px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.6), inset 0 0 0 2px ${Colors.parchmentDark};
  max-width: 500px;
  width: 80%;
  padding: 1rem 1.1rem 1.2rem;
`

const Header = styled.div<any>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${Colors.ink};
  border-bottom: 2px solid rgba(61, 39, 22, 0.2);
  padding-bottom: 8px;
  margin-bottom: 4px;
`

const CloseButton = styled.div<any>`
  font-size: 1.4rem;
  font-weight: 800;
  line-height: 1;
  color: ${Colors.woodDark};
  cursor: pointer;
  border: none;
  background: transparent;
  &:hover { color: ${Colors.ember}; }
`

export const Modal = ({
  title,
  children,
  isShowing,
  hide
}) => {
  return (
    isShowing
      ? ReactDOM.createPortal(
    <ModalOverlay>
      <Wrapper>
        <_Modal>
          <Header>
            {
              title !== null
                ? title
                : (<div />)
            }
            <CloseButton onClick={hide}>
              <span>&times;</span>
            </CloseButton>
          </Header>
          <div>
            {children}
          </div>
        </_Modal>
      </Wrapper>
    </ModalOverlay>,
    document.body
      )
      : null
  )
}
Modal.propTypes = {
  title: PropTypes.object,
  children: PropTypes.node,
  isShowing: PropTypes.bool.isRequired,
  hide: PropTypes.func.isRequired
}
