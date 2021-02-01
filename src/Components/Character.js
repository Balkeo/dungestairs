import React, { Component } from "react";
import colors from "../Helper/Colors";
import char1 from "../Assets/char1.jpg";

class Character extends Component {
  render() {
    return (
      <div style={style}>
        <div style={{ height: "256px" }}>
          <img src={char1} height="256" width="256" alt="Character icon" />
        </div>
        <div style={{ height: "2em", display: "flex", lineHeight: "2em" }}>
          <div style={{ width: "85px" }}>
            PV :{" "}
            {this.props.character !== undefined ? this.props.character.hp : ""}
          </div>
          <div style={{ width: "85px" }}>
            Atq :{" "}
            {this.props.character !== undefined ? this.props.character.atq : ""}
          </div>
          <div style={{ width: "85px" }}>
            Spd :{" "}
            {this.props.character !== undefined ? this.props.character.spd : ""}
          </div>
        </div>
        <div style={{ height: "2em", display: "flex", lineHeight: "2em" }}>
          <div style={{ width: "256px" }}>
            Gold : {this.props.player.gold ? this.props.player.gold : ""}
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
              {this.props.character !== undefined
                ? this.props.character.items[0]
                : ""}
            </div>
            <div
              style={{
                width: "61px",
                height: "61px",
                backgroundColor: colors.light,
                marginRight: "4px",
                marginBottom: "4px"
              }}
            >
              {this.props.character !== undefined
                ? this.props.character.items[1]
                : ""}
            </div>
            <div
              style={{
                width: "61px",
                height: "61px",
                backgroundColor: colors.light,
                marginRight: "4px",
                marginBottom: "4px"
              }}
            >
              {this.props.character !== undefined
                ? this.props.character.items[2]
                : ""}
            </div>
            <div
              style={{
                width: "61px",
                height: "61px",
                backgroundColor: colors.light
              }}
            >
              {this.props.character !== undefined
                ? this.props.character.items[3]
                : ""}
            </div>
          </div>
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
              {this.props.character !== undefined
                ? this.props.character.items[4]
                : ""}
            </div>
            <div
              style={{
                width: "61px",
                height: "61px",
                backgroundColor: colors.light,
                marginRight: "4px",
                marginBottom: "4px"
              }}
            >
              {this.props.character !== undefined
                ? this.props.character.items[5]
                : ""}
            </div>
            <div
              style={{
                width: "61px",
                height: "61px",
                backgroundColor: colors.light,
                marginRight: "4px",
                marginBottom: "4px"
              }}
            >
              {this.props.character !== undefined
                ? this.props.character.items[6]
                : ""}
            </div>
            <div
              style={{
                width: "61px",
                height: "61px",
                backgroundColor: colors.light
              }}
            >
              {this.props.character !== undefined
                ? this.props.character.items[7]
                : ""}
            </div>
          </div>
        </div>
        <div>Item :</div>
      </div>
    );
  }
}

const style = {
  backgroundColor: colors.teal,
  width: "256px",
  minHeight: "100%",
  zIndex: 5
};

export default Character;
