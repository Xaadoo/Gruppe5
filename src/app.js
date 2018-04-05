// @flow
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Link, NavLink, HashRouter, Switch, Route } from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
const history = createHashHistory();
import { userService, eventService, memberService } from './innloggingService';
//skrev Eventa fordi Event er et reservert ord

class ErrorMessage extends React.Component<{}> {
  refs: {
    closeButton: HTMLButtonElement
  };

  message = '';

  render() {
    // Only show when this.message is not empty
    let displayValue;
    if(this.message=='') displayValue = 'none';
    else displayValue = 'inline';

    return (
      <div style={{display: displayValue}}>
        <b><font color='red'>{this.message}</font></b>
        <button ref='closeButton'>x</button>
      </div>
    );
  }

  componentDidMount() {
    errorMessage = this;
    this.refs.closeButton.onclick = () => {
      this.message = '';
      this.forceUpdate();
    };
  }

  componentWillUnmount() {
    errorMessage = null;
  }

  set(post: string) {
    this.message = post;
    this.forceUpdate();
  }
}
let errorMessage: ?ErrorMessage;

class Menu extends React.Component<{}> {
  render() {
    let signedInUser = userService.getSignedInUser();
    if(signedInUser) {
      return (
        <div>
          <NavLink activeStyle={{color: 'red'}} exact to='/'>Hjem</NavLink>{' '}
          <NavLink activeStyle={{color: 'red'}} exact to='/event'>Arrangement</NavLink>{' '}
          <NavLink activeStyle={{color: 'red'}} exact to='/crew'>Mannskap</NavLink>{' '}
          <NavLink activeStyle={{color: 'red'}} exact to='/roles'>Roller</NavLink>{' '}
          <NavLink activeStyle={{color: 'red'}} exact to='/mypage'>Min Side</NavLink>{' '}
          <NavLink activeStyle={{color: 'red'}} to='/signout'>Logg ut</NavLink>{' '}
        </div>
      );
    }
    return (
      <div>
        <NavLink activeStyle={{color: 'red'}} to='/signin'>Logg inn</NavLink>{' '}
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

class SignIn extends React.Component<{}> {
  refs: {
    signInUsername: HTMLInputElement,
    signInPassword: HTMLInputElement,
    signInButton: HTMLButtonElement
  }

  render() {
    return (
      <div>
        <h1> Innlogging </h1>
            <input type="text" ref="signInUsername" />
            <input type="password" ref="signInPassword" />
          <button ref="signInButton">Logg inn</button>
      </div>
    );
  }

  componentDidMount() {
    if(menu) {
        menu.forceUpdate();
    }

    this.refs.signInButton.onclick = () => {
      userService.signIn(this.refs.signInUsername.value, this.refs.signInPassword.value).then(() => {
        history.push('/');
        console.log("Logget inn confirmed!");
      }).catch((error: Error) => {
        if(errorMessage) errorMessage.set("Incorrect username");
      });
    };
  }
}

class Home extends React.Component<{}> {
    constructor() {
        super();
        this.members = [];
    }
    render() {
        let listMembers= [];
        for(let member of this.members) {
            listMembers.push(<li key={member.ID}>{member.Fornavn}</li>) //use key prop for optimalization
        }

        return <div>
            <h1>Hjem</h1><br/>
            <div>
                {listMembers}
            </div>
        </div>;
    }


    componentDidMount() {
        memberService.getMembers().then((members) => {
            this.members = members;
            this.forceUpdate();
        }).catch((error) => {
            if (errorMessage) errorMessage.set('Error getting members: ' + error.message);
        });
        memberList = this;
    }
}
let memberList;

class AddEvent extends React.Component<{}> {
  refs: {
    addEventName: HTMLInputElement,
    addZipCode: HTMLInputElement,
    addEventStartDate: HTMLInputElement,
    addEventEndDate: HTMLInputElement,
    addEventDescription: HTMLInputElement,
    addStartTime: HTMLInputElement,
    addEndTime: HTMLInputElement,
    addMeetingDate: HTMLInputElement,
    addMeetingPoint: HTMLInputElement,
    addMeetingTime: HTMLInputElement,
    addContactPerson: HTMLInputElement,
    addEventButton: HTMLButtonElement
  }
  render() {
    return <div>
              <h1>Opprett arrangement</h1><br />

              Navn: <input type="text" ref="eventName" />
              Postnummer: <input type="text" ref="zipCode" />
              Startdato: <input type="text" ref="eventStartDate" />
              Slutdato: <input type="text" ref="eventEndDate" /><br />
              Beskrivelse: <textarea cols="40" rows="5" ref='eventDescription' /><br /><br />
              Starttidspunkt: <input type="text" ref="startTime" />
              Sluttidspunkt: <input type="text" ref="endTime" /><br /><br />
              Oppmøtedato: <input type="text" ref="meetingDate" />
              Oppmøtested: <input type="text" ref="meetingPoint" />
              Oppmøtetidspunkt: <input type="text" ref="meetingTime" /><br />
              Kontaktperson: <input type="text" ref="contactPerson" />
              Vaktmal:<br />
              Utstyrsliste: <br /><br />

            <button ref="addEventButton">Opprett arrangement</button>
            </div>
  }

  componentDidMount() {
    eventList = this;
    this.refs.addEventButton.onclick = () => {
      eventService.addEvent(this.refs.addEventName.value,
                            this.refs.addZipCode.value,
                            this.refs.addEventStartDate.value,
                            this.refs.addEventEndDate.value,
                            this.refs.addEventDescription.value,
                            this.refs.addStartTime.value,
                            this.refs.addEndTime.value,
                            this.refs.addMeetingDate.value,
                            this.refs.addMeetingPoint.value,
                            this.refs.addMeetingTime.value,
                            this.refs.addContactPerson.value).then((id) => {
        history.push('/addevent/'+id);
        console.log("Arrangmenet lagt til!");
      }).catch((error: Error) => {
        if(errorMessage) errorMessage.set("Error adding the event.");
      });
    };
  }
  componentWillUnmount() {
    eventList = null;
  }
}

class Event extends React.Component<{}> {

  constructor() {
    super();
    this.events = [];
  }
  render() {
    let listEvents = [];
    for(let eventa of this.events) {
        listEvents.push(<li key={eventa.idArrangementer}>{eventa.Arrangement_Navn}</li>) //bruker key prop for optimalisering
    }

      return <div>
          <h1>Arrangement</h1><br/>
          <div>
              {listEvents}
          </div>
          <button ref="goToEventButton">Opprett arrangement</button>
      </div>;
  }


  componentDidMount() {
      eventService.getEvents().then((events) => {
          this.events = events;
          this.forceUpdate();
      }).catch((error) => {
          if (errorMessage) errorMessage.set('Error getting notes: ' + error.message);
      });
      eventList = this;
      this.refs.goToEventButton.onclick = () => {
          history.push('/addevent');
          console.log("Hoppet til addevent");
      };
  }
}
let eventList;

class Crew extends React.Component<{}> {
  render() {
    return <div>
              <h1>Mannskap</h1>

            </div>
  }
}

class Roles extends React.Component<{}> {
  render() {
    return <div>
              <h1>Roller</h1>
              <button ref="goToRoleButton">Opprett rolle</button>
            </div>
  }
  componentDidMount() {
    this.refs.goToRoleButton.onclick = () => {
      history.push('/addrole');
      console.log("Hoppet til addrole");
    };
  }
}

class AddRole extends React.Component<{}> {
  refs: {
    roleName: HTMLInputElement,
    roleDescription: HTMLInputElement,
    addRoleButton: HTMLButtonElement
  };
  render() {
    return <div>
              <h1>Opprett rolle</h1><br />

              Navn: <input type="text" ref="roleName" /><br />
              Beskrivelse: <input type="text" ref="roleDescription" />
              Vaktmal:<br />
              Kurs?: <br /><br />

            <button ref="addRoleButton">Opprett rolle</button>
            </div>
  }
}

class MyPage extends React.Component<{}> {
  render() {
    return (
            <div>
              <h1>Min side</h1>
                info info info
            </div>
    )
  }

  componentDidMount() {}

  // Called when the this.props-object change while the component is mounted
  // For instance, when navigating from path /user/1 to /user/2
  componentWillReceiveProps() {
    setTimeout(() => { this.componentDidMount(); }, 0); // Enqueue this.componentDidMount() after props has changed
    }
  }

class SignOut extends React.Component<{}> {
  refs: {
    signOut: HTMLInputElement
  };

  render() {
    return (<div><button ref="signOut">Press this button to sign out</button></div>);
  };

  componentDidMount() {
    signOut = this;
    this.refs.signOut.onclick = () => {
      userService.signOut();
      history.push("/signin");
      this.forceUpdate();
      console.log("Logget ut");
    };
  }
}

let signOut: ?SignOut;

let root = document.getElementById("root");
if(root) {
  ReactDOM.render((
    <HashRouter>
      <div>
        <ErrorMessage />
        <Menu />
        <Switch>
          <Route exact path="/signin" component={SignIn} />
          <Route exact path='/signout' component={SignOut} />
          <Route exact path='/event' component={Event} />
          <Route exact path='/addevent' component={AddEvent} />
          <Route exact path='/crew' component={Crew} />
          <Route exact path='/roles' component={Roles} />
          <Route exact path='/addrole' component={AddRole} />
          <Route exact path='/mypage:id' component={MyPage} />
          <Route exact path='/' component={Home} />
        </Switch>
      </div>
    </HashRouter>
  ), root);
};
