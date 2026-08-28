import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Colors from '../../Helper/Colors'
import { rarityColor } from '../../Content/rarity'

const Slot = styled.div`
  width: 55px;
  height: 55px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 26px;
  border-radius: 6px;
  box-sizing: border-box;
  background: ${({ filled }) => (filled ? Colors.background : Colors.white10)};
  border: 2px solid ${({ filled, tint }) => (filled ? tint : Colors.white10)};
  box-shadow: ${({ filled, tint }) => (filled ? `0 0 8px ${tint}` : 'none')};
  cursor: ${({ filled }) => (filled ? 'help' : 'default')};
`

export const Item = ({
  item = null
}) => {
  if (!item) {
    return <Slot filled={false} />
  }
  const tint = rarityColor(item.rarity)
  return (
    <Slot filled tint={tint} title={`${item.name} — ${item.description}`}>
      {item.glyph || item.icon || '❔'}
    </Slot>
  )
}

Item.propTypes = {
  item: PropTypes.object
}
