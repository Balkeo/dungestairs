import React, { Component } from "react";
import colors from "../Helper/Colors";
import openedChest from "../Assets/opened-chest.png";
import closedChest from "../Assets/closed-chest.png";
import cantOpen from "../Assets/cant-open.png";

const style = {
  backgroundColor: colors.grayDark,
  width: "149.6px",
  maxWidth: "149.6px",
  height: "149.6px",
  maxHeight: "149.6px",
  lineHeight: "149.6px",
  textAlign: "center",

  color: colors.white
};

class Cell extends Component {
  cellStyle = () => {
    return {
      ...style,
      backgroundColor: this.props.cell.isOpen ? colors.gray : colors.grayDark,
      marginRight: this.props.margin ? "5px" : "0px",
      marginBottom: this.props.margin ? "5px" : "0px"
    };
  };

  render() {
    if (this.props.cell.isOpen) {
      switch (this.props.cell.type) {
        case "monster":
          return this.renderMonster();
        case "chest":
          return this.renderChest();
        default:
          return (
            <div
              className="Cell"
              style={this.cellStyle()}
              onClick={() =>
                this.props.openCell(this.props.cell.x, this.props.cell.y)
              }
            >
              {this.props.cell.type}
            </div>
          );
      }
    } else {
      return (
        <div
          className="Cell"
          style={this.cellStyle()}
          onClick={() =>
            this.props.openCell(this.props.cell.x, this.props.cell.y)
          }
        >
          {this.props.cell.canClick ? (
            ""
          ) : (
            <img
              alt="You can't open"
              src={cantOpen}
              width={149.6}
              height={149.6}
            />
          )}
        </div>
      );
    }
  }

  renderMonster = () => {
    return (
      <div
        className="Cell"
        style={{
          ...this.cellStyle(),
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
        onClick={() =>
          this.props.openCell(this.props.cell.x, this.props.cell.y)
        }
      >
        <img
          alt={this.props.cell.type}
          src={this.props.cell.content.icon}
          width={128.6}
          height={128.6}
        />
        <progress
          max={this.props.cell.content.maxHp}
          value={this.props.cell.content.hp}
          style={{ width: "149.6px" }}
        />
      </div>
    );
  };

  renderChest = () => {
    return (
      <div
        className="Cell"
        style={this.cellStyle()}
        onClick={() =>
          this.props.openCell(this.props.cell.x, this.props.cell.y)
        }
      >
        <img
          alt={this.props.cell.type}
          src={this.props.cell.content > 0 ? closedChest : openedChest}
          width={149.6}
          height={149.6}
        />
      </div>
    );
  };
}

export default Cell;
