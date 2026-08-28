import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Colors from '../../Helper/Colors'

const Wrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 12px;
`

const Hint = styled.div`
  font-size: 11px;
  line-height: 14px;
  color: ${Colors.white30};
  margin-bottom: 6px;
  text-align: center;
`

const Bar = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
`

const SpellButton = styled.button`
  position: relative;
  min-width: 92px;
  box-sizing: border-box;
  padding: 8px 10px;
  border-radius: 8px;
  border: 2px solid ${({ selected }) => (selected ? Colors.yellow : Colors.black50)};
  background: ${({ disabled }) => (disabled ? Colors.carbon : Colors.background)};
  color: ${({ disabled }) => (disabled ? Colors.white20 : Colors.white75)};
  font-family: Helvetica, sans-serif;
  font-size: 12px;
  line-height: 14px;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  transition: all 0.2s ease-in-out;
  box-shadow: ${({ selected }) => (selected ? `0 0 8px ${Colors.yellow}` : 'none')};
  &:hover {
    border-color: ${({ disabled, selected }) => (disabled ? Colors.black50 : selected ? Colors.yellow : Colors.white50)};
  }
`

const SpellName = styled.div`
  font-weight: bold;
  color: ${({ disabled }) => (disabled ? Colors.white20 : Colors.white100)};
`

const Cooldown = styled.div`
  margin-top: 2px;
  font-size: 10px;
  color: ${({ ready }) => (ready ? Colors.green : Colors.red)};
`

export const SpellBar = ({
  character = {},
  queuedSpell = null,
  queueSpell = () => {}
}) => {
  const spells = character.spells || []
  const cooldowns = character.cooldowns || {}

  if (spells.length === 0) {
    return null
  }

  return (
    <Wrapper>
      <Hint>Select a spell, then click an enemy to cast it this round.</Hint>
      <Bar>
        {spells.map((spell) => {
          const remaining = cooldowns[spell.id] || 0
          const ready = remaining <= 0
          const selected = queuedSpell === spell.id
          return (
            <SpellButton
              key={spell.id}
              title={spell.description}
              selected={selected}
              disabled={!ready}
              onClick={() => ready && queueSpell(spell.id)}
            >
              <SpellName disabled={!ready}>{spell.name}</SpellName>
              <Cooldown ready={ready}>
                {ready ? 'Ready' : `${remaining} round${remaining > 1 ? 's' : ''}`}
              </Cooldown>
            </SpellButton>
          )
        })}
      </Bar>
    </Wrapper>
  )
}

SpellBar.propTypes = {
  character: PropTypes.object,
  queuedSpell: PropTypes.string,
  queueSpell: PropTypes.func
}
