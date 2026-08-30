import React from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes, css } from 'styled-components'
import Colors from '../Helper/Colors'
import { GameButton } from '../Guideline/GameButton'
import { DISPLAY_FONT, BODY_FONT } from '../Guideline/theme'
import TitleBg from '../Assets/TitleBg.jpg'

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`
const rise = keyframes`from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; }`
const float = keyframes`0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); }`

const Screen = styled.div<any>`
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding: 0 24px 8vh;
  box-sizing: border-box;
  background: #1a120b url(${TitleBg}) center / cover no-repeat;
  ${css`animation: ${fadeIn} 0.6s ease both;`}
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(90% 70% at 50% 30%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 100%),
      linear-gradient(180deg, rgba(20,12,7,0.35) 0%, rgba(20,12,7,0) 30%, rgba(20,12,7,0.85) 100%);
  }
`

const Stack = styled.div<any>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  text-align: center;
`

const Logo = styled.h1<any>`
  margin: 0;
  font-family: ${DISPLAY_FONT};
  font-weight: 900;
  font-size: clamp(48px, 12vw, 120px);
  line-height: 0.95;
  letter-spacing: 2px;
  color: ${Colors.goldLight};
  -webkit-text-stroke: 3px ${Colors.woodDark};
  text-shadow:
    0 4px 0 ${Colors.woodDark},
    0 8px 0 rgba(0,0,0,0.35),
    0 14px 26px rgba(0,0,0,0.6);
  ${css`animation: ${rise} 0.7s ease both, ${float} 5s ease-in-out 0.7s infinite;`}
`

const Tagline = styled.div<any>`
  font-family: ${BODY_FONT};
  font-weight: 700;
  font-size: clamp(13px, 2.6vw, 17px);
  color: ${Colors.parchment};
  text-shadow: 0 2px 6px rgba(0,0,0,0.8);
  ${css`animation: ${rise} 0.7s ease 0.1s both;`}
`

const Actions = styled.div<any>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 6px;
  ${css`animation: ${rise} 0.7s ease 0.2s both;`}
`

const Record = styled.div<any>`
  font-family: ${BODY_FONT};
  font-weight: 700;
  font-size: 12px;
  color: ${Colors.goldLight};
  text-shadow: 0 2px 6px rgba(0,0,0,0.9);
`

export const TitleScreen = ({ player = ({} as any), onStart }) => {
  const best = (player.depth && player.depth.max) || 0
  return (
    <Screen>
      <Stack>
        <Logo>DUNGESTAIRS</Logo>
        <Tagline>Descends l’escalier maudit — étage après étage.</Tagline>
        <Actions>
          <GameButton size="lg" onClick={onStart}>⚔️ Descendre</GameButton>
          {best > 0 && <Record>★ Record : profondeur {best}</Record>}
        </Actions>
      </Stack>
    </Screen>
  )
}

TitleScreen.propTypes = {
  player: PropTypes.object,
  onStart: PropTypes.func
}
