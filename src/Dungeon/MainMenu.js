import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SelectCharacter } from './Character'
import { Player } from './Player'
import Colors from '../Helper/Colors'
import { matchChallenge } from '../Helper/challenges'

const Wraper = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-between;
`

const Right = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
`

const SeedBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  flex-wrap: wrap;
`

const SeedField = styled.input`
  flex: 0 1 220px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid ${Colors.white20};
  background: ${Colors.carbon};
  color: ${Colors.white100};
  font-family: Helvetica, sans-serif;
  font-size: 14px;
  letter-spacing: 1px;
  &::placeholder { color: ${Colors.white30}; letter-spacing: 0; }
  &:focus { outline: none; border-color: ${Colors.yellow}; }
`

const SeedLabel = styled.span`
  font-family: Helvetica, sans-serif;
  font-size: 12px;
  color: ${Colors.white50};
`

const Clear = styled.button`
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid ${Colors.white20};
  background: transparent;
  color: ${Colors.white50};
  font-size: 12px;
  cursor: pointer;
  &:hover { color: ${Colors.white100}; border-color: ${Colors.white50}; }
`

const ChallengeTag = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 8px;
  background: rgba(255, 208, 80, 0.12);
  border: 1px solid ${Colors.yellow};
  color: ${Colors.white100};
  font-family: Helvetica, sans-serif;
  font-size: 12px;
`

const ChallengeName = styled.span`
  font-weight: 800;
  color: ${Colors.yellow};
  letter-spacing: 1px;
`

const Hint = styled.span`
  font-family: Helvetica, sans-serif;
  font-size: 11px;
  color: ${Colors.white30};
`

export const MainMenu = ({
  player,
  selectCharacter,
  buyCharacter,
  upgradeCharacterSkill,
  upgradeCharacterSpell
}) => {
  const [seed, setSeed] = useState('')
  const challenge = matchChallenge(seed)
  const seeded = seed.trim().length > 0

  return (
    <Wraper>
      <Player player={player}/>
      <Right>
        <SeedBar>
          <SeedLabel>Seed</SeedLabel>
          <SeedField
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            placeholder="aléatoire — ou colle une seed / un challenge"
            spellCheck={false}
          />
          {seeded && <Clear onClick={() => setSeed('')}>✕</Clear>}
          {challenge
            ? (
              <ChallengeTag>
                <span>{challenge.glyph}</span>
                <ChallengeName>{challenge.name}</ChallengeName>
                <span>{challenge.description}</span>
              </ChallengeTag>
              )
            : seeded
              ? <Hint>Run seedée — sans progression (or & records non sauvegardés).</Hint>
              : <Hint>Laisse vide pour une run normale. Essaie « COMEBACK ».</Hint>}
        </SeedBar>
        <SelectCharacter
          characters={player.characters}
          gold={player.gold}
          seed={seed}
          selectCharacter={selectCharacter}
          buyCharacter={buyCharacter}
          upgradeCharacterSkill={upgradeCharacterSkill}
          upgradeCharacterSpell={upgradeCharacterSpell}
        />
      </Right>
    </Wraper>
  )
}
MainMenu.propTypes = {
  player: PropTypes.object,
  selectCharacter: PropTypes.func,
  buyCharacter: PropTypes.func,
  upgradeCharacterSkill: PropTypes.func,
  upgradeCharacterSpell: PropTypes.func
}
