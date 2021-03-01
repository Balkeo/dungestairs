import React from 'react'
import PropTypes from 'prop-types'
import { SelectCharacter } from './Character'
import { Player } from './Player'
import styled from 'styled-components'

const Wraper = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-between;
`

export const MainMenu = ({
  player,
  selectCharacter,
  buyCharacter,
  upgradeCharacterSkill
}) => {
  return (
    <Wraper>
      <Player player={player}/>
      <SelectCharacter characters={player.characters} selectCharacter={selectCharacter} buyCharacter={buyCharacter} upgradeCharacterSkill={upgradeCharacterSkill}/>
    </Wraper>
  )
}
MainMenu.propTypes = {
  player: PropTypes.object,
  selectCharacter: PropTypes.func,
  buyCharacter: PropTypes.func,
  upgradeCharacterSkill: PropTypes.func
}
