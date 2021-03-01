// @flow

import React from 'react'
import PropTypes from 'prop-types'
import { PLAYER_TYPE } from './Content/constant'
import styled from 'styled-components'
import Colors from '../Helper/Colors'
import Coin from '../Assets/Coin.png'

const Wraper = styled.div`
  box-sizing: border-box;
  width: 72px;
  height: 100%;
  padding: 16px;
  box-shadow: 1px 0 0 0 ${Colors.carbon};
  background-color: ${Colors.brown2};
  display: flex;
  flex-direction: column;
  color: ${Colors.white50};
  @media only screen and (max-width: 768px) {
    height: 100%;
  }
`

const Label = styled.span`
  width: 55px;
  height: 55px;
  font-size: 15px;
  background: ${({ background }) => (background !== null ? `url(${background})` : '')};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  line-height: 55px;
  color: ${({ fontColor }) => (fontColor !== null ? fontColor : Colors.white50)};
`

type Props = {
  player: PLAYER_TYPE
}

export const Player = ({
  player
}: Props) => {
  return (
    <Wraper>
      <Label
        background={Coin}
        fontColor={Colors.black100}
      >
        {player.gold}
      </Label>
      <Label>
        Last : {player.depth.previous}
      </Label>
      <Label>
        Best : {player.depth.max}
      </Label>
    </Wraper>
  )
}
Player.propTypes = {
  player: PropTypes.object
}
