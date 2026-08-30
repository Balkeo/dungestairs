import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Colors from '../../Helper/Colors'
import { UpgradeRow } from './UpgradeRow'
import { GameButton } from '../../Guideline/GameButton'
import { DISPLAY_FONT, BODY_FONT, parchmentFill, woodFill } from '../../Guideline/theme'

const Scroller = styled.div<any>`
  box-sizing: border-box;
  display: flex;
  gap: 18px;
  align-items: stretch;
  width: 100%;
  height: 100%;
  padding: 16px;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
`

const Card = styled.div<any>`
  box-sizing: border-box;
  flex: 0 0 300px;
  max-width: 300px;
  height: 100%;
  max-height: 566px;
  display: flex;
  flex-direction: column;
  ${parchmentFill}
  color: ${Colors.ink};
  font-family: ${BODY_FONT};
  border: 3px solid ${Colors.woodDark};
  border-radius: 16px;
  overflow: hidden;
  scroll-snap-align: center;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.45), inset 0 0 0 2px ${Colors.parchmentDark};
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  &:hover { transform: translateY(-4px); box-shadow: 0 16px 34px rgba(0, 0, 0, 0.55), inset 0 0 0 2px ${Colors.parchmentDark}; }
  @media only screen and (max-width: 768px) {
    flex-basis: 86vw;
    max-width: 86vw;
  }
`

const Portrait = styled.div<any>`
  position: relative;
  height: 150px;
  flex: 0 0 150px;
  background-color: ${Colors.woodDark};
  background-image: ${({ img }) => (img ? `url(${img})` : 'none')};
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  border-bottom: 3px solid ${Colors.woodDark};
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(61,39,22,0.15) 0%, transparent 35%, rgba(61,39,22,0.15) 100%);
  }
`

const Locked = styled.div<any>`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  background: rgba(20, 12, 7, 0.6);
  z-index: 1;
  &::after { content: '🔒'; }
`

const Head = styled.div<any>`
  padding: 8px 12px 8px;
`

const Name = styled.div<any>`
  font-family: ${DISPLAY_FONT};
  font-size: 22px;
  font-weight: 900;
  color: ${Colors.woodDark};
  line-height: 1.1;
  text-shadow: 0 1px 0 rgba(255,255,255,0.4);
`

const Chips = styled.div<any>`
  display: flex;
  gap: 6px;
  margin-top: 8px;
`

const Chip = styled.div<any>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px 0;
  border-radius: 8px;
  background: rgba(61, 39, 22, 0.08);
  border: 1px solid rgba(61, 39, 22, 0.22);
`

const ChipVal = styled.span<any>`
  font-family: ${DISPLAY_FONT};
  font-size: 15px;
  font-weight: 800;
  color: ${({ tint }) => tint || Colors.ink};
`

const ChipLabel = styled.span<any>`
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: ${Colors.inkSoft};
`

const Body = styled.div<any>`
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 4px 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const SectionTitle = styled.div<any>`
  font-family: ${DISPLAY_FONT};
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${Colors.wood};
  margin: 8px 0 2px;
`

const Passive = styled.div<any>`
  font-family: ${BODY_FONT};
  font-size: 11px;
  line-height: 1.35;
`
const PassiveName = styled.span<any>`
  font-weight: 800;
  color: #2f7d4f;
`
const PassiveDesc = styled.span<any>`
  color: ${Colors.inkSoft};
`

const Footer = styled.div<any>`
  padding: 10px 12px;
  ${woodFill}
  border-top: 3px solid ${Colors.woodDark};
`

const STAT_TINT = [Colors.ember, '#b8860b', '#2f6db8', '#2f7d4f']
const SPELL_ICON = { damage: '💥', heal: '💚', buff: '🔼', dot: '🧪' }

const spellIcon = (spell) => {
  const kind = spell.actions && spell.actions[0] ? spell.actions[0].kind : 'buff'
  return SPELL_ICON[kind] || '✨'
}

export const SelectCharacter = ({
  characters = [],
  gold = 0,
  seed = '',
  selectCharacter,
  buyCharacter,
  upgradeCharacterSkill,
  upgradeCharacterSpell
}) => {
  return (
    <Scroller>
      {characters.map((character, offset) => {
        const owned = character.price === 0
        const stats = character.stats || {}
        return (
          <Card key={offset}>
            <Portrait img={character.icon}>
              {!owned && <Locked />}
            </Portrait>
            <Head>
              <Name>{character.type}</Name>
              <Chips>
                <Chip><ChipVal tint={Colors.ember}>{character.maxHp}</ChipVal><ChipLabel>PV</ChipLabel></Chip>
                <Chip><ChipVal tint="#b8860b">{stats.atq}</ChipVal><ChipLabel>ATQ</ChipLabel></Chip>
                <Chip><ChipVal tint="#2f6db8">{stats.def}</ChipVal><ChipLabel>DEF</ChipLabel></Chip>
                <Chip><ChipVal tint="#2f7d4f">{stats.spd}</ChipVal><ChipLabel>SPD</ChipLabel></Chip>
              </Chips>
            </Head>
            <Body>
              <SectionTitle>Améliorations</SectionTitle>
              {(character.skills || []).map((skill, index) => {
                const cost = skill.cost || skill.level * 50
                return (
                  <UpgradeRow
                    key={index}
                    glyph={skill.glyph}
                    name={skill.name}
                    tint={STAT_TINT[index]}
                    level={skill.level}
                    hint={skill.description}
                    cost={cost}
                    owned={owned}
                    canAfford={gold >= cost}
                    onUpgrade={() => upgradeCharacterSkill(offset, index)}
                  />
                )
              })}

              <SectionTitle>Sorts</SectionTitle>
              {(character.spells || []).map((spell) => {
                const cost = (spell.level || 1) * 60
                return (
                  <UpgradeRow
                    key={spell.id}
                    glyph={spellIcon(spell)}
                    name={spell.name}
                    tint={Colors.wood}
                    level={spell.level || 1}
                    hint={`${spell.levelUp || ''}${spell.cooldown ? ` · CD ${spell.cooldown}` : ''}`}
                    cost={cost}
                    owned={owned}
                    canAfford={gold >= cost}
                    onUpgrade={() => upgradeCharacterSpell(offset, spell.id)}
                  />
                )
              })}

              {(character.passives || []).length > 0 && (
                <>
                  <SectionTitle>Passifs</SectionTitle>
                  {character.passives.map((passive) => (
                    <Passive key={passive.id} title={passive.description}>
                      <PassiveName>{passive.name}</PassiveName>{' '}
                      <PassiveDesc>{passive.description}</PassiveDesc>
                    </Passive>
                  ))}
                </>
              )}
            </Body>
            <Footer>
              <GameButton
                variant={owned ? 'primary' : 'wood'}
                size="md"
                style={{ width: '100%' }}
                disabled={!owned && gold < character.price}
                onClick={() => (owned ? selectCharacter(offset, seed) : buyCharacter(offset))}
              >
                {owned ? `Jouer ${character.type}` : `Acheter · ${character.price} 🪙`}
              </GameButton>
            </Footer>
          </Card>
        )
      })}
    </Scroller>
  )
}

SelectCharacter.propTypes = {
  characters: PropTypes.array,
  gold: PropTypes.number,
  seed: PropTypes.string,
  selectCharacter: PropTypes.func,
  buyCharacter: PropTypes.func,
  upgradeCharacterSkill: PropTypes.func,
  upgradeCharacterSpell: PropTypes.func
}
