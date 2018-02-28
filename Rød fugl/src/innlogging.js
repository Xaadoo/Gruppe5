import React from "react";
import ReactDOM from "react-dom";

let {InnloggingService} = require("./innloggingService")

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
    loggInnMedlem();
    event.preventDefault();
  }
}

class InnloggingMedlem extends Innlogging {
  constructor(props) {
    super(props);
  }

  render() {
    return(
    <div>
      <h1> Medlems Innlogging </h1>
      <form onSubmit={InnloggingService.loggInnMedlem}>
        <label>
          Brukernavn:
          <input type="text" id="brukernavnMedlem" value={this.state.brukernavn.value} onChange={this.handleBrukernavnChange} />
          Passord:
          <input type="password" id="passordMedlem" value={this.state.passord.value} onChange={this.handlePassordChange} />
        </label>
        <input type="submit" id="loggInnMedlem" value="Logg inn" />
      </form>
    </div>
    );
  }
}

class InnloggingAdministrator extends Innlogging {
  constructor(props) {
    super(props);
  }

  render() {
    return (
    <div>
      <h1> Administrator Innlogging </h1>
      <form onSubmit={this.handleSubmit}>
        <label>
          Brukernavn:
          <input type="text" id="brukernavnAdmin" value={this.state.brukernavn.value} onChange={this.handleBrukernavnChange} />
          Passord:
          <input type="password" id="passordAdmin" value={this.state.passord.value} onChange={this.handlePassordChange} />
        </label>
        <input type="submit" id="loggInnAdmin" value="Logg inn" />
      </form>
    </div>
    );
  }
}

module.exports = {
  InnloggingMedlem: InnloggingMedlem,
  InnloggingAdministrator: InnloggingAdministrator
}
