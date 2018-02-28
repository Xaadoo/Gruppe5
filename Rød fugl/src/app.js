import React from "react";
import ReactDOM from "react-dom";
import { Link, HashRouter, Switch, Route } from "react-router-dom";

class StartSide extends React.Component {
  render() {
    return (
      <div>
        Valg:
        <Link to="/innloggingMedlem">Medlems Innlogging</Link>
        <Link to="/innloggingAdministrator">Administrator Innlogging</Link>
      </div>
    );
  }
}

class InnloggingMedlem extends React.Component {
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

  render() {
    return(
      <form onSubmit={this.handleSubmit}>
        <label>
          Brukernavn:
          <input type="text" value={this.state.brukernavn.value} onChange={this.handleBrukernavnChange} />
          Passord:
          <input type="password" value={this.state.passord.value} onChange={this.handlePassordChange} />
        </label>
        <input type="submit" value="submit" />
      </form>
    );
  }
}

class InnloggingAdministrator extends InnloggingMedlem {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (<div>InnloggingAdministrator</div>);
  }
}

ReactDOM.render((
  <HashRouter>
    <div>
      <StartSide />
      <Switch>
        <Route exact path="/innloggingmedlem" component={InnloggingMedlem} />
        <Route exact path="/innloggingadministrator" component={InnloggingAdministrator} />
      </Switch>
    </div>
  </HashRouter>
),
  document.getElementById("root")
);
