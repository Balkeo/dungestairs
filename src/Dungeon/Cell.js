import React, { useState } from "react";
import openedChest from "../Assets/Chest-opened.png";
import closedChest from "../Assets/Chest-closed.png";
import openedCell from "../Assets/Opened-Cell.jpg";
import closedCell from "../Assets/Closed-Cell.jpg";
import blocked from "../Assets/cant-open.png";

export const Cell = ({
    canClick = false,
    isOpen = false,
    openCell,
    offset = 0,
    cellValue = {},
    addGold,
    character,
    takeDamage,
    isBlocked
}) => {

    const [isHovered, setHover] = useState(false);

    const handleMouseOver = () => {
        setHover(true);
    };
    const handleMouseOut = () => {
        setHover(false);
    };

    return (
        <div
            onClick={
                 () => {
                     if (canClick) {
                         if (cellValue.isOpen && cellValue.type === "chest") {
                             addGold(cellValue.content);
                             openCell(cellValue.x, cellValue.y);
                         }
                         if (cellValue.isOpen && cellValue.type === "monster") {
                             let monster = cellValue.content;
                             if (character.spd < monster.spd) {
                                 takeDamage(monster.atq);
                                 openCell(cellValue.x, cellValue.y, character.atq);
                             } else {
                                 openCell(cellValue.x, cellValue.y, character.atq);
                                 takeDamage(monster.atq);
                             }
                         } else {
                             openCell(cellValue.x, cellValue.y);
                         }
                     }
                }
            }
            onMouseEnter={() => handleMouseOver()}
            onMouseLeave={() => handleMouseOut()}
            className="Cell"
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#f8f8f3",
                fontSize: "1em",
                fontWeight: "bold",
                fontFamily: "Helvetica, sans-serif",
                cursor: (isHovered && canClick) ? "pointer" : "default",
                width: "100px",
                height: "100px",
                backgroundImage: isOpen ? `url(${openedCell})` : `url(${closedCell})`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover'
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: '100%',
                    width: '100%',
                    backgroundColor: (isHovered && canClick) ? 'rgba(255, 255, 255, 0.3)' : ""
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column-reverse",
                        justifyContent: "",
                        alignItems: "center",
                        height: '90%',
                        width: '90%',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        backgroundImage:
                            !isOpen ? "" :
                                cellValue.type === "monster" ? `url(${cellValue.content.icon})` :
                                    cellValue.type === "chest" ? cellValue.content > 0 ? `url(${closedChest})` : `url(${openedChest})` :
                                        ""
                    }}
                >
                    {
                        !isOpen ? "" :
                            cellValue.type === "monster" ?
                                <progress
                                    max={cellValue.content.maxHp}
                                    value={cellValue.content.hp}
                                    style={{ width: "100px" }}
                                /> :
                                cellValue.type === "chest" ? "" :
                                    cellValue.type === "empty" ? "" :
                                        cellValue.type
                    }
                    {
                        isBlocked ?
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column-reverse",
                                    justifyContent: "",
                                    alignItems: "center",
                                    height: '90%',
                                    width: '90%',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: 'cover',
                                    backgroundImage: `url(${blocked})`
                                }}>
                            </div>
                            : ""
                    }
                </div>
            </div>
        </div>
    );
};
