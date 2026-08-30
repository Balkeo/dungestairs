import React from 'react'
import PropTypes from 'prop-types'

export const InventorySlot = ({
  children
}) => {
  return (
    <div
      style={{
        width: '55px',
        height: '55px'
      }}
    >
      { children }
    </div>
  )
}
InventorySlot.propTypes = {
  children: PropTypes.object
}
