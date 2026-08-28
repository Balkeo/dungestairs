import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Colors from '../../Helper/Colors'

const Wrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  color: ${Colors.white50};
`

const SectionTitle = styled.div`
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: ${Colors.white75};
  margin: 8px 0 4px;
`

const SpellList = styled.div`
  font-size: 11px;
  line-height: 15px;
  color: ${Colors.blue};
`

const Passive = styled.div`
  margin-bottom: 4px;
`

const PassiveName = styled.span`
  font-size: 11px;
  font-weight: bold;
  color: ${Colors.green};
`

const PassiveDesc = styled.span`
  font-size: 10px;
  line-height: 12px;
  color: ${Colors.white30};
`

export const ClassAbilities = ({
  spells = [],
  passives = []
}) => {
  if (spells.length === 0 && passives.length === 0) {
    return null
  }

  return (
    <Wrapper>
      {spells.length > 0 && (
        <>
          <SectionTitle>Spells</SectionTitle>
          <SpellList>{spells.map((spell) => spell.name).join(' · ')}</SpellList>
        </>
      )}
      {passives.length > 0 && (
        <>
          <SectionTitle>Passives</SectionTitle>
          {passives.map((passive) => (
            <Passive key={passive.id} title={passive.description}>
              <PassiveName>{passive.name}</PassiveName>{' '}
              <PassiveDesc>{passive.description}</PassiveDesc>
            </Passive>
          ))}
        </>
      )}
    </Wrapper>
  )
}

ClassAbilities.propTypes = {
  spells: PropTypes.array,
  passives: PropTypes.array
}
