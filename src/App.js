import React from 'react'
import './styles.css'
import { Game } from './Dungeon/Game'
import { MainMenu } from './Dungeon/MainMenu'
import { usePlayer } from './Dungeon/usePlayer'
import Colors from './Helper/Colors'

const App = () => {
  const { player, addGold, selectCharacter, removeSelectedCharacter, buyCharacter, upgradeCharacterSkill } = usePlayer()

  return (
    <div className="App" style={{ backgroundColor: Colors.brown1 }}>
      {player.inGame
        ? <Game player={player} addGold={addGold} removeSelectedCharacter={removeSelectedCharacter}/>
        : <MainMenu player={player} selectCharacter={selectCharacter} buyCharacter={buyCharacter} upgradeCharacterSkill={upgradeCharacterSkill} />
      }
    </div>
  )
}

export default App
