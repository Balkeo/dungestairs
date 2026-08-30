import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Colors from '../Helper/Colors'
import Coin from '../Assets/Coin.png'
import { woodFill, DISPLAY_FONT } from '../Guideline/theme'

const Wraper = styled.div<any>`
  box-sizing: border-box;
  width: 72px;
  height: 100%;
  ${woodFill}
  border-right: 3px solid ${Colors.woodDark};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding-top: 10px;
  font-family: ${DISPLAY_FONT};
  font-weight: 800;
  color: ${Colors.goldLight};
`

const Label = styled.span<any>`
  width: 55px;
  height: 55px;
  font-size: 15px;
  background: ${({ background }) => (background !== null ? `url(${background})` : '')};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  line-height: 55px;
  color: ${({ fontColor }) => (fontColor !== null ? fontColor : Colors.white50)};
  margin: 0 auto;
`

export const Player = ({
  player
}) => {
  return (
    <Wraper>
      <Label
        background={Coin}
        fontColor={Colors.black100}
      >
        {player.gold}
      </Label>
      <Label>
        {player.depth.previous}
      </Label>
      <Label>
        {player.depth.max}
      </Label>
    </Wraper>
  )
}
Player.propTypes = {
  player: PropTypes.object
}
