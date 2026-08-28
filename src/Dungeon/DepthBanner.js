import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import Colors from '../Helper/Colors'
import { bannerPop } from '../Guideline/animations'

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  z-index: 50;
`

const Banner = styled.div`
  text-align: center;
  color: ${Colors.yellow};
  font-family: Helvetica, Arial, sans-serif;
  text-shadow: 0 3px 10px rgba(0, 0, 0, 0.8);
  ${css`animation: ${bannerPop} 1.3s ease-out forwards;`}
`

const Big = styled.div`
  font-size: 64px;
  font-weight: 900;
  line-height: 1;
  @media only screen and (max-width: 768px) {
    font-size: 44px;
  }
`

const Small = styled.div`
  margin-top: 8px;
  font-size: 20px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: ${Colors.white75};
`

export const DepthBanner = ({ banner }) => {
  const [current, setCurrent] = useState(null)

  useEffect(() => {
    if (!banner || !banner.id) {
      return
    }
    setCurrent(banner)
    const timer = setTimeout(() => setCurrent(null), 1300)
    return () => clearTimeout(timer)
  }, [banner ? banner.id : null]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!current) {
    return null
  }

  return (
    <Overlay>
      <Banner key={current.id}>
        <Small>Descending</Small>
        <Big>🗝️ Depth {current.depth}</Big>
      </Banner>
    </Overlay>
  )
}

DepthBanner.propTypes = {
  banner: PropTypes.object
}
