import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import Colors from '../Helper/Colors'
import { DISPLAY_FONT, woodFill } from './theme'

const base = css`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: ${DISPLAY_FONT};
  font-weight: 800;
  letter-spacing: 0.5px;
  border: 3px solid ${Colors.woodDark};
  border-radius: 14px;
  cursor: pointer;
  user-select: none;
  text-shadow: 0 2px 0 rgba(0, 0, 0, 0.35);
  transition: transform 0.06s ease, filter 0.15s ease, box-shadow 0.06s ease;
  &:disabled { cursor: default; filter: grayscale(0.6) brightness(0.8); opacity: 0.7; }
  &:not(:disabled):hover { filter: brightness(1.06); }
  &:not(:disabled):active { transform: translateY(3px); }
`

const sizes = {
  sm: css`font-size: 14px; padding: 8px 14px;`,
  md: css`font-size: 17px; padding: 11px 20px;`,
  lg: css`font-size: 24px; padding: 16px 34px;`
}

const Primary = styled.button<any>`
  ${base}
  ${({ size }) => sizes[size] || sizes.md}
  color: ${Colors.woodDark};
  background: linear-gradient(180deg, ${Colors.goldLight} 0%, ${Colors.gold} 55%, #c98a24 100%);
  box-shadow: 0 5px 0 0 #a06a17, 0 9px 16px rgba(0, 0, 0, 0.4), inset 0 2px 2px rgba(255, 255, 255, 0.5);
  &:not(:disabled):active { box-shadow: 0 2px 0 0 #a06a17, 0 5px 10px rgba(0, 0, 0, 0.4), inset 0 2px 2px rgba(255, 255, 255, 0.5); }
`

const Wood = styled.button<any>`
  ${base}
  ${({ size }) => sizes[size] || sizes.md}
  ${woodFill}
  color: ${Colors.parchment};
  box-shadow: 0 5px 0 0 ${Colors.woodDark}, 0 9px 16px rgba(0, 0, 0, 0.4);
  &:not(:disabled):active { box-shadow: 0 2px 0 0 ${Colors.woodDark}, 0 5px 10px rgba(0, 0, 0, 0.4); }
`

export const GameButton = ({ variant = 'primary', size = 'md', children, ...rest }) => {
  const Comp = variant === 'wood' ? Wood : Primary
  return <Comp size={size} {...rest}>{children}</Comp>
}

GameButton.propTypes = {
  variant: PropTypes.oneOf(['primary', 'wood']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  children: PropTypes.node
}
