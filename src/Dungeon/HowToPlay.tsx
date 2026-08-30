import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Modal from '../Guideline/Modal'
import Colors from '../Helper/Colors'

const HELP_KEY = '_dungestairs_help_seen'

const HelpButton = styled.button<any>`
  position: fixed;
  top: 12px;
  right: 12px;
  z-index: 1030;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 2px solid ${Colors.woodDark};
  background: ${Colors.wood};
  color: ${Colors.goldLight};
  font-size: 20px;
  font-weight: 700;
  font-family: Helvetica, sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { color: ${Colors.white100}; border-color: ${Colors.goldLight}; }
`

const Title = styled.div<any>`
  font-family: Helvetica, sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: ${Colors.woodDark};
`

const List = styled.ul<any>`
  list-style: none;
  margin: 12px 0 4px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const Rule = styled.li<any>`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  color: ${Colors.ink};
  font-family: Helvetica, sans-serif;
  font-size: 14px;
  line-height: 1.4;
`

const Emoji = styled.span<any>`
  font-size: 18px;
  line-height: 1.3;
  flex: 0 0 22px;
`

const RULES = [
  ['🗺️', 'Explore', 'Clique une case adjacente à une case déjà ouverte pour la révéler.'],
  ['⚔️', 'Combats', 'Clique un monstre pour l\'attaquer. Un clic = un round.'],
  ['✨', 'Sorts', 'Sélectionne un sort dans la barre, puis clique un ennemi pour le lancer (cooldown en rounds).'],
  ['🗝️', 'Descends', 'Trouve la clé pour rejoindre l\'étage suivant, toujours plus profond.'],
  ['🐉', 'Boss', 'Tous les 5 étages, un boss verrouille la clé : bats-le pour passer.'],
  ['💰', 'Butin', 'Les coffres donnent de l\'or et parfois un objet, équipé automatiquement (il booste tes stats).'],
  ['⚠️', 'Pièges & alliés', 'Les pièges (⚠️) blessent, les alliés (💚 🔮 🛡️) soignent ou t\'offrent une faveur.'],
  ['🔒', 'Cases bloquées', 'Un cadenas signale une case bloquée par un monstre adjacent vivant.'],
  ['🏪', 'Progresse', 'Au menu, dépense ton or pour débloquer des classes et améliorer tes skills.']
]

export const HowToPlay = () => {
  const [isShowing, setShowing] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(HELP_KEY)) {
        setShowing(true)
      }
    } catch (err) {
      /* storage unavailable - just don't auto-open */
    }
  }, [])

  const close = () => {
    setShowing(false)
    try {
      localStorage.setItem(HELP_KEY, '1')
    } catch (err) { /* ignore */ }
  }

  return (
    <>
      <HelpButton onClick={() => setShowing(true)} title="Comment jouer" aria-label="Comment jouer">?</HelpButton>
      <Modal title={<Title>🎮 Comment jouer</Title>} isShowing={isShowing} hide={close}>
        <List>
          {RULES.map(([emoji, name, text]) => (
            <Rule key={name}>
              <Emoji>{emoji}</Emoji>
              <span><strong style={{ color: Colors.woodDark }}>{name}.</strong> {text}</span>
            </Rule>
          ))}
        </List>
      </Modal>
    </>
  )
}
