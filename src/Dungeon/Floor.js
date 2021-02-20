import React from 'react'
import PropTypes from 'prop-types'
import Colors from '../Helper/Colors'

export const Floor = ({ children, size, depth, player }) => {
  return (
      <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: '100%'
          }}
      >
        <div
            style={{
              margin: '0 auto',
              backgroundColor: Colors.carbon,
              color: Colors.white75,
              lineHeight: '20px',
              height: '20px',
              border: `1px solid ${Colors.carbon}`,
              borderTopLeftRadius: '10px',
              borderTopRightRadius: '10px',
              padding: '3px 5px'
            }}
        >
            Gold : {player.gold ? player.gold : '0'} | Depth : {depth}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplate: `repeat(${size}, 1fr) / repeat(${size}, 1fr)`,
            gridGap: '12px',
            width: `${size * 110}px`,
            height: `${size * 110}px`,
            padding: '12px',
            backgroundColor: Colors.carbon,
            margin: '0 auto'
          }}
        >
          {children}
        </div>
      </div>
  )
}
Floor.propTypes = {
  children: PropTypes.array,
  size: PropTypes.number,
  depth: PropTypes.number,
  player: PropTypes.object
}
