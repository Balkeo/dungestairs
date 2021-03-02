import React from 'react'
import PropTypes from 'prop-types'
import { Gauge } from '../Gauge'
import styled from 'styled-components'

const Wraper = styled.div`
  width: 230px;
  height: 230px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0 auto;
  background-image: ${({ background }) => (`url(${background})`)};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  order: 2;
  @media only screen and (max-width: 768px) {
    width: ${({ mobileHeight }) => (mobileHeight !== null ? mobileHeight : 200)}px;
    height: ${({ mobileHeight }) => (mobileHeight !== null ? mobileHeight : 200)}px;
  }
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
      <Gauge value={character.hp} maxValue={character.maxHp} showValue={true} />
    </Wraper>
  )
}
Stats.propTypes = {
  character: PropTypes.object,
  mobileHeight: PropTypes.number
}
