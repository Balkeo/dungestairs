import React, { Component } from 'react';
import Row from './Row';

class Floor extends Component {

  render() {
    return (
      <div style={{margin: 'auto', maxWidth: '768px'}}>
        <Row row={this.props.floor[0]} openCell={this.props.openCell}/>
        <Row row={this.props.floor[1]} openCell={this.props.openCell}/>
        <Row row={this.props.floor[2]} openCell={this.props.openCell}/>
        <Row row={this.props.floor[3]} openCell={this.props.openCell}/>
        <Row row={this.props.floor[4]} openCell={this.props.openCell}/>
        <Row row={this.props.floor[5]} openCell={this.props.openCell}/>
      </div>
    );
  }
}

export default Floor;
