import React from "react";
import ReactDOM from "react-dom";
import { Link, HashRouter, Switch, Route } from "react-router-dom";

let {Innlogging} = require("./innlogging");

class StartSide extends React.Component {
  render() {
    return (
      <div>
        Valg:
        <Link to="/innlogging">Innlogging</Link>
      </div>
    );
  }
}

ReactDOM.render((
  <HashRouter>
    <div>
      <StartSide />
      <Switch>
        <Route exact path="/innlogging" component={Innlogging} />
      </Switch>
    </div>
  </HashRouter>
),
  document.getElementById("root")
);
