import React from "react";

export const Floor = ({ children, size }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplate: `repeat(${size}, 1fr) / repeat(${size}, 1fr)`,
        gridGap: "12px",
        width: `${size * 100}px`,
        height: `${size * 100}px`,
        padding: "12px",
        backgroundColor: "#2c3e50",
        margin: "0 auto"
      }}
    >
      {children}
    </div>
  );
};
