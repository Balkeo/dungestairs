import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Modal from '../Guideline/Modal'
import Colors from '../Helper/Colors'
import { rarityColor } from '../Content/rarity'
import { itemPrice } from '../Helper/shop'

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: Helvetica, sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: ${Colors.white100};
`

const Gold = styled.span`
  margin-left: auto;
  font-size: 15px;
  color: ${Colors.yellow};
`

const Tabs = styled.div`
  display: flex;
  gap: 6px;
  margin: 12px 0 4px;
`

const Tab = styled.button`
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid ${({ active }) => (active ? Colors.white30 : Colors.white10)};
  background: ${({ active }) => (active ? Colors.white10 : 'transparent')};
  color: ${({ active }) => (active ? Colors.white100 : Colors.white50)};
  font-family: Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 10px 0 6px;
`

const Offer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 10px;
  border: 2px solid ${({ tint }) => tint};
  border-radius: 8px;
  background: ${Colors.background};
  opacity: ${({ dimmed }) => (dimmed ? 0.45 : 1)};
`

const Glyph = styled.div`
  font-size: 26px;
  line-height: 1;
  flex: 0 0 30px;
  text-align: center;
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`

const ItemName = styled.div`
  font-family: Helvetica, sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: ${({ tint }) => tint};
`

const Desc = styled.div`
  font-family: Helvetica, sans-serif;
  font-size: 12px;
  color: ${Colors.white50};
`

const ActionButton = styled.button`
  margin-left: auto;
  flex: 0 0 auto;
  min-width: 78px;
  padding: 7px 10px;
  border-radius: 8px;
  border: none;
  font-family: Helvetica, sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  color: ${({ disabled }) => (disabled ? Colors.white50 : Colors.white100)};
  background: ${({ disabled, tone }) => (disabled ? Colors.white10 : tone === 'sell' ? Colors.yellow : Colors.green)};
  ${({ tone, disabled }) => tone === 'sell' && !disabled && `color: ${Colors.black100};`}
  transition: filter 0.15s ease;
  &:hover { filter: ${({ disabled }) => (disabled ? 'none' : 'brightness(1.1)')}; }
`

const Empty = styled.div`
  font-family: Helvetica, sans-serif;
  font-size: 14px;
  color: ${Colors.white50};
  text-align: center;
  padding: 18px 0;
`

const Hint = styled.div`
  font-family: Helvetica, sans-serif;
  font-size: 12px;
  color: ${Colors.white50};
  text-align: center;
  margin-top: 4px;
`

const sellValue = (item) => Math.max(1, Math.floor(itemPrice(item) / 2))

const buyLabel = (offer, gold, bagFull) => {
  if (offer.sold) return 'Acheté'
  if (bagFull) return 'Sac plein'
  if (gold < offer.price) return `${offer.price} 🪙`
  return `Acheter ${offer.price} 🪙`
}

export const Shop = ({ shop, gold = 0, bagFull = false, bag = [], onBuy, onSell, onClose }) => {
  const isShowing = !!shop
  const [tab, setTab] = useState('buy')
  useEffect(() => { if (isShowing) setTab('buy') }, [isShowing])

  const offers = shop ? shop.items : []
  const items = bag.filter(Boolean)
  const soldOut = offers.length > 0 && offers.every((o) => o.sold)

  const title = (
    <Title>
      <span>🧪 Marchand</span>
      <Gold>Or : {gold} 🪙</Gold>
    </Title>
  )

  return (
    <Modal title={title} isShowing={isShowing} hide={onClose}>
      <Tabs>
        <Tab active={tab === 'buy'} onClick={() => setTab('buy')}>Acheter</Tab>
        <Tab active={tab === 'sell'} onClick={() => setTab('sell')}>Vendre ({items.length})</Tab>
      </Tabs>

      {tab === 'buy' && (
        <>
          <List>
            {offers.length === 0 && <Empty>Le marchand n’a rien à vendre ici.</Empty>}
            {offers.map((offer, index) => {
              const tint = rarityColor(offer.rarity)
              const disabled = offer.sold || bagFull || gold < offer.price
              return (
                <Offer key={index} tint={tint} dimmed={offer.sold}>
                  <Glyph>{offer.glyph || '❔'}</Glyph>
                  <Info>
                    <ItemName tint={tint}>{offer.name}</ItemName>
                    <Desc>{offer.description}</Desc>
                  </Info>
                  <ActionButton tone="buy" disabled={disabled} onClick={() => !disabled && onBuy(index)}>
                    {buyLabel(offer, gold, bagFull)}
                  </ActionButton>
                </Offer>
              )
            })}
          </List>
          {bagFull && <Hint>Ton sac est plein (8 objets) — vends-en pour faire de la place.</Hint>}
          {soldOut && !bagFull && <Hint>Le marchand est en rupture de stock.</Hint>}
        </>
      )}

      {tab === 'sell' && (
        <List>
          {items.length === 0 && <Empty>Ton sac est vide — rien à vendre.</Empty>}
          {items.map((item, index) => {
            const tint = rarityColor(item.rarity)
            return (
              <Offer key={index} tint={tint}>
                <Glyph>{item.glyph || item.icon || '❔'}</Glyph>
                <Info>
                  <ItemName tint={tint}>{item.name}</ItemName>
                  <Desc>{item.description}</Desc>
                </Info>
                <ActionButton tone="sell" onClick={() => onSell(index)}>
                  Vendre {sellValue(item)} 🪙
                </ActionButton>
              </Offer>
            )
          })}
        </List>
      )}
    </Modal>
  )
}

Shop.propTypes = {
  shop: PropTypes.object,
  gold: PropTypes.number,
  bagFull: PropTypes.bool,
  bag: PropTypes.array,
  onBuy: PropTypes.func,
  onSell: PropTypes.func,
  onClose: PropTypes.func
}
