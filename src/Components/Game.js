import React, { Component } from "react";
import Character from "./Character";
import Floor from "./Floor";

import { isEqual } from "lodash";

import colors from "../Helper/Colors";
import { random } from "../Helper/Utils";
import characters from "../Content/Characters";
import monsters from "../Content/Monsters";
import { calculate } from "../Helper/SkillCalculator";

const CELLTYPE = ["chest", "monster", "empty"];

// https://www.eioira.com/2012/12/dungelot.html

class Game extends Component {
  constructor() {
    super();
    let character = Object.assign({}, characters[0]);
    character = calculate(character);
    this.state = {
      player: {
        gold: 0
      },
      floorDepth: 1,
      character: character,
      floor: this.initFloor()
    };
  }

  initFloor = () => {
    let floor = [
      [
        { x: 0, y: 0, isOpen: false, type: "", content: "", canClick: false },
        { x: 0, y: 0, isOpen: false, type: "", content: "", canClick: false },
        { x: 0, y: 0, isOpen: false, type: "", content: "", canClick: false },
        { x: 0, y: 0, isOpen: false, type: "", content: "", canClick: false },
        { x: 0, y: 0, isOpen: false, type: "", content: "", canClick: false }
      ],
      [
        { x: 0, y: 0, isOpen: false, type: "", content: "", canClick: false },
        { x: 0, y: 0, isOpen: false, type: "", content: "", canClick: false },
        { x: 0, y: 0, isOpen: false, type: "", content: "", canClick: false },
        { x: 0, y: 0, isOpen: false, type: "", content: "", canClick: false },
        { x: 0, y: 0, isOpen: false, type: "", content: "", canClick: false }
      ],
      [
        { x: 0, y: 0, isOpen: false, type: "", content: "", canClick: false },
        { x: 0, y: 0, isOpen: false, type: "", content: "", canClick: false },
        { x: 0, y: 0, isOpen: false, type: "", content: "", canClick: false },
        { x: 0, y: 0, isOpen: false, type: "", content: "", canClick: false },
        { x: 0, y: 0, isOpen: false, type: "", content: "", canClick: false }
      ],
      [
        { x: 0, y: 0, isOpen: false, type: "", content: "", canClick: false },
        { x: 0, y: 0, isOpen: false, type: "", content: "", canClick: false },
        { x: 0, y: 0, isOpen: false, type: "", content: "", canClick: false },
        { x: 0, y: 0, isOpen: false, type: "", content: "", canClick: false },
        { x: 0, y: 0, isOpen: false, type: "", content: "", canClick: false }
      ],
      [
        { x: 0, y: 0, isOpen: false, type: "", content: "", canClick: false },
        { x: 0, y: 0, isOpen: false, type: "", content: "", canClick: false },
        { x: 0, y: 0, isOpen: false, type: "", content: "", canClick: false },
        { x: 0, y: 0, isOpen: false, type: "", content: "", canClick: false },
        { x: 0, y: 0, isOpen: false, type: "", content: "", canClick: false }
      ],
      [
        { x: 0, y: 0, isOpen: false, type: "", content: "", canClick: false },
        { x: 0, y: 0, isOpen: false, type: "", content: "", canClick: false },
        { x: 0, y: 0, isOpen: false, type: "", content: "", canClick: false },
        { x: 0, y: 0, isOpen: false, type: "", content: "", canClick: false },
        { x: 0, y: 0, isOpen: false, type: "", content: "", canClick: false }
      ]
    ];
    let exitCell = {
      x: random(5),
      y: random(6)
    };
    let keyCell = {};
    do {
      keyCell = {
        x: random(5),
        y: random(6)
      };
    } while (exitCell.x === keyCell.x && exitCell.y === keyCell.y);

    for (let row = 0; row < 6; row++) {
      for (let cel = 0; cel < 5; cel++) {
        let type = CELLTYPE[random(3)];
        floor[row][cel] = {
          ...floor[row][cel],
          type: type,
          content: this.setContent(type),
          canClick: false,
          x: cel,
          y: row
        };
      }
    }
    floor[exitCell.y][exitCell.x] = {
      ...floor[exitCell.y][exitCell.x],
      type: "Exit",
      content: "",
      canClick: false,
      isOpen: true
    };
    floor[keyCell.y][keyCell.x] = {
      ...floor[keyCell.y][keyCell.x],
      type: "Key",
      content: "",
      canClick: false
    };

    this.checkOpenStatusOfAllCells(floor);

    return floor;
  };

