import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Gauge } from './Gauge'
import openedChest from '../Assets/Chest-opened.png'
import closedChest from '../Assets/Chest-closed.png'
import openedCell from '../Assets/Opened-Cell.jpg'
import closedCell from '../Assets/Closed-Cell.jpg'
import blocked from '../Assets/cant-open.png'
import Colors from '../Helper/Colors'
import styled from 'styled-components'

const Wraper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${Colors.white75};
  font: 1em;
  font-weight: bold;
  font-family: Helvetica, sans-serif;
  cursor: ${({ isHovered, cellValue }) => ((isHovered && cellValue.canClick) ? 'pointer' : 'default')};
  width: 100%;
  height: 100%;
  background-image: ${({ cellValue }) => (
    cellValue.isOpen ? `url(${openedCell})` : `url(${closedCell})`
  )};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`

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
        <Wraper
            onClick={onClick}
            onMouseEnter={() => handleMouseOver()}
            onMouseLeave={() => handleMouseOut()}
            isHovered={isHovered}
            cellValue={cellValue}
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
        </Wraper>
  )
}
Cell.propTypes = {
  cellValue: PropTypes.object,
  onClick: PropTypes.func,
  boardSize: PropTypes.number,
  screenWidth: PropTypes.number
}
