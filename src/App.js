import React, { Component } from "react";
import "./styles.css";
import { Game } from "./Dungeon/Game";

class App extends Component {
  render() {
    return <div className="App">
      <Game />
    </div>;
  }
}

export default App;
