import React from 'react'
import PropTypes from 'prop-types'
import Colors from '../../Helper/Colors'
import defaultSkill from '../../Assets/Skills.png'
import styled from 'styled-components'
import DashedSeparator from '../../Guideline/DashedSeparator'

const Wrapper = styled.div`
  width: 200px;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid ${Colors.black50};
  background: ${Colors.background};
  margin-bottom: 5px;
  box-shadow: inset 0 0 8px ${Colors.black50};
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
`

export const Skill = ({
  skill = {}
}) => {
  return (
    <Wrapper>
      <div
        style={{
          margin: 'auto',
          width: '55px',
          height: '55px',
          marginBottom: '15px',
          backgroundColor: Colors.white75,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundImage: skill.icon !== null ? `url(${skill.icon})` : `url(${defaultSkill})`
        }}
      />
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
