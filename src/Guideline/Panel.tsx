import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Colors from '../Helper/Colors'
import { parchmentFill, woodFill, DISPLAY_FONT, BODY_FONT } from './theme'

const Frame = styled.div<any>`
  position: relative;
  ${parchmentFill}
  color: ${Colors.ink};
  font-family: ${BODY_FONT};
  border: 3px solid ${Colors.woodDark};
  border-radius: 16px;
  box-shadow:
    0 10px 26px rgba(0, 0, 0, 0.45),
    inset 0 0 0 2px ${Colors.parchmentDark},
    inset 0 2px 10px rgba(255, 255, 255, 0.35),
    inset 0 -8px 18px rgba(120, 85, 45, 0.28);
  overflow: hidden;
`

const Ribbon = styled.div<any>`
  ${woodFill}
  color: ${Colors.goldLight};
  font-family: ${DISPLAY_FONT};
  font-weight: 800;
  letter-spacing: 1px;
  font-size: 15px;
  text-align: center;
  padding: 8px 12px;
  border-bottom: 3px solid ${Colors.woodDark};
  text-shadow: 0 2px 0 rgba(0, 0, 0, 0.45);
`

const Body = styled.div<any>`
  padding: ${({ pad }) => (pad === false ? '0' : '14px 16px')};
`

export const Panel = ({ title, children, pad, className, style }) => {
  return (
    <Frame className={className} style={style}>
      {title ? <Ribbon>{title}</Ribbon> : null}
      <Body pad={pad}>{children}</Body>
    </Frame>
  )
}

Panel.propTypes = {
  title: PropTypes.node,
  children: PropTypes.node,
  pad: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object
}
