import React from "react";
import ReactDOM from "react-dom";

import { InnloggingService } from "./innloggingService.js"

class Innlogging extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      brukernavn: "",
      passord: ""
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBrukernavnChange = this.handleBrukernavnChange.bind(this);
    this.handlePassordChange = this.handlePassordChange.bind(this);
  }

  handleBrukernavnChange(event) {
    this.setState({brukernavn: event.target.value});
  }

  handlePassordChange(event) {
    this.setState({passord: event.target.value});
  }

  handleSubmit(event) {
    InnloggingService.loggInn();
    event.preventDefault();
  }

  render() {
    return(
      <div>
        <h1> Innlogging </h1>
        <form onSubmit={this.handleSubmit}>
          <label>
            <div>
            Brukernavn:
            <input type="text" id="brukernavnMedlem" value={this.state.brukernavn.value} onChange={this.handleBrukernavnChange} />
            </div>
            <div>
            Passord:
            <input type="password" id="passordMedlem" value={this.state.passord.value} onChange={this.handlePassordChange} />
            </div>
          </label>
          <input type="submit" id="loggInnMedlem" value="Logg inn" />
        </form>
      </div>
    );
  }
}

module.exports = {
  Innlogging: Innlogging
}
