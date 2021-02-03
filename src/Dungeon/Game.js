import React from "react";

import { useDungeon } from "./useDungeon";
import { useCharacter } from "./useCharacter";
import { usePlayer } from "./usePlayer";

import { Character } from "./Character";
import { Floor } from "./Floor";
import { Cell } from "./Cell";

import colors from "../Helper/Colors";

export const Game = ({selectedCharacter = 0}) => {
    const size = 5;
    let { floor, openClosedCell, depth } = useDungeon(size);
    let { character, takeDamage } = useCharacter(selectedCharacter);
    let { player, addGold } = usePlayer();

    return (
        <div
            style={{
                backgroundColor: colors.light,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%"
                /*backgroundImage: `url(${Stone})`,
                backgroundRepeat: "repeat"*/
            }}
        >
            <Floor size={size} depth={depth}>
                {floor.map((cellValue, cellOffset) => (
                    <Cell
                        key={cellOffset}
                        canClick={cellValue.canClick}
                        isOpen={cellValue.isOpen}
                        openCell={() => openClosedCell(cellValue.x, cellValue.y, character.atq)}
                        offset={cellOffset}
                        cellValue={cellValue}
                        addGold={() => addGold(cellValue.content)}
                        character={character}
                        takeDamage={cellValue.type === "monster" ? () => takeDamage(cellValue.content.atq) : null}
                    />
                ))}
            </Floor>
            <Character player={player} character={character} />
        </div>
    );
};
