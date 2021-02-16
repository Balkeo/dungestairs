import React from 'react'
import PropTypes from 'prop-types'
import Colors from '../../Helper/Colors'
import { Gauge } from '../Gauge'

export const Stats = ({
  character = {}
}) => {
  return (
    <div style={{ height: '256px', width: '256px' }}>
      <div style={{
        color: Colors.white75,
        height: '256px',
        width: '256px',
        display: 'flex',
        flexDirection: 'column-reverse',
        justifyContent: 'space-between',
        backgroundImage: `url(${character.profile})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }}>
        <Gauge value={character.hp} maxValue={character.maxHp} showValue={true} />
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
      </div>
    </div>
  )
}
Stats.propTypes = {
  character: PropTypes.object
}
