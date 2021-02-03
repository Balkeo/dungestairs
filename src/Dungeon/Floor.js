import React from "react";
import colors from "../Helper/Colors";

export const Floor = ({ children, size, depth }) => {
  return (
      <div
          style={{
              display: "flex",
              flexDirection: "column"
          }}
      >
        <div
            style={{
                margin: "auto",
                marginTop: "15px",
                backgroundColor: colors.grayDark,
                color: colors.light,
                lineHeight: "20px",
                height: "20px",
                width: "130px",
                border: `1px solid ${colors.grayDark}`,
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px"
            }}
        >Depth : {depth}</div>
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
      </div>
  );
};
