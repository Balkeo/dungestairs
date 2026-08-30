import React, { useState } from 'react'
import './styles.css'
import { Game } from './Dungeon/Game'
import { MainMenu } from './Dungeon/MainMenu'
import { TitleScreen } from './Dungeon/TitleScreen'
import { HowToPlay } from './Dungeon/HowToPlay'
import { Settings } from './Dungeon/Settings'
import { Records } from './Dungeon/Records'
import { usePlayer } from './Dungeon/usePlayer'
import Colors from './Helper/Colors'

const App = () => {
  const { player, addGold, removeGold, selectCharacter, removeSelectedCharacter, restartRun, recordRun, buyCharacter, upgradeCharacterSkill, upgradeCharacterSpell } = usePlayer()
  const [started, setStarted] = useState(false)
  const onTitle = !started && !player.inGame

  return (
    <div className="App" style={{ backgroundColor: Colors.woodDark }}>
      {!onTitle && <HowToPlay />}
      {!onTitle && <Settings />}
      {!onTitle && <Records player={player} />}
      {player.inGame
        ? <Game key={player.runId} player={player} addGold={addGold} removeGold={removeGold} removeSelectedCharacter={removeSelectedCharacter} restartRun={restartRun} recordRun={recordRun}/>
        : started
          ? <MainMenu player={player} selectCharacter={selectCharacter} buyCharacter={buyCharacter} upgradeCharacterSkill={upgradeCharacterSkill} upgradeCharacterSpell={upgradeCharacterSpell} />
          : <TitleScreen player={player} onStart={() => setStarted(true)} />
      }
    </div>
  )
}

export default App
