import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Colors from '../../Helper/Colors'
import { DISPLAY_FONT, BODY_FONT, parchmentFill } from '../../Guideline/theme'

const Wrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 12px;
`

const Hint = styled.div`
  font-family: ${BODY_FONT};
  font-size: 11px;
  line-height: 14px;
  color: ${({ active }) => (active ? Colors.goldLight : Colors.parchmentShade)};
  font-weight: ${({ active }) => (active ? 800 : 600)};
  margin-bottom: 6px;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
  transition: color 0.2s ease;
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
  border-radius: 10px;
  ${parchmentFill}
  border: 3px solid ${({ selected }) => (selected ? Colors.gold : Colors.woodDark)};
  color: ${Colors.ink};
  font-family: ${BODY_FONT};
  font-size: 12px;
  line-height: 14px;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  transition: transform 0.06s ease, filter 0.15s ease, box-shadow 0.15s ease;
  box-shadow: ${({ selected }) => (selected ? `0 0 10px ${Colors.gold}, 0 4px 0 0 ${Colors.woodDark}` : `0 4px 0 0 ${Colors.woodDark}`)};
  filter: ${({ disabled }) => (disabled ? 'grayscale(0.7) brightness(0.85)' : 'none')};
  opacity: ${({ disabled }) => (disabled ? 0.75 : 1)};
  &:not(:disabled):hover { filter: brightness(1.05); }
  &:not(:disabled):active { transform: translateY(3px); box-shadow: 0 1px 0 0 ${Colors.woodDark}; }
`

const SpellName = styled.div`
  font-family: ${DISPLAY_FONT};
  font-weight: 800;
  color: ${Colors.woodDark};
`

const Cooldown = styled.div`
  margin-top: 2px;
  font-size: 10px;
  font-weight: 700;
  color: ${({ ready }) => (ready ? '#2f7d4f' : Colors.ember)};
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

  const armed = spells.find((spell) => spell.id === queuedSpell)

  return (
    <Wrapper>
      <Hint active={!!armed}>
        {armed
          ? `▸ Clique un ennemi pour lancer ${armed.name}`
          : 'Choisis un sort, puis clique un ennemi pour le lancer.'}
      </Hint>
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
