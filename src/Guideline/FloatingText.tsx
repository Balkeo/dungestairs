import React, { useState, useRef, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { floatUp } from './animations'

let counter = 0

// Small queue of transient "floating" texts (damage numbers, +gold, K.O. ...).
// Each pushed batch is auto-removed after `ttl` ms once its animation ends.
export const useFloatingQueue = (ttl = 950) => {
  const [items, setItems] = useState([])
  const timers = useRef([])

  const push = useCallback((texts) => {
    const list = (Array.isArray(texts) ? texts : [texts]).filter(Boolean)
    if (list.length === 0) {
      return
    }
    const toAdd = list.map((text, index) => ({ id: ++counter, index, ...text }))
    setItems((prev) => [...prev, ...toAdd])
    toAdd.forEach((item) => {
      const timer = setTimeout(() => {
        setItems((prev) => prev.filter((entry) => entry.id !== item.id))
      }, ttl)
      timers.current.push(timer)
    })
  }, [ttl])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  return [items, push] as [any[], (t: any) => void]
}

const Layer = styled.div<any>`
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: visible;
  z-index: 5;
`

const Text = styled.span<any>`
  position: absolute;
  left: 50%;
  top: ${({ index }) => 42 - (index % 3) * 8}%;
  transform: translate(-50%, 0);
  font-family: Helvetica, Arial, sans-serif;
  font-weight: 800;
  font-size: ${({ size }) => size || 18}px;
  line-height: 1;
  white-space: nowrap;
  color: ${({ color }) => color || '#ffffff'};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.9), 0 0 6px rgba(0, 0, 0, 0.6);
  animation: ${floatUp} 0.95s ease-out forwards;
  animation-delay: ${({ index }) => (index % 3) * 90}ms;
`

export const FloatingLayer = ({ items = [] }) => {
  return (
    <Layer>
      {items.map((item) => (
        <Text key={item.id} index={item.index} color={item.color} size={item.size}>
          {item.text}
        </Text>
      ))}
    </Layer>
  )
}
