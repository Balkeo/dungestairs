import React from 'react'
import PropTypes from 'prop-types'
import { Gauge } from '../Gauge'
import styled from 'styled-components'
import Colors from '../../Helper/Colors'

const Wraper = styled.div<any>`
  width: 230px;
  height: 230px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0 auto;
  background-color: ${({ background }) => (background ? Colors.parchment : Colors.parchmentDark)};
  background-image: ${({ background }) => (background ? `url(${background})` : 'none')};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  border: 3px solid ${Colors.woodDark};
  border-radius: 14px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.45), inset 0 0 0 2px ${Colors.parchmentDark};
  overflow: hidden;
  order: 2;
  @media only screen and (max-width: 768px) {
    width: min(64vw, 240px);
    height: min(64vw, 240px);
  }
`

const Portrait = styled.div<any>`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 96px;
  line-height: 1;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5));
`

export const Stats = ({
  character = ({} as any),
  mobileHeight
}) => {
  return (
    <Wraper background={character.icon} mobileHeight={mobileHeight}>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
        {
          Object.entries(character.stats).map(([stats, value]) => {
            return (
              <div
                key={stats}
                style={{ flex: 1, minWidth: 0, textAlign: 'center' }}
              >
                {stats} : {value}
              </div>
            )
          })
        }
      </div>
      {!character.icon && character.glyph ? <Portrait>{character.glyph}</Portrait> : null}
      <Gauge value={character.hp} maxValue={character.maxHp} showValue={true} />
    </Wraper>
  )
}
Stats.propTypes = {
  character: PropTypes.object,
  mobileHeight: PropTypes.number
}
