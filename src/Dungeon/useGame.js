import { useCallback, useEffect, useRef, useState } from 'react'
import { useDungeon } from './useDungeon'
import { useCharacter } from './Character/useCharacter'
import { resolveFight } from './resolveFight'
import { eventsToTexts, goldText, itemText, plainText } from './combatText'
import { rollItemDrop, blessing } from '../Helper/loot'
import { sfx } from '../Helper/sound'
import Colors from '../Helper/Colors'

const ALLY_TYPES = ['healer', 'mage', 'knight']

export const useGame = (player = {}) => {
  const size = 5
  const { floor, openClosedCell, depth, exitToNextDepth, updateCell } = useDungeon(size)
  const { character, updateCharacter, addItem } = useCharacter(player.characters[player.selectedCharacter])

  const [queuedSpell, setQueuedSpell] = useState(null)
  const queuedSpellRef = useRef(null)

  // Transient visual feedback + run bookkeeping.
  const actionId = useRef(0)
  const [cellAction, setCellAction] = useState(null)
  const [characterAction, setCharacterAction] = useState(null)
  const [depthBanner, setDepthBanner] = useState(null)

  // Run stats (kept in a ref too so the death effect reads the final values).
  const statsRef = useRef({ kills: 0, gold: 0 })
  const [runOver, setRunOver] = useState(null)
  const bumpKills = () => { statsRef.current = { ...statsRef.current, kills: statsRef.current.kills + 1 } }
  const addRunGold = (amount) => { statsRef.current = { ...statsRef.current, gold: statsRef.current.gold + amount } }

  const nextId = () => ++actionId.current
  const emitCell = (offset, texts) => setCellAction({ id: nextId(), offset, texts })

  const queueSpell = (spellId) => {
    const next = queuedSpellRef.current === spellId ? null : spellId
    queuedSpellRef.current = next
    setQueuedSpell(next)
  }
  const clearQueuedSpell = () => {
    queuedSpellRef.current = null
    setQueuedSpell(null)
  }

  // Death -> run summary (the DeathScreen decides replay vs. menu).
  useEffect(() => {
    if (character.hp <= 0 && !runOver) {
      sfx.death()
      setRunOver({ depth, kills: statsRef.current.kills, gold: statsRef.current.gold })
    }
  }, [character]) // eslint-disable-line react-hooks/exhaustive-deps

  const springTrap = (cell) => {
    const damage = 1 + Math.floor(depth / 3)
    updateCharacter({ ...character, hp: Math.max(0, character.hp - damage) })
    emitCell(cell.offset, [plainText(`-${damage}`, Colors.red, 18)])
    setCharacterAction({ id: nextId(), texts: [plainText(`-${damage}`, Colors.red, 18)] })
    sfx.trap()
  }

  const applyAlly = (cell) => {
    if (cell.type === 'healer') {
      const amount = Math.round(character.maxHp * 0.3)
      updateCharacter({ ...character, hp: Math.min(character.maxHp, character.hp + amount) })
      emitCell(cell.offset, [plainText(`+${amount}`, Colors.greenLight, 18)])
      setCharacterAction({ id: nextId(), texts: [plainText(`+${amount}`, Colors.greenLight, 18)] })
      sfx.heal()
      return
    }
    const item = cell.type === 'knight'
      ? blessing('bless_guard', "Guard's Boon", '🛡️', 'stats.def', '1', '+1 DEF')
      : blessing('bless_arcane', 'Arcane Boon', '🔮', 'stats.atq', '1', '+1 ATQ')
    const hasSpace = (character.items || []).filter(Boolean).length < 8
    if (hasSpace) {
      addItem(item)
      emitCell(cell.offset, [itemText(item)])
      sfx.loot()
    } else {
      emitCell(cell.offset, [plainText('Sac plein', Colors.white50, 13)])
    }
  }

  const clickOnCell = useCallback(
    (x, y, addGold) => {
      if (runOver) {
        return
      }
      const offset = y * 5 + x
      const cell = floor[offset]
      if (!cell.canClick || cell.isBlocked) {
        return cell
      }
      if (!cell.isOpen) {
        openClosedCell(x, y)
        if (cell.type === 'trap') {
          springTrap(cell)
        } else if (ALLY_TYPES.includes(cell.type)) {
          applyAlly(cell)
        }
        return cell
      }
      if (cell.type === 'chest') {
        if (cell.content > 0) {
          addGold(cell.content)
          addRunGold(cell.content)
          sfx.coin()
        }
        const texts = cell.content > 0 ? [goldText(cell.content)] : []
        const hasSpace = (character.items || []).filter(Boolean).length < 8
        const drop = hasSpace ? rollItemDrop(depth) : null
        if (drop) {
          addItem(drop)
          texts.push(itemText(drop))
          sfx.loot()
        }
        updateCell({ ...cell, content: 0 })
        if (texts.length > 0) {
          emitCell(offset, texts)
        }
        return cell
      }
      if (cell.type === 'monster') {
        const spellId = queuedSpellRef.current
        const fightResult = resolveFight(cell.content, character, spellId)
        updateCell({ ...cell, content: fightResult.monster })
        updateCharacter(fightResult.character)
        const id = nextId()
        const events = fightResult.events
        setCellAction({ id, offset, texts: eventsToTexts(events, 'monster') })
        setCharacterAction({ id, texts: eventsToTexts(events, 'character') })
        if (events.some((e) => e.type === 'crit')) {
          sfx.crit()
        } else if (events.some((e) => e.on === 'monster' && ['hit', 'spell', 'poison'].includes(e.type))) {
          sfx.hit()
        }
        if (events.some((e) => e.type === 'ko')) {
          sfx.ko()
          bumpKills()
        }
        if (spellId) {
          clearQueuedSpell()
        }
        return cell
      }
      if (cell.type === 'Key') {
        const bossAlive = floor.some((c) => c && c.content && c.content.isBoss && c.content.hp > 0)
        if (bossAlive) {
          emitCell(offset, [plainText('🔒 Boss', Colors.red, 14)])
          return cell
        }
        setDepthBanner({ id: nextId(), depth: depth + 1 })
        sfx.key()
        exitToNextDepth()
      }
    }
  )

  return {
    size,
    floor,
    clickOnCell,
    depth,
    character,
    queuedSpell,
    queueSpell,
    cellAction,
    characterAction,
    depthBanner,
    runOver
  }
}
