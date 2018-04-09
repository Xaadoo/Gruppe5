// @flow
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Link, NavLink, HashRouter, Switch, Route } from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
const history = createHashHistory();
import { User, userService, memberService, Eventa, eventService } from './innloggingService';
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
          <NavLink activeStyle={{color: 'red'}} exact to='/members'>Medlemmer</NavLink>{' '}
          <NavLink activeStyle={{color: 'red'}} to='/signout'>Logg ut</NavLink>{' '}
        </div>
      );
    }
    return (
      <div>
        <NavLink activeStyle={{color: 'red'}} to='/signin'>Logg inn</NavLink>{' '}
        <NavLink activeStyle={{color: 'red'}} to='/newmember'>Ny Bruker</NavLink>{' '}
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
    if(menu) menu.forceUpdate();

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
  render() {
    return <div>
              <h1>Velkommen til Rød Fugl</h1>
                her skal det være en kalender, sjekk wireframes
            </div>
  }
}

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

              Navn: <input type="text" ref="addEventName" />
              Postnummer: <input type="text" ref="addZipCode" />
              Startdato: <input type="date" ref="addEventStartDate" />
              Sluttdato: <input type="date" ref="addEventEndDate" /><br />
              Beskrivelse: <textarea cols="40" rows="5" ref='addEventDescription' /><br /><br />
              Starttidspunkt: <input type="time" ref="addStartTime" />
              Sluttidspunkt: <input type="time" ref="addEndTime" /><br /><br />
              Oppmøtedato: <input type="date" ref="addMeetingDate" />
              Oppmøtested: <input type="text" ref="addMeetingPoint" />
              Oppmøtetidspunkt: <input type="time" ref="addMeetingTime" /><br />
              Kontaktperson: <input type="number" ref="addContactPerson" />
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
        if(errorMessage) errorMessage.set("Error adding event");
      });
    };
  }
  componentWillUnmount() {
    eventList = null;
  }
}
let eventList;
// class EventList extends React.Component<{}> {
  // constructor() {
  //   super();
  //
  //   this.events = [];
  // }
//
  //   render() {
  //     let listEvents = [];
  //     for(let eventa of this.events) {
  //       listEvents.push(<li key={eventa.id}><NavLink activeStyle={{color: 'red'}} to={'/event/'+eventa.id}>{eventa.eventName}</NavLink></li>);
  //     }
  // }
// }

class Event extends React.Component<{}> {
  // constructor(props) {
  //   super(props);
  //
  //   this.id = props.match.params.id;
  //   this.eventa = {};
  // }
  constructor() {
    super();

    this.events = [];
  }
  render() {
    let listEvents = [];
    for(let eventa of this.events) {
      listEvents.push(<li key={eventa.id}><NavLink activeStyle={{color: 'red'}} to={'/event/'+eventa.id}>{eventa.eventName}</NavLink></li>);
    }

    return (
            <div>
              <h1>Arrangement</h1><br />
              <ul>
                {listEvents}
              </ul>
              <button ref="goToEventButton">Opprett arrangement</button>
            </div>
      );
  }

  update() {
    eventService.getEvents().then((eventa) => {
      this.events = events;
      this.forceUpdate();
    }).catch((error) => {
      if(errorMessage) errorMessage.set('Error getting notes: ' + error.message);
    });
  }
  componentDidMount() {
    this.refs.goToEventButton.onclick = () => {
        history.push('/addevent');
        console.log("Hoppet til addevent");
    };
  }
}

//________________________________________________________________________________________________________________
// Nye medlemmer legges til her. Skal vi legge formen til en egen fil?
//________________________________________________________________________________________________________________

class NewMember extends React.Component<{}> {
  Refs: {
      username:HTMLInputElement,
      name:HTMLInputElement,
      middlename:HTMLInputElement,
      surname:HTMLInputElement,
      email:HTMLInputElement,
      passord:HTMLInputElement,
      passorRe:HTMLInputElement,
      birthdate:HTMLInputElement,
      adress:HTMLInputElement,
      phone:HTMLInputElement,
      addMemberButton:HTMLButtonElement
  }

  render() {
    return <div>
    <h1> Ny Bruker </h1>
    <form>
    <div>Brukernavn: <input type="text" ref="username" placeholder="OleBekk" required/></div>
    <div>Fornavn: <input type="text" ref="name" placeholder="Ole" required/></div>
    <div>Mellomnavn: <input type="text" ref="middlename" placeholder="McPearson"/></div>
    <div>Etternavn: <input type="text" ref="surname" placeholder="Hansen" required/></div>

    <div>E-mail:  <input type="email" ref="email" placeholder="mail@ntnu.no" required/></div>
    <div>Passord:  <input type="password" ref="passord" placholder="Passord" required/></div>
    <div>Gjenta passord:  <input type="password"/></div>


    <div>Fødselsdato:  <input type="date" ref="birthdate" required/></div>
    <div>Adresse:  <input type="text" ref="adress" placeholder="Oslogata 34a" required/></div>
    <div>Mobilnummer:  <input type="text" ref="phone" placeholder="11225588" required/></div>

    <input type="submit" ref="addMemberButton" value="Send"/>
    </form>
    </div>
  }
  componentDidMount() {
    newmember = this;
    this.refs.addMemberButton.onclick = () => {
      memberService.addMember(
                            this.refs.username.value,
                            this.refs.name.value,
                            this.refs.middlename.value,
                            this.refs.surname.value,
                            this.refs.email.value,
                            this.refs.passord.value,
                            this.refs.birthdate.value,
                            this.refs.phone.value,
                            this.refs.adress.value).then(console.log("THEN")).catch((error: Error) => {
        if(errorMessage) errorMessage.set("Error making new profile.");
      });
    };
  }

  componentWillUnmount() {
    newmember = null;
  }

}
let newmember: ?NewMember;

class Members extends React.Component<{}> {
  render() {
    return <div>
              <h1>Medlemmer</h1>
              {members}
            </div>
  }
  componentDidMount() {

  }
}
let members: ?Members;

//________________________________________________________________________________________________________________
//________________________________________________________________________________________________________________


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
  }
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
          <Route exact path='/newmember' component={NewMember} />
          <Route exact path='/signout' component={SignOut} />
          <Route exact path='/event' component={Event} />
          <Route exact path='/addevent' component={AddEvent} />
          <Route exact path='/roles' component={Roles} />
          <Route exact path='/addrole' component={AddRole} />
          <Route exact path='/mypage' component={MyPage} />
          <Route exact path='/members' component={Members} />
          <Route exact path='/' component={Home} />
        </Switch>
      </div>
    </HashRouter>
  ), root);
};
