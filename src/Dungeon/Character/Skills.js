import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Skill } from './Skill'
import Colors from '../../Helper/Colors'
import DashedSeparator from '../../Guideline/DashedSeparator'

const Wrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
`

const Row = styled.div`
  min-height: 24px;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  text-align: center;
`

const Name = styled.div`
  font-size: 16px;
  line-height: 18px;
  color: ${Colors.white100};
`
const Separator = styled(DashedSeparator)`
  margin-top: 15px;
  margin-bottom: 15px;
`

const SkillSelectorWrapper = styled.div`
  box-sizing: border-box;
  padding: 0 15px;
  display: ${({ show }) => (show ? 'flex' : 'none')};
  flex-direction: row;
  justify-content: space-between;
`

const SkillSelector = styled.span`
  font-size: 20px;
  line-height: 20px;
  width: 20px;
  color: ${Colors.white20};
  background: ${Colors.background};
  transition: all 0.25s ease-in-out;
  border: 1px solid ${Colors.white20};
  border-radius: 50%;
  vertical-align: baseline;
  &:hover {
    cursor: pointer;
    color: ${Colors.white75};
    border: 1px solid ${Colors.white75};
  }
`

const SkillUpgrador = styled.span`
  font-size: 14px;
  line-height: 14px;
  color: ${Colors.white20};
  background: ${Colors.background};
  transition: all 0.25s ease-in-out;
  border: 1px solid ${Colors.white20};
  border-radius: 5px;
  vertical-align: baseline;
  padding: 3px;
  margin: 0 auto 5px;
  &:hover {
    cursor: pointer;
    color: ${Colors.white75};
    border: 1px solid ${Colors.white75};
  }
`

export const Skills = ({
  skills = {},
  upgradeCharacterSkill,
  character = 0
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
        <Name>Skills</Name>
      </Row>
      <Separator />
      <Row>
        <Skill
          skill={skills[skill]}
        />
        <SkillSelectorWrapper
          show={skills.length > 1}
        >
          <SkillSelector
            onClick={() => prevSkill()}
          >
            {'<'}
          </SkillSelector>
          {skill + 1} / {skills.length}
          <SkillSelector
            onClick={() => nextSkill()}
          >
            {'>'}
          </SkillSelector>
        </SkillSelectorWrapper>
        <SkillSelectorWrapper show={upgradeCharacterSkill !== undefined}>
          <SkillUpgrador
            onClick={() => upgradeCharacterSkill(character, skill)}
          >
            Upgrade {skills[skill].cost}
          </SkillUpgrador>
        </SkillSelectorWrapper>
      </Row>
    </Wrapper>
  )
}
Skills.propTypes = {
  skills: PropTypes.array,
  upgradeCharacterSkill: PropTypes.func,
  character: PropTypes.number
}
