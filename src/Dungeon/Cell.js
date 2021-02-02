import React, { useState } from "react";
import colors from "../Helper/Colors";
import openedChest from "../Assets/Chest-opened.png";
import closedChest from "../Assets/Chest-closed.png";

export const Cell = ({
    canClick = false,
    isOpen = false,
    openCell,
    offset = 0,
    cellValue = {},
    addGold,
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
                         }
                         openCell(cellValue.x, cellValue.y);
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
                backgroundColor:
                    !canClick && !isOpen
                        ? colors.red
                        : isOpen
                        ? colors.cyan
                        : (isHovered || canClick) && !isHovered
                            ? "#34495e"
                            : "#3E5770",
                color: "#f8f8f3",
                fontSize: "1em",
                fontWeight: "bold",
                fontFamily: "Helvetica, sans-serif",
                cursor: isOpen ? "default" : canClick ? "pointer" : "default",
                width: "100px",
                height: "100px"
            }}
        >
            {isOpen ? (
                <>
                    {cellValue.type === "monster" ? (
                        <div
                            className="Cell"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center"
                            }}>
                            <img
                                alt={cellValue.class}
                                src={cellValue.content.icon}
                                width={80}
                                height={80}
                            />
                            <progress
                                max={cellValue.content.maxHp}
                                value={cellValue.content.hp}
                                style={{ width: "100px" }}
                            />
                        </div>
                    ) : cellValue.type === "chest" ? (
                        <img
                            alt={cellValue.type}
                            src={cellValue.content > 0 ? closedChest : openedChest}
                            width={80}
                            height={80}
                        />
                    ) : cellValue.type !== "empty" ? (
                        cellValue.type
                    ) : (
                        ""
                    )}
                </>
            ) : (
                ""
            )}
        </div>
    );
};
