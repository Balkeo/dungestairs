import React from 'react'
import PropTypes from 'prop-types'

export const Gauge = ({
  value = 0,
  maxValue = 0,
  showValue = false
}) => {
  return (
    <div
      style={{
        width: '100%',
        height: '20px',
        position: 'relative'
      }}
    >
      <progress
        max={maxValue}
        value={value}
        style={{
          width: '100%',
          height: '20px'
        }}
      />
      {showValue
        ? <div
        style={{
          position: 'absolute',
          top: '0',
          width: '100%',
          height: '20px'
        }}
      >
        {value} / {maxValue}
      </div>
        : ''}
    </div>
  )
}
Gauge.propTypes = {
  value: PropTypes.number.isRequired,
  maxValue: PropTypes.number.isRequired,
  showValue: PropTypes.bool
}
