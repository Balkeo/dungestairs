import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Colors from '../../Helper/Colors'
import { rarityColor } from '../../Content/rarity'

const Slot = styled.div<any>`
  width: 55px;
  height: 55px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 26px;
  border-radius: 8px;
  box-sizing: border-box;
  background: ${({ filled }) => (filled ? Colors.parchment : 'rgba(0,0,0,0.28)')};
  border: 2px solid ${({ filled, tint }) => (filled ? tint : Colors.woodLight)};
  box-shadow: ${({ filled, tint }) => (filled ? `0 0 8px ${tint}, inset 0 2px 4px rgba(255,255,255,0.4)` : 'inset 0 3px 8px rgba(0,0,0,0.5)')};
  cursor: ${({ filled }) => (filled ? 'help' : 'default')};
`

const inkTint = (rarity) => (rarity === 'common' ? Colors.woodDark : rarityColor(rarity))

export const Item = ({
  item = null
}) => {
  if (!item) {
    return <Slot filled={false} />
  }
  const tint = inkTint(item.rarity)
  return (
    <Slot filled tint={tint} title={`${item.name} — ${item.description}`}>
      {item.glyph || item.icon || '❔'}
    </Slot>
  )
}

Item.propTypes = {
  item: PropTypes.object
}
