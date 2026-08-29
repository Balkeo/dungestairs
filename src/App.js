import React from 'react'
import './styles.css'
import { Game } from './Dungeon/Game'
import { MainMenu } from './Dungeon/MainMenu'
import { HowToPlay } from './Dungeon/HowToPlay'
import { Settings } from './Dungeon/Settings'
import { Records } from './Dungeon/Records'
import { usePlayer } from './Dungeon/usePlayer'
import Colors from './Helper/Colors'

const App = () => {
  const { player, addGold, removeGold, selectCharacter, removeSelectedCharacter, restartRun, recordRun, buyCharacter, upgradeCharacterSkill, upgradeCharacterSpell } = usePlayer()

  return (
    <div className="App" style={{ backgroundColor: Colors.brown1 }}>
      <HowToPlay />
      <Settings />
      <Records player={player} />
      {player.inGame
        ? <Game key={player.runId} player={player} addGold={addGold} removeGold={removeGold} removeSelectedCharacter={removeSelectedCharacter} restartRun={restartRun} recordRun={recordRun}/>
        : <MainMenu player={player} selectCharacter={selectCharacter} buyCharacter={buyCharacter} upgradeCharacterSkill={upgradeCharacterSkill} upgradeCharacterSpell={upgradeCharacterSpell} />
      }
    </div>
  )
}

export default App
