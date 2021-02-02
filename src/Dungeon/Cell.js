import React, { useRef, useState, useEffect } from "react";
import colors from "../Helper/Colors";
import openedChest from "../Assets/opened-chest.png";
import closedChest from "../Assets/closed-chest.png";

function useHover() {
  const [hover, setHover] = useState(false);

  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (node) {
      const handleMouseOver = () => {
        setHover(true);
      };
      const handleMouseOut = () => {
        setHover(false);
      };

      node.addEventListener("mouseover", handleMouseOver);
      node.addEventListener("mouseout", handleMouseOut);

      return () => {
        node.removeEventListener("mouseover", handleMouseOver);
        node.removeEventListener("mouseout", handleMouseOut);
      };
    }
  });
  return [ref, hover];
}

export const Cell = ({
  canClick = false,
  isOpen = false,
  openCell,
  offset = 0,
  cellValue = {}
}) => {
  const [ref, isHovered] = useHover();

  return (
    <div
      ref={ref}
      onClick={() => canClick && openCell(cellValue.x, cellValue.y)}
      className="Cell"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:
          !canClick && !isOpen
            ? colors.red
            : isOpen
            ? "#3E5770"
            : (isHovered || canClick) && !isHovered
            ? "#34495e"
            : "#3E5770",
        color: "#f8f8f3",
        fontSize: "1em",
        fontWeight: "bold",
        fontFamily: "Helvetica, sans-serif",
        cursor: isOpen ? "default" : canClick ? "pointer" : "default"
      }}
    >
      {isOpen ? (
        <>
          {cellValue.type === "monster" ? (
            <>
              <img
                alt={cellValue.type}
                src={cellValue.content.icon}
                width={130}
                height={130}
              />
              <progress
                max={cellValue.content.maxHp}
                value={cellValue.content.hp}
                style={{ width: "150px" }}
              />
            </>
          ) : cellValue.type === "chest" ? (
            <img
              alt={cellValue.type}
              src={cellValue.content > 0 ? closedChest : openedChest}
              width={149.6}
              height={149.6}
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
