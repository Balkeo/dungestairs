import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Colors from '../../Helper/Colors'

const HSeparator = styled.div`
  background-color: ${Colors.white75};
  width: 70%;
  height: 1px;
  margin: 15px auto;
`

const VSeparator = styled.div`
  background-color: ${Colors.white75};
  width: 1px;
`
const Separator = ({
  vertically
}) => {
  const returnOrientedSeparator = () => {
    if (vertically) {
      return <VSeparator />
    } else {
      return <HSeparator />
    }
  }

  return (
    returnOrientedSeparator()
  )
}
Separator.propTypes = {
  orientation: PropTypes.bool
}

export default Separator
