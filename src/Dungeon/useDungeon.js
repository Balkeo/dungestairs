import { useCallback, useEffect, useState } from "react";
import { random } from "../Helper/Utils";
import { calculate } from "../Helper/SkillCalculator";
import monsters from "../Content/Monsters";

const CELLTYPE = ["chest", "monster", "empty"];
const CELL = {
  x: 0,
  y: 0,
  isOpen: false,
  type: "",
  content: "",
  canClick: false
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

const getChestContent = () => {
  return 5 + random(10);
};

const initMonsterCell = (depth = 1) => {
  let monster = Object.assign({}, monsters[random(monsters.length)]);
  let difficulty = depth;
  monster = { ...monster, level: difficulty };
  monster = calculate(monster);
  return monster;
};

const generateFloor = (size, depth) => {
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
  let floor = [...new Array(size ** 2)].map(() => CELL);

  for (let row = 0; row < size; row++) {
    for (let cell = 0; cell < size; cell++) {
      let offset = row * size + cell;
      let type = CELLTYPE[random(3)];
      console.log(`Check cell for ${row} and ${cell} for type ${type}`);
      floor[offset].content = setContent(type, depth);
      floor[offset].offset = offset;
      floor[offset].x = cell;
      floor[offset].y = row;
    }
  }

  floor[ENTRANCECELL.offset] = ENTRANCECELL;
  floor[keyCell.y * size + keyCell.x] = {
    ...floor[keyCell.y * size + keyCell.x],
    type: "Key",
    content: "",
    canClick: false,
    isOpen: false,
    offset: keyCell.y * size + keyCell.x,
    x: keyCell.x,
    y: keyCell.y
  };

  return floor;
};

const assertCellExist = (floor, x, y) => {
  if (x < 0 || y < 0 || x > 5 || y > 5) {
    console.log(`POS ERROR for ${x} and ${y}`);
    return false;
  }
  let offset = y * 5 + x;
  if (typeof floor[offset] === "undefined") {
    console.log(`CELL UNDEFINED for offset ${offset}`);
    return false;
  }
  return true;
};

const isOpen = (floor, x, y) => {
  let offset = y * 5 + x;
  if (!assertCellExist(floor, x, y)) {
    return true;
  }
  return floor[offset].isOpen;
};

const isNotMonsterCell = (floor, x, y) => {
  let offset = y * 5 + x;
  if (!assertCellExist(floor, x, y)) {
    return true;
  }
  if (floor[offset].type !== "monster") {
    return true;
  }
  return floor[offset].content.hp <= 0;
};

const canClickAtPos = (floor, x, y) => {
  let canClick = false;
  let offset = y * 5 + x;
  if (!assertCellExist(floor, x, y)) {
    return false;
  }
  if (floor[offset].canClick) {
    return true;
  }
  canClick =
    isOpen(x - 1, y) ||
    isNotMonsterCell(x - 1, y) ||
    isOpen(x + 1, y) ||
    isNotMonsterCell(x + 1, y) ||
    isOpen(x, y - 1) ||
    isNotMonsterCell(x, y - 1) ||
    isOpen(x, y + 1) ||
    isNotMonsterCell(x, y + 1);

  return canClick;
};

export const useDungeon = (size = 5, depth = 1) => {
  let [floor, setFloor] = useState(() => generateFloor(size, depth));

  const checkOpenStatusOfAllCells = useCallback(() => {
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        let offset = y * 5 + x;
        let canClick = canClickAtPos(x, y);
        setFloor((previousCells) => {
          let newCells = [...previousCells];
          newCells[offset] = {
            ...floor[offset],
            canClick: canClick
          };
          return newCells;
        });
      }
    }
  }, [floor, canClickAtPos]);

  useEffect(() => {
    checkOpenStatusOfAllCells(floor);
  }, [floor, size, checkOpenStatusOfAllCells]);

  const openClosedCell = useCallback(
    (x, y) => {
      console.log(`Open cell for ${x} and ${y}`);
      let offset = y * 5 + x;
      if (!assertCellExist(floor, x, y)) {
        return;
      }
      setFloor((previousCells) => {
        if (previousCells[offset].isOpen) {
          console.error(`The cell is already open`);
          return previousCells;
        }

        let newCells = [...previousCells];
        switch (floor[offset].type) {
          case "empty":
            break;
          case "chest":
            //player.gold = player.gold + floor[offset].content;
            newCells[offset].content = 0;
            break;
          case "monster":
            //fight(x, y);
            break;
          case "Key":
            newCells = generateFloor(size, depth + 1);
            break;
          default:
            break;
        }
        checkOpenStatusOfAllCells(newCells);
        return newCells;
      });
    },
    [floor, size, depth, checkOpenStatusOfAllCells]
  );

  return { floor, openClosedCell };
};
