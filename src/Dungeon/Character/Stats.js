import React from 'react'
import PropTypes from 'prop-types'
import { Gauge } from '../Gauge'
import styled from 'styled-components'
import Colors from '../../Helper/Colors'

const Wraper = styled.div`
  width: 230px;
  height: 230px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0 auto;
  background-color: ${({ background }) => (background ? 'transparent' : Colors.background)};
  background-image: ${({ background }) => (background ? `url(${background})` : 'none')};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: ${({ background }) => (background ? '0' : '10px')};
  order: 2;
  @media only screen and (max-width: 768px) {
    width: ${({ mobileHeight }) => (mobileHeight !== null ? mobileHeight : 200)}px;
    height: ${({ mobileHeight }) => (mobileHeight !== null ? mobileHeight : 200)}px;
  }
`

const Portrait = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 96px;
  line-height: 1;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5));
`

export const Stats = ({
  character = {},
  mobileHeight
}) => {
  return (
    <Wraper background={character.icon} mobileHeight={mobileHeight}>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
        {
          Object.entries(character.stats).map(([stats, value]) => {
            return (
              <div
                key={stats}
                style={{ width: '85px' }}
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
