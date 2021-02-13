import React from 'react'
import PropTypes from 'prop-types'
import { Gauge } from './Gauge'
import colors from '../Helper/Colors'
import defaultSkill from '../Assets/Skills.png'

export const Character = ({
  character
}) => {
  return (
      <div style={style}>
          <div style={{ height: '256px', width: '256px', display: 'flex', flexDirection: 'column' }}>
              <div>Inventory :</div>
              <div>
                  <div style={{ display: 'flex' }}>
                      <div
                          style={{
                            width: '61px',
                            height: '61px',
                            backgroundColor: colors.light,
                            marginRight: '4px',
                            marginBottom: '4px'
                          }}
                      >
                          { character.items.length > 0
                            ? character.items.map((itemValue, itemOffset) => {
                              return (
                                  <div
                                    key={itemOffset}
                                      style={{
                                        width: '61px',
                                        height: '61px',
                                        backgroundColor: colors.light,
                                        marginRight: '4px',
                                        marginBottom: '4px'
                                      }}
                                  >
                                      { itemValue[itemOffset] ?? '' }
                                  </div>
                              )
                            })
                            : '' }
                      </div>
                  </div>
              </div>
          </div>
          <div style={{ height: '256px', width: '256px' }}>
              <img src={character.profile} height="256" width="256" alt="Character icon" />
                <div style={{
                  color: colors.light,
                  height: '256px',
                  width: '256px',
                  position: 'fixed',
                  bottom: '0',
                  display: 'flex',
                  flexDirection: 'column-reverse',
                  justifyContent: 'space-between'
                }}>
                    <Gauge actual={character.hp} max={character.maxHp} />
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                        {
                            Object.entries(character.stats).map(([stats, value]) => {
                              return (
                                    <div
                                    key={stats}
                                      style={{ width: '85px' }}
                                    >
                                        {stats} : {value}
                                    </div>
                              )
                            })
                        }
                    </div>
                </div>
            </div>
          <div style={{ height: '256px', width: '256px' }}>
            <div>Skills :</div>
            <div>
              <div style={{ display: 'flex' }}>
                <div
                  style={{
                    width: '61px',
                    height: '61px',
                    backgroundColor: colors.light,
                    marginRight: '4px',
                    marginBottom: '4px'
                  }}
                >
                  {
                    character.skills.map((skillValue, skillOffset) => {
                      return (
                        <div
                          key={skillOffset}
                          style={{
                            width: '61px',
                            height: '61px',
                            backgroundColor: colors.light,
                            marginRight: '4px',
                            marginBottom: '4px',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                            backgroundImage: skillValue.icon !== null ? `url(${skillValue.icon})` : `url(${defaultSkill})`
                          }}
                        >
                          { skillValue[skillOffset] ?? '' }
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </div>
          </div>
      </div>
  )
}
Character.propTypes = {
  character: PropTypes.object
}

const style = {
  backgroundColor: colors.teal,
  display: 'flex',
  justifyContent: 'space-evenly',
  width: '100%',
  minHeight: '256px',
  zIndex: 5
}
