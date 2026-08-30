import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Colors from '../Helper/Colors'

const Boxes = styled.div<any>`
  display: flex;
  gap: 6px;
  @media only screen and (max-width: 768px) {
    gap: 4px;
  }
`

const Box = styled.input<any>`
  width: 34px;
  height: 40px;
  text-align: center;
  border-radius: 8px;
  border: 1px solid ${({ filled }) => (filled ? Colors.yellow : Colors.white20)};
  background: ${Colors.carbon};
  color: ${Colors.white100};
  font-family: Helvetica, monospace;
  font-size: 18px;
  font-weight: 700;
  text-transform: uppercase;
  caret-color: ${Colors.yellow};
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  &:focus {
    outline: none;
    border-color: ${Colors.yellow};
    box-shadow: 0 0 0 2px rgba(255, 208, 80, 0.25);
  }
  @media only screen and (max-width: 768px) {
    width: 28px;
    height: 34px;
    font-size: 15px;
  }
`

const sanitize = (str) => String(str || '').toUpperCase().replace(/[^A-Z0-9]/g, '')

// One-time-password style input: `length` single-character boxes whose combined
// (contiguous) value is surfaced through onChange. Used to enter a run seed.
export const SeedInput = ({ value = '', length = 8, onChange = ((() => {}) as any) }) => {
  const refs = useRef([])
  const chars = Array.from({ length }, (_, i) => value[i] || '')

  const focusBox = (index) => {
    const clamped = Math.max(0, Math.min(length - 1, index))
    const el = refs.current[clamped]
    if (el) {
      el.focus()
      el.select()
    }
  }

  const handleInput = (index, raw) => {
    const ch = sanitize(raw).slice(-1)
    if (!ch) {
      return
    }
    const next = index >= value.length
      ? (value + ch).slice(0, length)
      : (value.slice(0, index) + ch + value.slice(index + 1)).slice(0, length)
    onChange(next)
    focusBox(index + 1)
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      if (value[index]) {
        onChange(value.slice(0, index) + value.slice(index + 1))
        focusBox(index)
      } else if (index > 0) {
        onChange(value.slice(0, index - 1) + value.slice(index))
        focusBox(index - 1)
      }
    } else if (e.key === 'ArrowLeft') {
      focusBox(index - 1)
    } else if (e.key === 'ArrowRight') {
      focusBox(index + 1)
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = sanitize(e.clipboardData.getData('text')).slice(0, length)
    onChange(pasted)
    focusBox(pasted.length)
  }

  return (
    <Boxes onPaste={handlePaste}>
      {chars.map((ch, index) => (
        <Box
          key={index}
          ref={(el) => { refs.current[index] = el }}
          value={ch}
          filled={!!ch}
          maxLength={1}
          inputMode="text"
          autoCapitalize="characters"
          spellCheck={false}
          aria-label={`Seed ${index + 1}`}
          onChange={(e) => handleInput(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </Boxes>
  )
}

SeedInput.propTypes = {
  value: PropTypes.string,
  length: PropTypes.number,
  onChange: PropTypes.func
}
