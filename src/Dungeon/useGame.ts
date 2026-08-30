import { useCallback, useEffect, useRef, useState } from 'react'
import { useDungeon } from './useDungeon'
import { useCharacter, MAX_RELICS } from './Character/useCharacter'
import { resolveFight } from './resolveFight'
import { eventsToTexts, goldText, itemText, plainText } from './combatText'
import { rollItemDrop, blessing } from '../Helper/loot'
import { rollShopStock, itemPrice } from '../Helper/shop'
import { Relics, Events } from '../Content'
import { sfx } from '../Helper/sound'
import Colors from '../Helper/Colors'
import { rng } from '../Helper/rng'

// Sum a numeric field across the relics matching a kind/effect.
const relicSum = (relics = [], kind, effect) => relics
  .filter((relic) => relic.kind === kind && (effect === undefined || relic.effect === effect))
  .reduce((total, relic) => total + Number(relic.amount || 0), 0)

const ALLY_TYPES = ['healer', 'mage', 'knight', 'merchant']

export const useGame = (player = ({} as any), recordRun = ((() => []) as any), addGold = ((() => {}) as any), removeGold = ((() => {}) as any)) => {
  const size = 5
  const modifiers = (player.challenge && player.challenge.modifiers) || {}
  const goldMult = modifiers.goldMultiplier || 1
  const { floor, openClosedCell, depth, exitToNextDepth, updateCell } = useDungeon(size, 1, player.seed, modifiers)
  const { character, updateCharacter, addItem, removeItem, addBoon, clearBoons, addRelic } = useCharacter(player.characters[player.selectedCharacter])

  // A random relic the character does not already own (bosses drop these).
  const rollRelic = () => {
    const ownedRelics = character.relics || []
    if (ownedRelics.length >= MAX_RELICS) {
      return null
    }
    const owned = new Set(ownedRelics.map((relic) => relic.id))
    const pool = Relics.filter((relic) => !owned.has(relic.id))
    if (pool.length === 0) {
      return null
    }
    return { ...pool[Math.floor(rng() * pool.length)] }
  }

  // Sell price of an item at a merchant: half its shop value, floored, min 1.
  const sellValue = (item) => Math.max(1, Math.floor(itemPrice(item) / 2))

  const [queuedSpell, setQueuedSpell] = useState(null)
  const queuedSpellRef = useRef(null)

  // Merchant shop: stock is generated once per merchant tile (kept in a ref so
  // reopening the same trader shows the same, partly-bought stock) and surfaced
  // through `shop` when the trader is open.
  const [shop, setShop] = useState(null)
  const shopStocksRef = useRef({})

  const openMerchant = (cell) => {
    if (!shopStocksRef.current[cell.offset]) {
      shopStocksRef.current[cell.offset] = rollShopStock(depth, 3)
    }
    setShop({ offset: cell.offset, items: shopStocksRef.current[cell.offset] })
  }
  const closeShop = () => setShop(null)

  // Choice events: each event tile shows a scenario with a few choices. The
  // rolled event is remembered per tile, and consumed once resolved.
  const [event, setEvent] = useState(null)
  const eventDefsRef = useRef({})
  const resolvedEventsRef = useRef({})

  const openEvent = (cell) => {
    if (resolvedEventsRef.current[cell.offset]) {
      emitCell(cell.offset, [plainText('déjà visité', Colors.white50, 12)])
      return
    }
    if (!eventDefsRef.current[cell.offset]) {
      eventDefsRef.current[cell.offset] = Events[Math.floor(rng() * Events.length)]
    }
    setEvent({ offset: cell.offset, def: eventDefsRef.current[cell.offset] })
  }
  const closeEvent = () => setEvent(null)

  const applyOutcome = (outcome) => {
    switch (outcome.kind) {
      case 'gold': {
        const amount = Number(outcome.amount || 0)
        addGold(amount)
        if (amount > 0) addRunGold(amount)
        break
      }
      case 'hp': {
        const amount = Number(outcome.amount || 0)
        updateCharacter({ ...character, hp: Math.max(0, Math.min(character.maxHp, character.hp + amount)) })
        break
      }
      case 'item': {
        const hasSpace = (character.items || []).filter(Boolean).length < 8
        const drop = hasSpace ? rollItemDrop(depth + 1, 1) : null
        if (drop) addItem(drop)
        break
      }
      case 'relic': {
        const relic = rollRelic()
        if (relic) addRelic(relic)
        break
      }
      case 'boon': {
        const stat = outcome.stat || 'atq'
        const label = { atq: 'ATQ', def: 'DEF', spd: 'SPD' }[stat] || stat.toUpperCase()
        addBoon(blessing(`event_${stat}`, 'Bénédiction', '✨', `stats.${stat}`, '2', `+2 ${label}`))
        break
      }
      case 'random': {
        const options = outcome.options || []
        if (options.length) {
          const picked = options[Math.floor(rng() * options.length)]
          ;(picked.outcomes || []).forEach(applyOutcome)
        }
        break
      }
      default:
        break
    }
  }

  const resolveEventChoice = (index) => {
    if (!event) return
    const choice = event.def.choices[index]
    if (!choice) return
    if (choice.cost && player.gold < choice.cost) return
    if (choice.cost) addGold(-choice.cost)
    ;(choice.outcomes || []).forEach(applyOutcome)
    resolvedEventsRef.current[event.offset] = true
    setEvent(null)
  }

  const buyItem = (index) => {
    if (!shop) {
      return
    }
    const offer = shop.items[index]
    if (!offer || offer.sold) {
      return
    }
    const bagFull = (character.items || []).filter(Boolean).length >= 8
    if (bagFull || player.gold < offer.price) {
      return
    }
    const { sold, price, ...item } = offer // strip shop-only fields before equipping
    addItem(item)
    removeGold(offer.price)
    sfx.loot()
    const stock = shopStocksRef.current[shop.offset]
    if (stock && stock[index]) {
      stock[index].sold = true
    }
    setShop({ ...shop, items: shop.items.map((o, i) => (i === index ? { ...o, sold: true } : o)) })
  }

  const sellItem = (index) => {
    const item = (character.items || []).filter(Boolean)[index]
    if (!item) {
      return
    }
    const price = sellValue(item)
    removeItem(index)
    addGold(price)
    addRunGold(price)
    sfx.coin()
    setCharacterAction({ id: nextId(), texts: [goldText(price)] })
  }

  // Transient visual feedback + run bookkeeping.
  const actionId = useRef(0)
  const [cellAction, setCellAction] = useState(null)
  const [characterAction, setCharacterAction] = useState(null)
  const [depthBanner, setDepthBanner] = useState(null)

  // Run stats (kept in a ref too so the death effect reads the final values).
  const statsRef = useRef({ kills: 0, gold: 0, bossKills: 0 })
  const [runOver, setRunOver] = useState(null)
  const bumpKills = () => { statsRef.current = { ...statsRef.current, kills: statsRef.current.kills + 1 } }
  const bumpBossKills = () => { statsRef.current = { ...statsRef.current, bossKills: statsRef.current.bossKills + 1 } }
  const addRunGold = (amount) => { statsRef.current = { ...statsRef.current, gold: statsRef.current.gold + amount } }

  const nextId = () => ++actionId.current
  const emitCell = (offset, texts) => setCellAction({ id: nextId(), offset, texts })

  // COMEBACK challenge: each action may bring a slain monster back to life.
  const maybeRespawn = () => {
    if (!modifiers.respawn || rng() >= modifiers.respawn) {
      return
    }
    const dead = floor.filter((c) => c && c.type === 'monster' && c.isOpen && c.content && c.content.hp <= 0)
    if (!dead.length) {
      return
    }
    const target = dead[Math.floor(rng() * dead.length)]
    updateCell({ ...target, content: { ...target.content, hp: target.content.maxHp } })
    emitCell(target.offset, [plainText('revient !', Colors.red, 12)])
  }

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
      const summary = {
        depth,
        kills: statsRef.current.kills,
        gold: statsRef.current.gold,
        bossKills: statsRef.current.bossKills
      }
      const unlocked = recordRun(summary)
      setRunOver({ ...summary, unlocked })
    }
  }, [character]) // eslint-disable-line react-hooks/exhaustive-deps

  const springTrap = (cell) => {
    const damage = 1 + Math.floor(depth / 3)
    updateCharacter({ ...character, hp: Math.max(0, character.hp - damage) })
    emitCell(cell.offset, [plainText(`-${damage}`, Colors.red, 18)])
    setCharacterAction({ id: nextId(), texts: [plainText(`-${damage}`, Colors.red, 18)] })
    sfx.trap()
  }

  const applyAlly = (cell, addGold = ((() => {}) as any)) => {
    if (cell.type === 'healer') {
      const amount = Math.round(character.maxHp * 0.3)
      updateCharacter({ ...character, hp: Math.min(character.maxHp, character.hp + amount) })
      emitCell(cell.offset, [plainText(`+${amount}`, Colors.greenLight, 18)])
      setCharacterAction({ id: nextId(), texts: [plainText(`+${amount}`, Colors.greenLight, 18)] })
      sfx.heal()
      return
    }
    // Knight / mage allies grant a temporary boon for the current floor only.
    const boon = cell.type === 'knight'
      ? blessing('bless_guard', "Guard's Boon", '🛡️', 'stats.def', '1', '+1 DEF')
      : blessing('bless_arcane', 'Arcane Boon', '🔮', 'stats.atq', '1', '+1 ATQ')
    addBoon(boon)
    emitCell(cell.offset, [itemText(boon)])
    setCharacterAction({ id: nextId(), texts: [itemText(boon)] })
    sfx.loot()
  }

  const clickOnCell = (useCallback as any)(
    (x, y, addGold) => {
      if (runOver) {
        return
      }
      const offset = y * 5 + x
      const cell = floor[offset]
      if (!cell.canClick || cell.isBlocked) {
        return cell
      }
      maybeRespawn()
      if (!cell.isOpen) {
        openClosedCell(x, y)
        if (cell.type === 'trap') {
          springTrap(cell)
        } else if (cell.type === 'merchant') {
          openMerchant(cell)
        } else if (cell.type === 'event') {
          openEvent(cell)
        } else if (ALLY_TYPES.includes(cell.type)) {
          applyAlly(cell, addGold)
        }
        return cell
      }
      if (cell.type === 'merchant') {
        // Re-open the trader to keep shopping.
        openMerchant(cell)
        return cell
      }
      if (cell.type === 'event') {
        openEvent(cell)
        return cell
      }
      if (cell.type === 'chest') {
        const chestBonus = cell.content > 0
          ? Math.floor(cell.content * relicSum(character.relics || [], 'onChest', 'gold_bonus'))
          : 0
        const chestGold = Math.floor((cell.content + chestBonus) * goldMult)
        if (chestGold > 0) {
          addGold(chestGold)
          addRunGold(chestGold)
          sfx.coin()
        }
        const texts = chestGold > 0 ? [goldText(chestGold)] : []
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
        const events = fightResult.events
        const ko = events.some((e) => e.type === 'ko')
        const relics = character.relics || []

        // On-kill relics: heal and/or gold when the monster dies this hit.
        let nextChar = fightResult.character
        if (ko) {
          const healOnKill = relicSum(relics, 'onKill', 'heal')
          const goldOnKill = relicSum(relics, 'onKill', 'gold')
          if (healOnKill > 0) {
            nextChar = { ...nextChar, hp: Math.min(nextChar.maxHp, nextChar.hp + healOnKill) }
          }
          if (goldOnKill > 0) {
            addGold(goldOnKill)
            addRunGold(goldOnKill)
          }
        }

        updateCell({ ...cell, content: fightResult.monster })
        updateCharacter(nextChar)
        const id = nextId()
        setCellAction({ id, offset, texts: eventsToTexts(events, 'monster') })
        setCharacterAction({ id, texts: eventsToTexts(events, 'character') })
        if (events.some((e) => e.type === 'crit')) {
          sfx.crit()
        } else if (events.some((e) => e.on === 'monster' && ['hit', 'spell', 'poison'].includes(e.type))) {
          sfx.hit()
        }
        if (ko) {
          sfx.ko()
          bumpKills()
          // Elites drop a little bonus loot: extra gold and a chance of an item.
          if (cell.content && cell.content.isElite) {
            const bonusGold = Math.floor((2 + depth) * goldMult)
            addGold(bonusGold)
            addRunGold(bonusGold)
            const eliteTexts = [plainText('★ Élite', Colors.yellow, 12), goldText(bonusGold)]
            const hasSpace = (character.items || []).filter(Boolean).length < 8
            const drop = hasSpace ? rollItemDrop(depth + 1, 0.4) : null
            if (drop) {
              addItem(drop)
              eliteTexts.push(itemText(drop))
            }
            emitCell(offset, eliteTexts)
          }
          if (cell.content && cell.content.isBoss) {
            bumpBossKills()
            // The apex boss is a milestone, not an ending: celebrate and descend on.
            const apexTexts = cell.content.isFinalBoss
              ? [plainText('★ Seigneur du Donjon vaincu !', Colors.yellow, 14)]
              : []
            // Bosses drop a relic — or a gold purse if you already hold your relic.
            const relic = rollRelic()
            if (relic) {
              addRelic(relic)
              apexTexts.push(plainText('✦ Relique', Colors.yellow, 13), itemText(relic))
            } else {
              const purse = Math.floor((20 + depth * 3) * goldMult)
              addGold(purse)
              addRunGold(purse)
              apexTexts.push(goldText(purse))
            }
            emitCell(offset, apexTexts)
          }
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
        // On-floor relics trigger as you descend (heal is applied before boons are
        // cleared so it survives the recompute).
        const relics = character.relics || []
        const floorHeal = relicSum(relics, 'onFloor', 'heal')
        const floorGold = relicSum(relics, 'onFloor', 'gold')
        if (floorHeal > 0) {
          updateCharacter({ ...character, hp: Math.min(character.maxHp, character.hp + floorHeal) })
        }
        if (floorGold > 0) {
          addGold(floorGold)
          addRunGold(floorGold)
        }
        clearBoons() // ally boons only last for the floor they were granted on
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
    runOver,
    shop,
    buyItem,
    sellItem,
    closeShop,
    event,
    resolveEventChoice,
    closeEvent
  }
}
