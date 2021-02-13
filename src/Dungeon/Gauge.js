import React from 'react'
import PropTypes from 'prop-types'

export const Gauge = ({
  actual = 0,
  max = 0
}) => {
  return (
        <progress
            max={max}
            value={actual}
            style={{
              width: '100%'
            }}
        />
  )
}
Gauge.propTypes = {
  actual: PropTypes.number,
  max: PropTypes.number
}
