import React from 'react'
import PropTypes from 'prop-types'
import Colors from '../../Helper/Colors'
import styled from 'styled-components'
import { parchmentFill, DISPLAY_FONT, BODY_FONT } from '../../Guideline/theme'

const Wrapper = styled.div`
  box-sizing: border-box;
  width: 230px;
  padding: 14px;
  border-radius: 12px;
  border: 3px solid ${Colors.woodDark};
  ${parchmentFill}
  color: ${Colors.ink};
  margin: auto;
  margin-bottom: 5px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4), inset 0 0 0 2px ${Colors.parchmentDark};
  @media only screen and (max-width: 768px) {
    padding: 10px;
  }
`

const Glyph = styled.div`
  margin: 0 auto 8px;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  border-radius: 12px;
  background: rgba(61, 39, 22, 0.08);
  border: 2px solid rgba(61, 39, 22, 0.22);
  @media only screen and (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 22px;
  }
`

const Name = styled.div`
  font-family: ${DISPLAY_FONT};
  font-weight: 800;
  font-size: 16px;
  line-height: 18px;
  text-align: center;
  color: ${Colors.woodDark};
`

const Details = styled.div`
  font-family: ${BODY_FONT};
  font-size: 12px;
  line-height: 1.3;
  text-align: center;
  color: ${Colors.inkSoft};
  margin-top: 8px;
`

export const Skill = ({
  skill = {}
}) => {
  return (
    <Wrapper>
      <Glyph>{skill.glyph || '✦'}</Glyph>
      <Name>{skill.name}</Name>
      <Details>{skill.description}</Details>
    </Wrapper>
  )
}
Skill.propTypes = {
  skill: PropTypes.object
}
