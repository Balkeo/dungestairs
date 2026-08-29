import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Modal from '../Guideline/Modal'
import Colors from '../Helper/Colors'
import { DISPLAY_FONT } from '../Guideline/theme'

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: ${DISPLAY_FONT};
  font-size: 20px;
  font-weight: 800;
  color: ${Colors.woodDark};
`

const Text = styled.div`
  font-family: Helvetica, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: ${Colors.ink};
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
  border: 2px solid ${({ disabled }) => (disabled ? 'rgba(61,39,22,0.2)' : Colors.woodDark)};
  background: ${({ disabled }) => (disabled ? 'rgba(61,39,22,0.05)' : 'rgba(61,39,22,0.08)')};
  color: ${({ disabled }) => (disabled ? Colors.inkSoft : Colors.ink)};
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
