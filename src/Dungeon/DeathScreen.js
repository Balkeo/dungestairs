import React from 'react'
import PropTypes from 'prop-types'
import styled, { css, keyframes } from 'styled-components'
import Colors from '../Helper/Colors'
import Button from '../Guideline/Button'

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const riseIn = keyframes`
  from { opacity: 0; transform: translateY(16px) scale(0.96); }
  to { opacity: 1; transform: none; }
`

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(10, 8, 5, 0.82);
  ${css`animation: ${fadeIn} 0.35s ease both;`}
`

const Panel = styled.div`
  width: min(90vw, 380px);
  box-sizing: border-box;
  padding: 32px 28px;
  text-align: center;
  background: ${Colors.brown1};
  border: 1px solid ${Colors.black50};
  border-radius: 14px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  ${css`animation: ${riseIn} 0.4s ease both;`}
`

const Skull = styled.div`
  font-size: 54px;
  line-height: 1;
  margin-bottom: 8px;
`

const Title = styled.h2`
  margin: 0 0 4px;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 26px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${Colors.red};
`

const Sub = styled.div`
  font-size: 13px;
  color: ${Colors.white50};
  margin-bottom: 22px;
`

const Stats = styled.div`
  display: flex;
  justify-content: center;
  gap: 14px;
  margin-bottom: 26px;
`

const Stat = styled.div`
  flex: 1;
  padding: 14px 8px;
  background: ${Colors.background};
  border-radius: 10px;
  border: 1px solid ${Colors.black50};
`

const StatValue = styled.div`
  font-size: 26px;
  font-weight: 800;
  color: ${({ tint }) => tint || Colors.white100};
  font-variant-numeric: tabular-nums;
`

const StatLabel = styled.div`
  margin-top: 2px;
  font-size: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${Colors.white30};
`

const Unlocked = styled.div`
  margin: 0 0 20px;
  padding: 12px;
  background: rgba(255, 208, 80, 0.1);
  border: 1px solid ${Colors.yellow};
  border-radius: 10px;
`

const UnlockedTitle = styled.div`
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${Colors.yellow};
  margin-bottom: 8px;
`

const UnlockedItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${Colors.white100};
  padding: 2px 0;
`

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const DeathScreen = ({ summary, onReplay, onMenu }) => {
  if (!summary) {
    return null
  }
  const won = summary.won
  return (
    <Overlay>
      <Panel>
        <Skull>{won ? '🏆' : '💀'}</Skull>
        <Title style={won ? { color: Colors.yellow } : undefined}>
          {won ? 'Victoire !' : 'Vous êtes mort'}
        </Title>
        <Sub>{won ? 'Vous avez vaincu le Seigneur du Donjon !' : 'Le donjon vous a eu... pour cette fois.'}</Sub>
        <Stats>
          <Stat>
            <StatValue tint={Colors.blueLight}>{summary.depth}</StatValue>
            <StatLabel>Profondeur</StatLabel>
          </Stat>
          <Stat>
            <StatValue tint={Colors.red}>{summary.kills}</StatValue>
            <StatLabel>Kills</StatLabel>
          </Stat>
          <Stat>
            <StatValue tint={Colors.yellow}>{summary.gold}</StatValue>
            <StatLabel>Or gagné</StatLabel>
          </Stat>
        </Stats>
        {summary.unlocked && summary.unlocked.length > 0 && (
          <Unlocked>
            <UnlockedTitle>🏆 Succès débloqué{summary.unlocked.length > 1 ? 's' : ''}</UnlockedTitle>
            {summary.unlocked.map((achievement) => (
              <UnlockedItem key={achievement.id}>
                <span>{achievement.glyph}</span>
                <span>{achievement.name}</span>
                <span style={{ marginLeft: 'auto', color: Colors.green, fontWeight: 700 }}>+{achievement.reward} or</span>
              </UnlockedItem>
            ))}
          </Unlocked>
        )}
        <Actions>
          <Button onClick={onReplay}>Rejouer</Button>
          <Button onClick={onMenu}>Menu principal</Button>
        </Actions>
      </Panel>
    </Overlay>
  )
}

DeathScreen.propTypes = {
  summary: PropTypes.object,
  onReplay: PropTypes.func,
  onMenu: PropTypes.func
}
