import React from 'react'
import './styles.css'
import { Game } from './Dungeon/Game'
import { MainMenu } from './Dungeon/MainMenu'
import { usePlayer } from './Dungeon/usePlayer'
import Colors from './Helper/Colors'

const App = () => {
  const { player, addGold, selectCharacter } = usePlayer()

  return (
    <div className="App" style={{ backgroundColor: Colors.brown1 }}>
      {player.selectedCharacter !== null
        ? <Game player={player} addGold={addGold}/>
        : <MainMenu selectCharacter={selectCharacter} />
      }
    </div>
  )
}

export default App