  componentWillUpdate() {
    let floor = Object.assign({}, this.state.floor);
    let character = Object.assign({}, this.state.character);

    this.checkOpenStatusOfAllCells(floor);

    if (!isEqual(floor, this.state.floor)) {
      this.setState((prevState) => ({
        ...this.state,
        character,
        floor
      }));
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log(!isEqual(this.state, nextState), this.state, nextState)
  //   return !isEqual(this.state, nextState)
  // }

  checkOpenStatusOfAllCells = (floor) => {
    for (let y = 0; y < 6; y++) {
      for (let x = 0; x < 5; x++) {
        floor[y][x] = {
          ...floor[y][x],
          canClick: this.canClickAtPos(floor, x, y)
        };
      }
    }
  };

  canClickAtPos = (floor, x, y) => {
    let canClick = false;
    if (floor[y][x].canClick) {
      return true;
    }
    if (x > 0) {
      canClick =
        this.isOpen(floor, x - 1, y) && this.isNotMonsterCell(floor, x - 1, y);
      if (canClick) {
        return true;
      }
    }
    if (x < 4) {
      canClick =
        this.isOpen(floor, x + 1, y) && this.isNotMonsterCell(floor, x + 1, y);
      if (canClick) {
        return true;
      }
    }
    if (y < 5) {
      canClick =
        this.isOpen(floor, x, y + 1) && this.isNotMonsterCell(floor, x, y + 1);
      if (canClick) {
        return true;
      }
    }
    if (y > 0) {
      canClick =
        this.isOpen(floor, x, y - 1) && this.isNotMonsterCell(floor, x, y - 1);
      if (canClick) {
        return true;
      }
    }

    return canClick;
  };

  isOpen = (floor, x, y) => {
    if (x < 0 || y < 0 || x > 4 || y > 5) {
      console.log("POS ERROR");
      return false;
    }
    return floor[y][x].isOpen;
  };

  isNotMonsterCell = (floor, x, y) => {
    if (floor[y][x].type !== "monster") {
      return true;
    }
    return floor[y][x].content.hp <= 0;
  };

  openCell = (x, y) => {
    let floor = Object.assign({}, this.state.floor);
    let player = Object.assign({}, this.state.player);

    if (!this.state.floor[y][x].isOpen) {
      if (this.state.floor[y][x].canClick) {
        floor[y][x].isOpen = true;
      }
    } else {
      switch (floor[y][x].type) {
        case "empty":
          break;
        case "chest":
          player.gold = player.gold + floor[y][x].content;
          floor[y][x].content = 0;
          break;
        case "monster":
          this.fight(x, y);
          break;
        case "Key":
          this.setState((prevState) => ({
            ...prevState,
            floorDepth: this.state.floorDepth + 1
          }));
          floor = this.initFloor();
          break;
        default:
          break;
      }
    }
    this.checkOpenStatusOfAllCells(floor);
    this.setState((prevState) => ({
      ...prevState,
      player,
      floor
    }));
  };

  fight = (x, y) => {
    let floor = Object.assign({}, this.state.floor);
    let character = Object.assign({}, this.state.character);
    if (floor[y][x].content.spd > character.spd) {
      character.hp = character.hp - floor[y][x].content.atq;
      if (character.hp <= 0) {
        character.hp = 0;
        this.setState((prevState) => ({
          ...this.state,
          character: character,
          floor: floor
        }));
        return;
      }
      floor[y][x].content.hp = floor[y][x].content.hp - character.atq;
    } else {
      floor[y][x].content.hp = floor[y][x].content.hp - character.atq;
      if (floor[y][x].content.hp <= 0) {
        floor[y][x].content.hp = 0;
        this.setState((prevState) => ({
          ...this.state,
          character: character,
          floor: floor
        }));
        return;
      }
      character.hp = character.hp - floor[y][x].content.atq;
    }

    this.setState((prevState) => ({
      ...prevState,
      character: character,
      floor: floor
    }));
  };

  setContent = (type) => {
    switch (type) {
      case "empty":
        return "";
      case "chest":
        return this.getChestContent();
      case "monster":
        return this.initMonsterCell();
      default:
        return;
    }
  };

  getChestContent = () => {
    return 5 + random(10);
  };

  initMonsterCell = () => {
    let monster = Object.assign({}, monsters[random(monsters.length)]);
    let difficulty = this.state ? this.state.floorDepth : 1;
    monster = { ...monster, level: difficulty };
    monster = calculate(monster);
    return monster;
  };

  render() {
    return (
      <div style={style}>
        <Character
          player={this.state.player}
          character={this.state.character}
        />
        <Floor
          character={this.state.character}
          openCell={this.openCell}
          floor={this.state.floor}
        />
        <div
          style={{
            backgroundColor: colors.teal,
            width: "256px",
            minHeight: "100%",
            zIndex: 5
          }}
        >
          ...
        </div>
      </div>
    );
  }
}

const style = {
  backgroundColor: colors.light,
  display: "flex"
};

export default Game;
