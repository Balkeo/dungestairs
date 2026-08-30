import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Colors from '../../Helper/Colors'
import { BODY_FONT, DISPLAY_FONT } from '../../Guideline/theme'

const Row = styled.div<any>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 9px;
  background: rgba(61, 39, 22, 0.06);
  border: 1px solid rgba(61, 39, 22, 0.18);
`

const Glyph = styled.div<any>`
  font-size: 18px;
  line-height: 1;
  flex: 0 0 22px;
  text-align: center;
`

const Info = styled.div<any>`
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1 1 auto;
`

const TopLine = styled.div<any>`
  display: flex;
  align-items: baseline;
  gap: 6px;
`

const Name = styled.span<any>`
  font-family: ${BODY_FONT};
  font-size: 13px;
  font-weight: 800;
  color: ${({ tint }) => tint || Colors.ink};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Level = styled.span<any>`
  font-family: ${DISPLAY_FONT};
  font-size: 11px;
  font-weight: 800;
  color: ${Colors.wood};
  flex: 0 0 auto;
`

const Hint = styled.span<any>`
  font-family: ${BODY_FONT};
  font-size: 10px;
  font-weight: 600;
  color: ${Colors.inkSoft};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Buy = styled.button<any>`
  flex: 0 0 auto;
  min-width: 56px;
  padding: 5px 9px;
  border-radius: 8px;
  border: 2px solid ${({ disabled }) => (disabled ? 'rgba(61,39,22,0.25)' : Colors.woodDark)};
  font-family: ${DISPLAY_FONT};
  font-size: 12px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  color: ${({ disabled }) => (disabled ? Colors.inkSoft : Colors.woodDark)};
  background: ${({ disabled }) => (disabled ? 'rgba(61,39,22,0.08)' : `linear-gradient(180deg, ${Colors.goldLight}, ${Colors.gold})`)};
  box-shadow: ${({ disabled }) => (disabled ? 'none' : '0 3px 0 0 #a06a17')};
  transition: transform 0.06s ease, filter 0.15s ease;
  &:hover { filter: ${({ disabled }) => (disabled ? 'none' : 'brightness(1.06)')}; }
  &:not(:disabled):active { transform: translateY(2px); box-shadow: 0 1px 0 0 #a06a17; }
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
