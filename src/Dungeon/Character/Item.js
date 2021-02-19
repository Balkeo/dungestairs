import React from 'react'
import PropTypes from 'prop-types'
import Colors from '../../Helper/Colors'

export const Item = ({
  item = {}
}) => {
  return (
    <div
      style={{
        width: '55px',
        height: '55px',
        backgroundColor: Colors.white75
      }}
    >
      { item.icon ?? '' }
    </div>
  )
}
Item.propTypes = {
  item: PropTypes.object
}
