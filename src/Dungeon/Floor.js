import React from 'react'
import PropTypes from 'prop-types'
import Colors from '../Helper/Colors'
import styled from 'styled-components'
import useWindowDimensions from '../useWindowDimensions'
import { DISPLAY_FONT, woodFill } from '../Guideline/theme'

const Wraper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  @media only screen and (max-width: 768px) {
    flex-direction: column-reverse;
  }
`

const Information = styled.div`
  margin: 0 auto;
  ${woodFill}
  color: ${Colors.goldLight};
  font-family: ${DISPLAY_FONT};
  font-weight: 800;
  letter-spacing: 0.5px;
  font-size: 13px;
  line-height: 24px;
  height: 26px;
  border: 3px solid ${Colors.woodDark};
  border-bottom: none;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  padding: 2px 14px;
  text-shadow: 0 2px 0 rgba(0, 0, 0, 0.4);
  @media only screen and (max-width: 768px) {
    border-bottom: 3px solid ${Colors.woodDark};
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
  }
`

const Board = styled.div`
  box-sizing: border-box;
  display: grid;
  ${({ size }) => (`
    grid-template: repeat(${size}, minmax(0, 1fr)) / repeat(${size}, minmax(0, 1fr));
    width: ${size * 110}px;
    height: ${size * 110}px;
  `)}
  grid-gap: 8px;
  padding: 12px;
  ${woodFill}
  border: 4px solid ${Colors.woodDark};
  border-radius: 14px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5), inset 0 0 0 2px ${Colors.woodLight};
  margin: 0 auto;
  @media only screen and (max-width: 768px) {
    ${({ screenWidth }) => (`
      height: ${screenWidth}px;
      width: ${screenWidth}px;
    `)}
  }
`

export const Floor = ({ children, size, depth, player }) => {
  const { width } = useWindowDimensions()

  return (
      <Wraper>
        <Information>
            🪙 {player.gold ? player.gold : '0'}  ·  Profondeur {depth}
        </Information>
        <Board size={size} screenWidth={width}>
          {children}
        </Board>
      </Wraper>
  )
}
Floor.propTypes = {
  children: PropTypes.array,
  size: PropTypes.number,
  depth: PropTypes.number,
  player: PropTypes.object
}
