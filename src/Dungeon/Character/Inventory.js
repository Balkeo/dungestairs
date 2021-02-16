import React from 'react'
import PropTypes from 'prop-types'
import Colors from '../../Helper/Colors'

export const Inventory = ({
  items = {}
}) => {
  return (
    <div style={{ height: '256px', width: '256px', display: 'flex', flexDirection: 'column' }}>
      <div>Inventory :</div>
      <div>
        <div style={{ display: 'flex' }}>
          <div
            style={{
              width: '61px',
              height: '61px',
              backgroundColor: Colors.white75,
              marginRight: '4px',
              marginBottom: '4px'
            }}
          >
            { items.length > 0
              ? items.map((itemValue, itemOffset) => {
                return (
                  <div
                    key={itemOffset}
                    style={{
                      width: '61px',
                      height: '61px',
                      backgroundColor: Colors.white75,
                      marginRight: '4px',
                      marginBottom: '4px'
                    }}
                  >
                    { itemValue[itemOffset] ?? '' }
                  </div>
                )
              })
              : '' }
          </div>
        </div>
      </div>
    </div>
  )
}
Inventory.propTypes = {
  items: PropTypes.object
}
