import React from "react";

export default class Address extends React.Component {
  render() {
    return (
      <div className="header">
        <p>Voici l'addresse que vous utilisez: </p>
        {this.props.addr}
      </div>
    );
  }
}
