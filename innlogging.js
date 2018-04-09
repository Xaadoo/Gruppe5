import React from "react";
import ReactDOM from "react-dom";

import { InnloggingService } from "./innloggingService.js"

class Menu extends React.Component<{}> {
  render() {
    let signedInUser = userService.getSignedInUser();
    if(signedInUser) {
      return (
        <div>
          <NavLink activeStyle={{color: 'green'}} exact to='/'>Home</NavLink>{' '}
        </div>
      );
    }
    return (
      <div>
        <NavLink activeStyle={{color: 'green'}} to='/signin'>Sign In</NavLink>{' '}
      </div>
    );
  }

  componentDidMount() {
    menu = this;
  }

  componentWillUnmount() {
    menu = null;
  }
}

let menu: ?Menu;

class Innlogging extends React.Component<{}> {
  refs: {
    signInUsername: HTMLInputElement,
    signInPassword: HTMLInputElement,
    signInButton: HTMLButtonElement
  }

  render() {
    return(
      <div>
        <h1> Innlogging </h1>
            <input type="text" ref="signInUsername" />
            </div>
            <div>
            Passord:
            <input type="password" ref="signInPassword" />
            </div>
          <button ref="signInButton">Sign In</button>
      </div>
    );
  }
}

componentDidMount() {
  if(menu) menu.forceUpdate();

  this.refs.signInButton.onclick = () => {
    userService.signIn(this.refs.signInUsername.value, this.refs.signInPassword).then(() => {
      history.push('/');
    }).catch((error: Error) => {
      if(errorMessage) errorMessage.set("Incorrect username");
    });
  };
}
