import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Colors from '../../Helper/Colors'
import { Skills } from './Skills'
import { Stats } from './Stats'
import Button from '../../Guideline/Button'

const CharacterGrid = styled.div`
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-auto-flow: row dense;
  grid-gap: 12px;
  justify-items: center;
  align-items: center;
  margin: auto;
  height: 100%;
  width: 100%;
  overflow: scroll;
  @media only screen and (max-width: 768px) {
    grid-gap: 0px;
  }
`

const Character = styled.div`
  box-sizing: border-box;
  max-width: 256px;
  height: 550px;
  padding: 10px;
  background-color: ${Colors.dark1};
  border-radius: 5px;
  margin-left: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  box-shadow: 0 0 8px 0 ${Colors.black30}, inset 0 -2px 0 0 ${Colors.black10};
  transition: box-shadow 0.25s ease-in-out;
  &:hover {
    box-shadow: 0 0 16px 0 ${Colors.black50}, inset 0 -2px 0 0 ${Colors.black30};
  }
  @media only screen and (max-width: 768px) {
    height: 95%;
  }
`

const ButtonRow = styled.div`
  order: 99;
`

export const SelectCharacter = ({
  characters = [],
  selectCharacter,
  buyCharacter,
  upgradeCharacterSkill
}) => {
  return (
    <CharacterGrid>
    {
      characters.map((character, offset) => {
        return (
          <Character key={offset}>
            <Stats character={character}/>
            <Skills
              skills={character.skills}
              upgradeCharacterSkill={upgradeCharacterSkill}
              character={offset}
              wasBought={character.price === 0}
            />
            <ButtonRow>
              <Button onClick={
                () => {
                  character.price > 0
                    ? buyCharacter(offset)
                    : selectCharacter(offset)
                }
              }>
                {
                  character.price > 0
                    ? 'Buy '
                    : 'Select '
                }
                {character.type}
                { character.price > 0 ? ' ' + character.price + 'Gold' : ''}
              </Button>
            </ButtonRow>
          </Character>
        )
      })
    }
    </CharacterGrid>
  )
}
SelectCharacter.propTypes = {
  characters: PropTypes.array,
  selectCharacter: PropTypes.func,
  buyCharacter: PropTypes.func,
  upgradeCharacterSkill: PropTypes.func
}
