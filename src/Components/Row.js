import React, { Component } from 'react';
import Cell from './Cell';

class Row extends Component {

  render() {
    return (
      <div style={style}>
        <Cell cell={this.props.row[0]}  openCell={this.props.openCell} margin={true}/>
        <Cell cell={this.props.row[1]}  openCell={this.props.openCell} margin={true}/>
        <Cell cell={this.props.row[2]}  openCell={this.props.openCell} margin={true}/>
        <Cell cell={this.props.row[3]}  openCell={this.props.openCell} margin={true}/>
        <Cell cell={this.props.row[4]}  openCell={this.props.openCell}/>
      </div>
    );
  }
}

const style = {
  display: "flex",
}

export default Row;
