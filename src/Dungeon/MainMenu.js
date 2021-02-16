import React from 'react'
import PropTypes from 'prop-types'
import { SelectCharacter } from './Character'
import Characters from './Character/Characters'

export const MainMenu = ({
  selectCharacter
}) => {
  return (
    <SelectCharacter characters={Characters} selectCharacter={selectCharacter}/>
  )
}
MainMenu.propTypes = {
  selectCharacter: PropTypes.func
}
