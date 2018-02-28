import React from "react";
import ReactDOM from "react-dom";
import { Link, HashRouter, Switch, Route } from "react-router-dom";

let {InnloggingMedlem} = require("./innlogging");
let {InnloggingAdministrator} = require("./innlogging");

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
