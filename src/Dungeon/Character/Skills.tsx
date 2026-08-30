import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Skill } from './Skill'
import Colors from '../../Helper/Colors'
import { DISPLAY_FONT } from '../../Guideline/theme'
import DashedSeparator from '../../Guideline/Separator/DashedSeparator'

const Wrapper = styled.div<any>`
  box-sizing: border-box;
  width: 100%;
  height: 300px;
  order: 3;
`

const Row = styled.div<any>`
  min-height: 24px;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  text-align: center;
`

const Name = styled.div<any>`
  font-family: ${DISPLAY_FONT};
  font-weight: 800;
  letter-spacing: 1px;
  font-size: 16px;
  line-height: 18px;
  color: ${Colors.goldLight};
  text-shadow: 0 2px 3px rgba(0,0,0,0.6);
`
const Separator = styled(DashedSeparator)<any>`
  margin-top: 15px;
  margin-bottom: 15px;
`

const SkillSelectorWrapper = styled.div<any>`
  box-sizing: border-box;
  padding: 0 15px;
  display: flex;
  flex-direction: row;
  justify-content: center;
`

const SkillSelector = styled.span<any>`
  font-size: 20px;
  line-height: 20px;
  width: 20px;
  color: ${Colors.parchment};
  background: rgba(0,0,0,0.3);
  transition: all 0.25s ease-in-out;
  border: 1px solid ${Colors.woodLight};
  border-radius: 50%;
  vertical-align: baseline;
  display: ${({ show }) => (show ? 'flex' : 'none')};
  &:hover {
    cursor: pointer;
    color: ${Colors.goldLight};
    border: 1px solid ${Colors.gold};
  }
`

const SkillUpgrador = styled.span<any>`
  font-size: 14px;
  line-height: 14px;
  color: ${Colors.parchment};
  background: rgba(0,0,0,0.3);
  transition: all 0.25s ease-in-out;
  border: 1px solid ${Colors.woodLight};
  border-radius: 5px;
  vertical-align: baseline;
  padding: 3px;
  margin: 0 auto 5px;
  display: ${({ show }) => (show ? 'flex' : 'none')};
  &:hover {
    cursor: pointer;
    color: ${Colors.goldLight};
    border: 1px solid ${Colors.gold};
  }
`

export const Skills = ({
  skills = ({} as any),
  upgradeCharacterSkill,
  character = 0,
  wasBought = false
}) => {
  const [skill, setSkill] = useState(() => 0)

  const prevSkill = () => {
    setSkill((previousSkill) => {
      let newSkill = previousSkill - 1
      if (newSkill < 0) {
        newSkill = skills.length - 1
      }
      return newSkill
    })
  }

  const nextSkill = () => {
    setSkill((previousSkill) => {
      let newSkill = previousSkill + 1
      if (newSkill >= skills.length) {
        newSkill = 0
      }
      return newSkill
    })
  }

  return (
    <Wrapper>
      <Row>
        <Name>Talents</Name>
      </Row>
      <Separator />
      <Row>
        <Skill
          skill={skills[skill]}
        />
        <SkillSelectorWrapper>
          <SkillSelector
            onClick={() => prevSkill()}
            show={skills.length > 1}
          >
            {'<'}
          </SkillSelector>
          <SkillUpgrador
            onClick={() => upgradeCharacterSkill(character, skill)}
            show={wasBought && upgradeCharacterSkill !== undefined}
          >
            Upgrade {skills[skill].cost}
          </SkillUpgrador>
          <SkillSelector
            onClick={() => nextSkill()}
            show={skills.length > 1}
          >
            {'>'}
          </SkillSelector>
        </SkillSelectorWrapper>
      </Row>
    </Wrapper>
  )
}
Skills.propTypes = {
  skills: PropTypes.array,
  upgradeCharacterSkill: PropTypes.func,
  character: PropTypes.number,
  wasBought: PropTypes.bool
}
