import React from 'react'
import PropTypes from 'prop-types'
import Colors from '../Helper/Colors'
import styled from 'styled-components'
import useWindowDimensions from '../useWindowDimensions'

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
  background-color: ${Colors.carbon};
  color: ${Colors.white75};
  line-height: 20px;
  height: 20px;
  border: 1px solid ${Colors.carbon};
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: 3px 5px;
  @media only screen and (max-width: 768px) {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    z-index: 2;
    display: none;
  }
`

const Board = styled.div`
  box-sizing: border-box;
  display: grid;
  ${({ size }) => (`
    grid-template: repeat(${size}, 1fr) / repeat(${size}, 1fr);
    width: ${size * 110}px;
    height: ${size * 110}px;
  `)}
  grid-gap: 10px;
  padding: 10px;
  background-color: ${Colors.carbon};
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
            Gold : {player.gold ? player.gold : '0'} | Depth : {depth}
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
