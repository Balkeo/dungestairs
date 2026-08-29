import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Modal from '../Guideline/Modal'
import Colors from '../Helper/Colors'
import { ACHIEVEMENTS } from '../Helper/achievements'

const TrophyButton = styled.button`
  position: fixed;
  top: 12px;
  right: 104px;
  z-index: 1030;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 2px solid ${Colors.white30};
  background: ${Colors.brown2};
  color: ${Colors.white75};
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { color: ${Colors.white100}; border-color: ${Colors.yellow}; }
`

const Title = styled.div`
  font-family: Helvetica, sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: ${Colors.ink};
`

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin: 12px 0 18px;
`

const Stat = styled.div`
  background: rgba(61,39,22,0.06);
  border-radius: 8px;
  padding: 10px 6px;
  text-align: center;
`

const StatValue = styled.div`
  font-family: Helvetica, sans-serif;
  font-size: 20px;
  font-weight: 800;
  color: ${Colors.wood};
  font-variant-numeric: tabular-nums;
`

const StatLabel = styled.div`
  font-family: Helvetica, sans-serif;
  font-size: 10px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: ${Colors.inkSoft};
  margin-top: 2px;
`

const SectionTitle = styled.div`
  font-family: Helvetica, sans-serif;
  font-size: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${Colors.inkSoft};
  margin-bottom: 8px;
`

const Ach = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(61,39,22,0.18);
  opacity: ${({ done }) => (done ? 1 : 0.5)};
`

const AchGlyph = styled.div`
  font-size: 22px;
  flex: 0 0 26px;
  text-align: center;
  filter: ${({ done }) => (done ? 'none' : 'grayscale(1)')};
`

const AchBody = styled.div`
  flex: 1;
  font-family: Helvetica, sans-serif;
`

const AchName = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${({ done }) => (done ? Colors.ink : Colors.inkSoft)};
`

const AchDesc = styled.div`
  font-size: 11px;
  color: ${Colors.inkSoft};
`

const AchReward = styled.div`
  font-family: Helvetica, sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: ${({ done }) => (done ? Colors.green : Colors.inkSoft)};
  white-space: nowrap;
`

export const Records = ({ player = {} }) => {
  const [isShowing, setShowing] = useState(false)
  const stats = player.stats || {}
  const completed = player.achievements || []

  const cells = [
    [stats.bestDepth || 0, 'Profondeur'],
    [stats.runs || 0, 'Parties'],
    [stats.bossKills || 0, 'Boss'],
    [stats.kills || 0, 'Kills'],
    [stats.goldEarned || 0, 'Or total'],
    [`${completed.length}/${ACHIEVEMENTS.length}`, 'Succès']
  ]

  return (
    <>
      <TrophyButton onClick={() => setShowing(true)} title="Records & succès" aria-label="Records & succès">🏆</TrophyButton>
      <Modal title={<Title>🏆 Records &amp; Succès</Title>} isShowing={isShowing} hide={() => setShowing(false)}>
        <div>
          <StatGrid>
            {cells.map(([value, label]) => (
              <Stat key={label}>
                <StatValue>{value}</StatValue>
                <StatLabel>{label}</StatLabel>
              </Stat>
            ))}
          </StatGrid>
          <SectionTitle>Succès</SectionTitle>
          {ACHIEVEMENTS.map((achievement) => {
            const done = completed.includes(achievement.id)
            return (
              <Ach key={achievement.id} done={done}>
                <AchGlyph done={done}>{done ? achievement.glyph : '🔒'}</AchGlyph>
                <AchBody>
                  <AchName done={done}>{achievement.name}</AchName>
                  <AchDesc>{achievement.desc}</AchDesc>
                </AchBody>
                <AchReward done={done}>+{achievement.reward} or</AchReward>
              </Ach>
            )
          })}
        </div>
      </Modal>
    </>
  )
}

Records.propTypes = {
  player: PropTypes.object
}
