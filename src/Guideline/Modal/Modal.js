import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Colors from '../../Helper/Colors'

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1040;
  background-color: ${Colors.black50};
`

const Wrapper = styled.div`
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

const _Modal = styled.div`
  z-index: 100;
  background-color: ${Colors.dark1};
  position: relative;
  margin: auto;
  border-radius: 5px;
  max-width: 500px;
  width: 80%;
  padding: 1rem;
`

const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const CloseButton = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  color: #000;
  cursor: pointer;
  border: none;
  background: transparent;
`

export const Modal = ({
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
  children: PropTypes.array,
  isShowing: PropTypes.bool.isRequired,
  hide: PropTypes.func.isRequired
}
