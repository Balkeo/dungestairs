import React from 'react'
import PropTypes from 'prop-types'
import Colors from '../../Helper/Colors'

export const InventorySlot = ({
  children
}) => {
  return (
    <div
      style={{
        width: '55px',
        height: '55px',
        backgroundColor: Colors.white75
      }}
    >
      { children }
    </div>
  )
}
InventorySlot.propTypes = {
  children: PropTypes.object
}
