import React from "react";
import ReactDOM from "react-dom";

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
    alert("A log in request was sent!\nBrukernavn: " + this.state.brukernavn + " Passord: " + this.state.passord);
    event.preventdeDefault();
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
      <form onSubmit={this.handleSubmit}>
        <label>
          Brukernavn:
          <input type="text" value={this.state.brukernavn.value} onChange={this.handleBrukernavnChange} />
          Passord:
          <input type="password" value={this.state.passord.value} onChange={this.handlePassordChange} />
        </label>
        <input type="submit" value="submit" />
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
          <input type="text" value={this.state.brukernavn.value} onChange={this.handleBrukernavnChange} />
          Passord:
          <input type="password" value={this.state.passord.value} onChange={this.handlePassordChange} />
        </label>
        <input type="submit" value="submit" />
      </form>
    </div>
    );
  }
}

module.exports = {
  InnloggingMedlem: InnloggingMedlem,
  InnloggingAdministrator: InnloggingAdministrator
}
