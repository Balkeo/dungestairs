import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Colors from '../Helper/Colors'

const DefaultButton = styled.button`
  outline:none;
  height: 40px;
  text-align: center;
  width: 130px;
  border-radius:40px;
  background: ${({ color }) => (color !== '' ? color : Colors.green)};
  border: 2px solid ${({ color }) => (color !== '' ? color : Colors.green75)};
  color:$green;
  letter-spacing:1px;
  text-shadow:0;
  margin: auto;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.25s ease;
  &:hover {
    color:white;
    background: $green;
  }
  &:active {
    letter-spacing: 2px;
    letter-spacing: 2px ;
  }
`

const Button = ({
  children = {},
  color = '',
  onClick
}) => {
  return (
   <DefaultButton
     color={color}
     onClick={() => onClick()}
   >
     {children}
   </DefaultButton>
  )
}
Button.propTypes = {
  children: PropTypes.array,
  color: PropTypes.string,
  onClick: PropTypes.func
}

export default Button
