import React from "react";
import Character from "./Character";
import { Floor } from "./Floor";
import { Cell } from "./Cell";

import colors from "../Helper/Colors";
import characters from "../Content/Characters";
import { calculate } from "../Helper/SkillCalculator";
import { useDungeon } from "./useDungeon";

export const Game = () => {
    const size = 5;
    let { floor, openClosedCell } = useDungeon(size, 1);

    let character = Object.assign({}, characters[0]);
    character = calculate(character);
    let player = {
        gold: 0
    };

    return (
        <div
            style={{
                backgroundColor: colors.light,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around"
            }}
        >
            <Floor size={size}>
                {floor.map((cellValue, cellOffset) => (
                    <Cell
                        key={cellOffset}
                        canClick={cellValue.canClick}
                        isOpen={cellValue.isOpen}
                        openCell={() => openClosedCell(cellValue.x, cellValue.y)}
                        offset={cellOffset}
                        cellValue={cellValue}
                    />
                ))}
            </Floor>
            <Character player={player} character={character} />
        </div>
    );
};
