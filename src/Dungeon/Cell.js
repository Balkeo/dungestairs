import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Gauge } from './Gauge'
import openedChest from '../Assets/Chest-opened.png'
import closedChest from '../Assets/Chest-closed.png'
import openedCell from '../Assets/Opened-Cell.jpg'
import closedCell from '../Assets/Closed-Cell.jpg'
import blocked from '../Assets/cant-open.png'
import Colors from '../Helper/Colors'

export const Cell = ({
  cellValue,
  onClick
}) => {
  const [isHovered, setHover] = useState(false)

  const handleMouseOver = () => {
    setHover(true)
  }
  const handleMouseOut = () => {
    setHover(false)
  }

  return (
        <div
            onClick={onClick}
            onMouseEnter={() => handleMouseOver()}
            onMouseLeave={() => handleMouseOut()}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: Colors.white75,
              fontSize: '1em',
              fontWeight: 'bold',
              fontFamily: 'Helvetica, sans-serif',
              cursor: (isHovered && cellValue.canClick) ? 'pointer' : 'default',
              width: '100px',
              height: '100px',
              backgroundImage: cellValue.isOpen ? `url(${openedCell})` : `url(${closedCell})`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover'
            }}
        >
            <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  width: '100%',
                  backgroundColor: !cellValue.isOpen && !cellValue.canClick ? 'rgba(0, 0, 0, 0.3)' : ''
                }}
            >
                <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      width: '100%',
                      backgroundColor: (isHovered && cellValue.canClick) ? 'rgba(255, 255, 255, 0.3)' : ''
                    }}
                >
                    <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column-reverse',
                          justifyContent: '',
                          alignItems: 'center',
                          height: '90%',
                          width: '90%',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: 'cover',
                          backgroundImage:
                                !cellValue.isOpen
                                  ? ''
                                  : cellValue.type === 'monster'
                                    ? `url(${cellValue.content.icon})`
                                    : cellValue.type === 'chest'
                                      ? cellValue.content > 0 ? `url(${closedChest})` : `url(${openedChest})`
                                      : ''
                        }}
                    >
                        {
                            !cellValue.isOpen
                              ? ''
                              : cellValue.type === 'monster'
                                ? <Gauge
                                        value={cellValue.content.hp}
                                        maxValue={cellValue.content.maxHp}
                                        showValue={false}
                                    />
                                : cellValue.type === 'chest'
                                  ? ''
                                  : cellValue.type === 'empty'
                                    ? ''
                                    : cellValue.type
                        }
                        {
                            cellValue.isBlocked
                              ? <div
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'column-reverse',
                                      justifyContent: '',
                                      alignItems: 'center',
                                      height: '90%',
                                      width: '90%',
                                      backgroundPosition: 'center',
                                      backgroundRepeat: 'no-repeat',
                                      backgroundSize: 'cover',
                                      backgroundImage: `url(${blocked})`
                                    }}>
                                </div>
                              : ''
                        }
                    </div>
                </div>
            </div>
        </div>
  )
}
Cell.propTypes = {
  cellValue: PropTypes.object,
  onClick: PropTypes.func
}
