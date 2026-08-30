import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Modal from '../Guideline/Modal'
import Colors from '../Helper/Colors'
import { setMuted } from '../Helper/sound'
import { clearSave } from '../Helper/save'

const MUTE_KEY = '_dungestairs_muted'

const GearButton = styled.button<any>`
  position: fixed;
  top: 12px;
  right: 58px;
  z-index: 1030;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 2px solid ${Colors.woodDark};
  background: ${Colors.wood};
  color: ${Colors.goldLight};
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { color: ${Colors.white100}; border-color: ${Colors.goldLight}; }
`

const Title = styled.div<any>`
  font-family: Helvetica, sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: ${Colors.ink};
`

const Row = styled.div<any>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid rgba(61,39,22,0.18);
  font-family: Helvetica, sans-serif;
  color: ${Colors.ink};
`

const Label = styled.div<any>`
  font-size: 15px;
  font-weight: 600;
  color: ${Colors.ink};
`

const Sub = styled.div<any>`
  font-size: 12px;
  color: ${Colors.inkSoft};
  margin-top: 2px;
`

const Toggle = styled.button<any>`
  min-width: 96px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 2px solid ${({ danger }) => (danger ? Colors.red : Colors.inkSoft)};
  background: rgba(61,39,22,0.06);
  color: ${({ danger }) => (danger ? Colors.red : Colors.ink)};
  font-family: Helvetica, sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { color: ${Colors.ink}; border-color: ${({ danger }) => (danger ? Colors.red : Colors.ink)}; }
`

const readMuted = () => {
  try {
    return localStorage.getItem(MUTE_KEY) === '1'
  } catch (err) {
    return false
  }
}

export const Settings = () => {
  const [isShowing, setShowing] = useState(false)
  const [muted, setMutedState] = useState(() => readMuted())
  const [confirmReset, setConfirmReset] = useState(false)

  // Apply the stored mute preference at startup.
  useEffect(() => {
    setMuted(muted)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleMute = () => {
    const next = !muted
    setMutedState(next)
    setMuted(next)
    try {
      localStorage.setItem(MUTE_KEY, next ? '1' : '0')
    } catch (err) { /* ignore */ }
  }

  const close = () => {
    setShowing(false)
    setConfirmReset(false)
  }

  const resetSave = () => {
    if (!confirmReset) {
      setConfirmReset(true)
      return
    }
    clearSave()
    window.location.reload()
  }

  return (
    <>
      <GearButton onClick={() => setShowing(true)} title="Réglages" aria-label="Réglages">⚙️</GearButton>
      <Modal title={<Title>⚙️ Réglages</Title>} isShowing={isShowing} hide={close}>
        <div>
          <Row>
            <div>
              <Label>Son</Label>
              <Sub>Effets sonores du jeu</Sub>
            </div>
            <Toggle onClick={toggleMute}>{muted ? '🔇 Coupé' : '🔊 Activé'}</Toggle>
          </Row>
          <Row style={{ borderBottom: 'none' }}>
            <div>
              <Label>Sauvegarde</Label>
              <Sub>Efface l'or, les classes et la progression</Sub>
            </div>
            <Toggle danger onClick={resetSave}>
              {confirmReset ? 'Confirmer ?' : 'Réinitialiser'}
            </Toggle>
          </Row>
        </div>
      </Modal>
    </>
  )
}
