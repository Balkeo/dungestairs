import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Colors from '../../Helper/Colors'

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 8px;
  background: ${Colors.white5};
  border: 1px solid ${Colors.white10};
`

const Glyph = styled.div`
  font-size: 18px;
  line-height: 1;
  flex: 0 0 22px;
  text-align: center;
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1 1 auto;
`

const TopLine = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
`

const Name = styled.span`
  font-family: Helvetica, sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: ${({ tint }) => tint || Colors.white100};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Level = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${Colors.yellow};
  flex: 0 0 auto;
`

const Hint = styled.span`
  font-family: Helvetica, sans-serif;
  font-size: 10px;
  color: ${Colors.white50};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Buy = styled.button`
  flex: 0 0 auto;
  min-width: 58px;
  padding: 5px 8px;
  border-radius: 7px;
  border: none;
  font-family: Helvetica, sans-serif;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  color: ${({ disabled }) => (disabled ? Colors.white30 : Colors.white100)};
  background: ${({ disabled }) => (disabled ? Colors.white5 : Colors.green)};
  transition: filter 0.15s ease;
  &:hover { filter: ${({ disabled }) => (disabled ? 'none' : 'brightness(1.12)')}; }
`

export const UpgradeRow = ({ glyph, name, tint, level, hint, cost, canAfford = true, owned = true, onUpgrade }) => {
  const disabled = !owned || !canAfford
  return (
    <Row>
      <Glyph>{glyph}</Glyph>
      <Info>
        <TopLine>
          <Name tint={tint}>{name}</Name>
          <Level>Lv {level}</Level>
        </TopLine>
        {hint ? <Hint>{hint}</Hint> : null}
      </Info>
      <Buy disabled={disabled} onClick={() => !disabled && onUpgrade()} title={owned ? `Améliorer pour ${cost} or` : 'Débloque la classe d’abord'}>
        ⬆ {cost}
      </Buy>
    </Row>
  )
}

UpgradeRow.propTypes = {
  glyph: PropTypes.node,
  name: PropTypes.string,
  tint: PropTypes.string,
  level: PropTypes.number,
  hint: PropTypes.string,
  cost: PropTypes.number,
  canAfford: PropTypes.bool,
  owned: PropTypes.bool,
  onUpgrade: PropTypes.func
}
