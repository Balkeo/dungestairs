import * as React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Colors from '../Helper/Colors'
import DashedSeparator from './DashedSeparator'

const Tooltip = styled.div`
  position: relative;
  bottom: -65px;
  transition: opacity 0.2s ease-in-out, margin 0.2s ease-in-out;
  opacity: ${({ isVisible }) => (isVisible ? '1' : '0')};
  margin-top: ${({ isVisible }) => (isVisible ? '0' : '-200px')};
`

const Wrapper = styled.div`
  min-width: 190px;
  padding: 15px;
  box-shadow: 0 0 8px 0 ${Colors.black50};
  background-color: ${Colors.background};
  border-radius: 8px;
`

const Row = styled.div`
  min-height: 24px;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  text-align: center;
`

const Name = styled.div`
  font-size: 20px;
  line-height: 24px;
  color: ${Colors.white100};
`

const Details = styled.div`
  font-size: 12px;
  line-height: 1.17;
  color: ${Colors.white30};
`
const Separator = styled(DashedSeparator)`
  margin-top: 15px;
  margin-bottom: 15px;
`

const ToolTip = ({
  tooltipId,
  isVisible,
  name,
  details
}) => {
  return (
    <Tooltip
      id={tooltipId}
      isVisible={isVisible}
    >
      <Wrapper>
        <Row>
          <Name>{name}</Name>
        </Row>
        <Separator/>
        <Row>
          <Details>{details}</Details>
        </Row>
      </Wrapper>
    </Tooltip>
  )
}
ToolTip.propTypes = {
  tooltipId: PropTypes.any,
  isVisible: PropTypes.bool,
  name: PropTypes.string,
  details: PropTypes.string
}

export default ToolTip
