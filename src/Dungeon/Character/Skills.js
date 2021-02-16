import React from 'react'
import PropTypes from 'prop-types'
import { Skill } from './Skill'

export const Skills = ({
  skills = {}
}) => {
  return (
    <div>
      <div>Skills :</div>
      <div>
        <div style={{
          display: 'grid',
          gridTemplate: 'repeat(4, 1fr)',
          gridGap: '12px',
          justifyItems: 'center'
        }}>
          {
            skills.map((skillValue, skillOffset) => {
              return (
                <Skill
                  key={skillOffset}
                  skill={skillValue}
                />
              )
            })
          }
        </div>
      </div>
    </div>
  )
}
Skills.propTypes = {
  skills: PropTypes.array
}
