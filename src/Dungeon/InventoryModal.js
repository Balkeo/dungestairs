import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Modal from '../Guideline/Modal'
import Colors from '../Helper/Colors'
import { rarityColor } from '../Content/rarity'

const Title = styled.div`
  font-family: Helvetica, sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: ${Colors.white100};
`

const StatRow = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 8px;
  margin: 14px 0;
  font-family: Helvetica, sans-serif;
  color: ${Colors.white75};
  font-size: 14px;
`

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StatValue = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${Colors.white100};
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 6px;
  max-height: 46vh;
  overflow-y: auto;
`

const Section = styled.div`
  font-family: Helvetica, sans-serif;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${Colors.yellow};
  margin: 6px 0 2px;
`

const Line = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 9px;
  border: 2px solid ${({ tint }) => tint};
  border-radius: 8px;
  background: ${Colors.background};
`

const Glyph = styled.div`
  font-size: 22px;
  flex: 0 0 26px;
  text-align: center;
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`

const Name = styled.div`
  font-family: Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: ${({ tint }) => tint};
`

const Desc = styled.div`
  font-family: Helvetica, sans-serif;
  font-size: 12px;
  color: ${Colors.white50};
`

const Empty = styled.div`
  font-family: Helvetica, sans-serif;
  font-size: 14px;
  color: ${Colors.white50};
  text-align: center;
  padding: 20px 0;
`

const Count = styled.span`
  font-size: 13px;
  color: ${Colors.white50};
  font-weight: 400;
  margin-left: 8px;
`

export const InventoryModal = ({ isShowing, hide, character = {} }) => {
  const items = (character.items || []).filter(Boolean)
  const relics = (character.relics || []).filter(Boolean)
  const stats = character.stats || {}
  const title = (
    <Title>
      🎒 Équipement<Count>{items.length}/8</Count>
    </Title>
  )
  return (
    <Modal title={title} isShowing={isShowing} hide={hide}>
      <StatRow>
        <Stat><StatValue>{character.hp ?? 0}/{character.maxHp ?? 0}</StatValue>PV</Stat>
        <Stat><StatValue>{stats.atq ?? 0}</StatValue>ATQ</Stat>
        <Stat><StatValue>{stats.def ?? 0}</StatValue>DEF</Stat>
        <Stat><StatValue>{stats.spd ?? 0}</StatValue>SPD</Stat>
      </StatRow>
      <List>
        {items.length === 0 && <Empty>Aucun objet équipé pour l’instant.</Empty>}
        {items.map((item, index) => {
          const tint = rarityColor(item.rarity)
          return (
            <Line key={index} tint={tint}>
              <Glyph>{item.glyph || item.icon || '❔'}</Glyph>
              <Info>
                <Name tint={tint}>{item.name}</Name>
                <Desc>{item.description}</Desc>
              </Info>
            </Line>
          )
        })}
        {relics.length > 0 && <Section>✦ Reliques ({relics.length})</Section>}
        {relics.map((relic, index) => {
          const tint = rarityColor(relic.rarity)
          return (
            <Line key={`relic-${index}`} tint={tint}>
              <Glyph>{relic.glyph || '✦'}</Glyph>
              <Info>
                <Name tint={tint}>{relic.name}</Name>
                <Desc>{relic.description}</Desc>
              </Info>
            </Line>
          )
        })}
      </List>
    </Modal>
  )
}

InventoryModal.propTypes = {
  isShowing: PropTypes.bool.isRequired,
  hide: PropTypes.func.isRequired,
  character: PropTypes.object
}
