import { useCallback, useEffect, useState } from "react";
import { random } from "../Helper/Utils";
import { isEqual } from "lodash";
import { useMonster } from "./useMonster"

const CELLTYPE = ["chest", "monster", "empty"];
const CELL = {
  x: 0,
  y: 0,
  isOpen: false,
  type: "",
  content: "",
  canClick: false
};

const getChestContent = () => {
  return 5 + random(10);
};

const initMonsterCell = (depth = 1) => {
  return useMonster(depth);
};

const setContent = (type, depth) => {
  switch (type) {
    case "empty":
      return "";
    case "chest":
      return getChestContent();
    case "monster":
      return initMonsterCell(depth);
    default:
      return;
  }
};

const generateCells = (size, depth) => {
  const ENTRANCECELLPOSS = {
    x: (size - 1) / 2,
    y: size - 1
  };
  const ENTRANCECELL = {
    type: "Entrance",
    content: "",
    canClick: false,
    isOpen: true,
    offset: ENTRANCECELLPOSS.y * size + ENTRANCECELLPOSS.x,
    x: ENTRANCECELLPOSS.x,
    y: ENTRANCECELLPOSS.y
  };

  let keyCell = {};
  do {
    keyCell = {
      x: random(size),
      y: random(size)
    };
  } while (keyCell.y * size + keyCell.x === ENTRANCECELL.offset);
  let cells = [...new Array(size ** 2)].map(() => CELL);

  for (let row = 0; row < size; row++) {
    for (let cell = 0; cell < size; cell++) {
      let offset = row * size + cell;
      let type = CELLTYPE[random(3)];
      cells[offset] = {
        ...cells[offset],
        type: type,
        content: setContent(type, depth),
        offset: offset,
        x: cell,
        y: row
      }
    }
  }

  cells[ENTRANCECELL.offset] = ENTRANCECELL;
  cells[keyCell.y * size + keyCell.x] = {
    ...cells[keyCell.y * size + keyCell.x],
    type: "Key",
    content: "",
    canClick: false,
    isOpen: false,
    offset: keyCell.y * size + keyCell.x,
    x: keyCell.x,
    y: keyCell.y
  };

  return cells;
};

export const useDungeon = (size = 5, depth = 1) => {
  let [cells, setCells] = useState(() => generateCells(size, depth));

  const assertCellExist = (x, y) => {
    if (x < 0 || y < 0 || x > 5 || y > 5) {
      // console.error(`POS ERROR for ${x} and ${y}`);
      return false;
    }
    let offset = y * 5 + x;
    if (typeof cells[offset] === "undefined") {
    // console.error(`CELL UNDEFINED for offset ${offset}`);
      return false;
    }
    return true;
  };

  const isOpen = (cell) => {
    return cell.isOpen;
  };

  const isNotMonsterCell = (cell) => {
    if (cell.type !== "monster") {
      return true;
    }
    return cell.content.hp <= 0;
  };

  const getAdjacentCells = (cell) => {
    let x = cell.x;
    let y = cell.y;
    let adjacentCells = [];
    let offset = 0;
    if (assertCellExist(x - 1, y)) {
      offset = y * 5 + (x-1);
      adjacentCells.push(cells[offset]);
    }
    if (assertCellExist(x + 1, y)) {
      offset = y * 5 + (x+1);
      adjacentCells.push(cells[offset]);
    }
    if (assertCellExist(x, y - 1)) {
      offset = (y-1) * 5 + x;
      adjacentCells.push(cells[offset]);
    }
    if (assertCellExist(x, y + 1)) {
      offset = (y+1) * 5 + x;
      adjacentCells.push(cells[offset]);
    }

    return adjacentCells;
  }

  const canClickOnCell = (cell) => {
    let canClick = false;
    if (cell.canClick) {
      return true;
    }
    let adjacentCells = getAdjacentCells(cell);
    adjacentCells.map((adjacentCell) => {
      canClick = canClick || (isOpen(adjacentCell) && isNotMonsterCell(adjacentCell));
      return adjacentCell;
    });

    return canClick;
  };

  const checkOpenStatusOfAllCells = () => {
    cells = cells.map((cellValue) => {
      var temp = Object.assign({}, cellValue);
      temp.canClick = canClickOnCell(cellValue);
      return temp;
    });
    return cells;
  };

  const monsterTakeDamage = (monster, damage = 0) => {
    return {
      ...monster,
      hp: monster.hp - damage
    };
  }

  const openClosedCell = useCallback(
      (x, y, characterDamage = 0) => {
        let offset = y * 5 + x;
        if (!assertCellExist(x, y)) {
          return;
        }
        setCells((previousCells) => {
          let newCells = [...previousCells];
          if (!newCells[offset].isOpen) {
            newCells[offset].isOpen = true;
          } else {
            switch (newCells[offset].type) {
              case "empty":
                break;
              case "chest":
                newCells[offset].content = 0;
                break;
              case "monster":
                newCells[offset].content = monsterTakeDamage(newCells[offset].content, characterDamage);
                break;
              case "Key":
                newCells = generateCells(size, depth + 1);
                break;
              default:
                break;
            }
          }
          return newCells;
        });
      },
      [cells, size, depth]
  );

  useEffect(() => {
    setCells((previousCells) => {
      let tempsCells = checkOpenStatusOfAllCells(cells);
      if (!isEqual(previousCells, tempsCells)) {
        return tempsCells;
      }
      return previousCells;
    });
  }, [cells]);


  return { floor: cells, openClosedCell };
};
