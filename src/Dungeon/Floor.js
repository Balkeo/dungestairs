import React from "react";
import colors from "../Helper/Colors";

export const Floor = ({ children, size }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplate: `repeat(${size}, 1fr) / repeat(${size}, 1fr)`,
        gridGap: "12px",
        width: `${size * 110}px`,
        height: `${size * 110}px`,
        padding: "12px",
        backgroundColor: colors.grayDark,
        margin: "0 auto"
      }}
    >
      {children}
    </div>
  );
};
