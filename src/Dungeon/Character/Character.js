import React from 'react'
import PropTypes from 'prop-types'
import Colors from '../../Helper/Colors'
import { Inventory } from './Inventory'
import { Skills } from './Skills'
import { Stats } from './Stats'

export const Character = ({
  character
}) => {
  return (
      <div style={style}>
          <Stats character={character}/>
          <Skills skills={character.skills}/>
          <Inventory items={character.items}/>
      </div>
  )
}
Character.propTypes = {
  character: PropTypes.object
}

const style = {
  backgroundColor: Colors.green,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-evenly',
  width: '256px',
  zIndex: 5
}
