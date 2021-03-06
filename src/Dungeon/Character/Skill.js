import React from 'react'
import PropTypes from 'prop-types'
import Colors from '../../Helper/Colors'
import defaultSkill from '../../Assets/Skills.png'
import styled from 'styled-components'
import DashedSeparator from '../../Guideline/Separator/DashedSeparator'

const Wrapper = styled.div`
  box-sizing: border-box;
  width: 230px;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid ${Colors.black50};
  background: ${Colors.background};
  margin: auto;
  margin-bottom: 5px;
  box-shadow: inset 0 0 8px ${Colors.black50};
  @media only screen and (max-width: 768px) {
    padding: 10px;
  }
`

const Icon = styled.div`
  margin: auto;
  width: 55px;
  height: 55px;
  margin-bottom: 15px;
  background-color: ${Colors.white75};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: ${({ icon }) => (icon !== null ? `url(${icon})` : `url(${defaultSkill})`)};
  @media only screen and (max-width: 768px) {
    width: 40px;
    height: 40px;
    margin-bottom: 10px;
  }
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

const Details = styled.div`
  font-size: 12px;
  line-height: 1.17;
  color: ${Colors.white30};
`

const Separator = styled(DashedSeparator)`
  margin-top: 15px;
  margin-bottom: 15px;
  @media only screen and (max-width: 768px) {
    margin-top: 10px;
    margin-bottom: 10px;
  }
`

export const Skill = ({
  skill = {}
}) => {
  return (
    <Wrapper>
      <Icon icon={skill.icon} />
      <Row>
        <Name>{skill.name}</Name>
      </Row>
      <Separator/>
      <Row>
        <Details>{skill.description}</Details>
      </Row>
    </Wrapper>
  )
}
Skill.propTypes = {
  skill: PropTypes.object
}
