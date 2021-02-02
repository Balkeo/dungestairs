import React from "react";
import colors from "../Helper/Colors";

export const Character = ({
    character,
    player
}) => {
    return (
      <div style={style}>
        <div style={{ height: "256px", width: "256px" }}>
          <img src={character.profile} height="256" width="256" alt="Character icon" />
        </div>
        <div>
          <div style={{ height: "2em", display: "flex", lineHeight: "2em" }}>
            <div style={{ width: "85px" }}>
              PV : {character.hp}
            </div>
            <div style={{ width: "85px" }}>
              Atq : {character.atq}

            </div>
            <div style={{ width: "85px" }}>
              Spd : {character.spd}
            </div>
          </div>
          <div style={{ height: "2em", display: "flex", lineHeight: "2em" }}>
            <div style={{ width: "256px" }}>
              Gold : {player.gold ? player.gold : "0"}
            </div>
          </div>
          <div>Inventory :</div>
          <div>
            <div style={{ display: "flex" }}>
              <div
                style={{
                  width: "61px",
                  height: "61px",
                  backgroundColor: colors.light,
                  marginRight: "4px",
                  marginBottom: "4px"
                }}
              >
                { character.items.length > 0 ? character.items.map((itemValue, itemOffset) => {
                    return (
                        <div
                            style={{
                                width: "61px",
                                height: "61px",
                                backgroundColor: colors.light,
                                marginRight: "4px",
                                marginBottom: "4px"
                            }}
                        >
                            { itemValue[itemOffset] ?? "" }
                        </div>
                    );
                }) : "" }
              </div>
            </div>
          </div>
          <div>Item :</div>
        </div>
      </div>
    );
}

const style = {
  backgroundColor: colors.teal,
  display: "flex",
  justifyContent: "space-evenly",
  width: "100%",
  minHeight: "256px",
  zIndex: 5
};