import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { Gauge } from './Gauge'
import openedCell from '../Assets/Opened-Cell.jpg'
import closedCell from '../Assets/Closed-Cell.jpg'
import Colors from '../Helper/Colors'
import { CELL_GLYPHS, CHEST_EMPTY_GLYPH } from '../Content/glyphs'
import { FloatingLayer, useFloatingQueue } from '../Guideline/FloatingText'
import { breathe, shakeHit, flashRed, poof, revealIn, glowPulse } from '../Guideline/animations'

const Wraper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${Colors.white75};
  font-weight: bold;
  font-family: Helvetica, sans-serif;
  cursor: ${({ isHovered, cellValue }) => ((isHovered && cellValue.canClick) ? 'pointer' : 'default')};
  width: 100%;
  height: 100%;
  background-image: ${({ cellValue }) => (cellValue.isOpen ? `url(${openedCell})` : `url(${closedCell})`)};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`

const Content = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background-color: ${({ dim, highlight }) => (highlight ? 'rgba(255,255,255,0.22)' : dim ? 'rgba(0,0,0,0.3)' : 'transparent')};
  transition: background-color 0.2s ease;
  ${({ revealing }) => revealing && css`animation: ${revealIn} 0.35s ease both;`}
`

const glyphBase = css`
  font-size: 42px;
  line-height: 1;
  filter: drop-shadow(0 3px 3px rgba(0, 0, 0, 0.55));
  user-select: none;
  @media only screen and (max-width: 768px) {
    font-size: 26px;
  }
`

const Glyph = styled.span`
  ${glyphBase}
  ${({ big }) => big && css`
    font-size: 60px;
    filter: drop-shadow(0 0 8px rgba(255, 80, 80, 0.7));
    @media only screen and (max-width: 768px) { font-size: 38px; }
  `}
  ${({ variant }) => variant === 'idle' && css`animation: ${breathe} 2.4s ease-in-out infinite;`}
  ${({ variant }) => variant === 'key' && css`animation: ${glowPulse} 1.6s ease-in-out infinite;`}
  ${({ variant }) => variant === 'dead' && css`animation: ${poof} 0.6s ease-in forwards;`}
`

const ShakeWrap = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ shaking }) => shaking && css`animation: ${shakeHit} 0.4s ease;`}
`

const RedFlash = styled.div`
  position: absolute;
  inset: -20%;
  border-radius: 50%;
  background: radial-gradient(circle, ${Colors.red} 0%, rgba(255, 45, 85, 0) 70%);
  animation: ${flashRed} 0.4s ease-out forwards;
  pointer-events: none;
`

const GaugeWrap = styled.div`
  position: absolute;
  bottom: 4px;
  left: 8%;
  width: 84%;
`

const Blocked = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  font-size: 22px;
  z-index: 2;
  &::after {
    content: '🔒';
    opacity: 0.85;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.7));
  }
  @media only screen and (max-width: 768px) {
    font-size: 16px;
  }
`

const resolveGlyph = (cellValue) => {
  if (!cellValue.isOpen) {
    return null
  }
  const { type, content } = cellValue
  if (type === 'monster' && content) {
    return content.glyph || '👾'
  }
  if (type === 'chest') {
    return content > 0 ? CELL_GLYPHS.chest : CHEST_EMPTY_GLYPH
  }
  return CELL_GLYPHS[type] || null
}

export const Cell = ({ cellValue, onClick, action }) => {
  const [isHovered, setHover] = useState(false)
  const [hitPulse, setHitPulse] = useState(0)
  const [floats, pushFloat] = useFloatingQueue()

  const isMonster = cellValue.type === 'monster'
  const monsterHp = isMonster && cellValue.content ? cellValue.content.hp : null
  const isDead = isMonster && cellValue.content && cellValue.content.hp <= 0
  const isBoss = isMonster && cellValue.content && cellValue.content.isBoss
  const glyph = resolveGlyph(cellValue)

  // Flinch when a monster loses HP.
  const prevHp = useRef(monsterHp)
  useEffect(() => {
    if (isMonster && prevHp.current != null && monsterHp != null && monsterHp < prevHp.current) {
      setHitPulse((pulse) => pulse + 1)
    }
    prevHp.current = monsterHp
  }, [monsterHp, isMonster])

  // Spawn floating combat text pushed for this cell.
  const actionId = action ? action.id : null
  useEffect(() => {
    if (action && action.id) {
      pushFloat(action.texts)
    }
  }, [actionId]) // eslint-disable-line react-hooks/exhaustive-deps

  let glyphNode = null
  if (glyph) {
    if (isMonster) {
      glyphNode = isDead
        ? <Glyph variant="dead">{glyph}</Glyph>
        : (
          <ShakeWrap key={hitPulse} shaking={hitPulse > 0}>
            <Glyph variant="idle" big={isBoss}>{glyph}</Glyph>
            {hitPulse > 0 && <RedFlash key={hitPulse} />}
          </ShakeWrap>
          )
    } else {
      glyphNode = <Glyph variant={cellValue.type === 'Key' ? 'key' : 'static'}>{glyph}</Glyph>
    }
  }

  return (
    <Wraper
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      isHovered={isHovered}
      cellValue={cellValue}
    >
      <Content
        key={cellValue.isOpen ? 'open' : 'closed'}
        revealing={cellValue.isOpen && glyph !== null}
        dim={!cellValue.isOpen && !cellValue.canClick}
        highlight={isHovered && cellValue.canClick}
      >
        <FloatingLayer items={floats} />
        {glyphNode}
        {cellValue.isOpen && isMonster && !isDead && (
          <GaugeWrap>
            <Gauge value={cellValue.content.hp} maxValue={cellValue.content.maxHp} showValue={false} />
          </GaugeWrap>
        )}
        {cellValue.isBlocked && cellValue.type !== 'Entrance' && <Blocked />}
      </Content>
    </Wraper>
  )
}

Cell.propTypes = {
  cellValue: PropTypes.object,
  onClick: PropTypes.func,
  action: PropTypes.object
}
