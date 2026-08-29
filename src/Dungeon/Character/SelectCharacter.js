import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Colors from '../../Helper/Colors'
import { UpgradeRow } from './UpgradeRow'

const Scroller = styled.div`
  box-sizing: border-box;
  display: flex;
  gap: 16px;
  align-items: stretch;
  width: 100%;
  height: 100%;
  padding: 16px;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
`

const Card = styled.div`
  box-sizing: border-box;
  flex: 0 0 300px;
  max-width: 300px;
  height: 100%;
  max-height: 560px;
  display: flex;
  flex-direction: column;
  background: ${Colors.dark2};
  border: 1px solid ${Colors.white10};
  border-radius: 14px;
  overflow: hidden;
  scroll-snap-align: center;
  box-shadow: 0 6px 20px ${Colors.black30};
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  &:hover { transform: translateY(-3px); box-shadow: 0 10px 26px ${Colors.black50}; }
  @media only screen and (max-width: 768px) {
    flex-basis: 86vw;
    max-width: 86vw;
  }
`

const Portrait = styled.div`
  position: relative;
  height: 150px;
  flex: 0 0 150px;
  background-color: ${Colors.carbon};
  background-image: ${({ img }) => (img ? `url(${img})` : 'none')};
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 55%, ${Colors.dark2} 100%);
  }
`

const Locked = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  background: ${Colors.black50};
  z-index: 1;
  &::after { content: '🔒'; }
`

const Head = styled.div`
  padding: 4px 12px 8px;
`

const Name = styled.div`
  font-family: Helvetica, sans-serif;
  font-size: 20px;
  font-weight: 800;
  color: ${Colors.white100};
  line-height: 1.1;
`

const Chips = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 8px;
`

const Chip = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px 0;
  border-radius: 7px;
  background: ${Colors.white5};
  border: 1px solid ${Colors.white10};
`

const ChipVal = styled.span`
  font-family: Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 800;
  color: ${({ tint }) => tint || Colors.white100};
`

const ChipLabel = styled.span`
  font-size: 9px;
  letter-spacing: 0.5px;
  color: ${Colors.white50};
`

const Body = styled.div`
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 4px 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const SectionTitle = styled.div`
  font-family: Helvetica, sans-serif;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${Colors.white50};
  margin: 8px 0 2px;
`

const Passive = styled.div`
  font-family: Helvetica, sans-serif;
  font-size: 11px;
  line-height: 1.35;
`
const PassiveName = styled.span`
  font-weight: 700;
  color: ${Colors.green};
`
const PassiveDesc = styled.span`
  color: ${Colors.white30};
`

const Footer = styled.div`
  padding: 10px 12px;
  border-top: 1px solid ${Colors.white10};
`

const Cta = styled.button`
  width: 100%;
  padding: 11px;
  border: none;
  border-radius: 10px;
  font-family: Helvetica, sans-serif;
  font-size: 15px;
  font-weight: 800;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  color: ${({ disabled }) => (disabled ? Colors.white30 : Colors.black100)};
  background: ${({ locked, disabled }) => (disabled ? Colors.white5 : locked ? Colors.yellow : Colors.greenLight)};
  transition: filter 0.15s ease;
  &:hover { filter: ${({ disabled }) => (disabled ? 'none' : 'brightness(1.08)')}; }
`

const STAT_TINT = [Colors.red, Colors.yellow, Colors.blue, Colors.greenLight]
const SPELL_ICON = { damage: '💥', heal: '💚', buff: '🔼', dot: '🧪' }

const spellIcon = (spell) => {
  const kind = spell.actions && spell.actions[0] ? spell.actions[0].kind : 'buff'
  return SPELL_ICON[kind] || '✨'
}

export const SelectCharacter = ({
  characters = [],
  gold = 0,
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
                <Chip><ChipVal tint={Colors.red}>{character.maxHp}</ChipVal><ChipLabel>PV</ChipLabel></Chip>
                <Chip><ChipVal tint={Colors.yellow}>{stats.atq}</ChipVal><ChipLabel>ATQ</ChipLabel></Chip>
                <Chip><ChipVal tint={Colors.blue}>{stats.def}</ChipVal><ChipLabel>DEF</ChipLabel></Chip>
                <Chip><ChipVal tint={Colors.greenLight}>{stats.spd}</ChipVal><ChipLabel>SPD</ChipLabel></Chip>
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
                    tint={Colors.pinkLight}
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
              <Cta
                locked={!owned}
                disabled={!owned && gold < character.price}
                onClick={() => (owned ? selectCharacter(offset) : buyCharacter(offset))}
              >
                {owned ? `Jouer ${character.type}` : `Acheter · ${character.price} 🪙`}
              </Cta>
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
  selectCharacter: PropTypes.func,
  buyCharacter: PropTypes.func,
  upgradeCharacterSkill: PropTypes.func,
  upgradeCharacterSpell: PropTypes.func
}
