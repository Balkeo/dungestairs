import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Modal from '../Guideline/Modal'
import Colors from '../Helper/Colors'

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: Helvetica, sans-serif;
  font-size: 20px;
  font-weight: 800;
  color: ${Colors.white100};
`

const Text = styled.div`
  font-family: Helvetica, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: ${Colors.white75};
  margin: 12px 2px 14px;
`

const Choices = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Choice = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid ${({ disabled }) => (disabled ? Colors.white10 : Colors.white30)};
  background: ${({ disabled }) => (disabled ? Colors.white5 : Colors.dark1)};
  color: ${({ disabled }) => (disabled ? Colors.white30 : Colors.white100)};
  font-family: Helvetica, sans-serif;
  font-size: 15px;
  font-weight: 700;
  text-align: left;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  transition: filter 0.15s ease, border-color 0.15s ease;
  &:hover {
    filter: ${({ disabled }) => (disabled ? 'none' : 'brightness(1.15)')};
    border-color: ${({ disabled }) => (disabled ? Colors.white10 : Colors.yellow)};
  }
`

export const EventModal = ({ event, gold = 0, onChoose, onClose }) => {
  const isShowing = !!event
  const def = event ? event.def : null
  const title = def ? (
    <Title><span>{def.glyph || '❓'}</span><span>{def.title}</span></Title>
  ) : null

  return (
    <Modal title={title} isShowing={isShowing} hide={onClose}>
      {def && (
        <>
          <Text>{def.text}</Text>
          <Choices>
            {def.choices.map((choice, index) => {
              const disabled = choice.cost ? gold < choice.cost : false
              return (
                <Choice key={index} disabled={disabled} onClick={() => !disabled && onChoose(index)}>
                  {choice.label}
                  {choice.cost && gold < choice.cost ? ' — or insuffisant' : ''}
                </Choice>
              )
            })}
          </Choices>
        </>
      )}
    </Modal>
  )
}

EventModal.propTypes = {
  event: PropTypes.object,
  gold: PropTypes.number,
  onChoose: PropTypes.func,
  onClose: PropTypes.func
}
