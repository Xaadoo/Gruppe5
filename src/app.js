// @flow
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Link, NavLink, HashRouter, Switch, Route } from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
const history = createHashHistory();
import { userService, eventService, memberService, roleService, crewService, forgottonPasswordService } from './innloggingService';

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
        <div className ="navigate">
                <ul className={"navul"}>
                    <img className= "imgli" src="rodfugl.png" />
                    <li className={"navli"}><NavLink activeStyle={{color: 'white'}} exact to='/'>Hjem</NavLink>{' '}</li>
                    <li className={"navli"}><NavLink activeStyle={{color: 'white'}} exact to='/event'>Arrangement</NavLink>{' '}</li>
                    <li className={"navli"}><NavLink activeStyle={{color: 'white'}} exact to='/crew'>Mannskap</NavLink>{' '}</li>
                    <li className={"navli"}><NavLink activeStyle={{color: 'white'}} exact to='/roles'>Roller</NavLink>{' '}</li>
                    <li className={"navli"}><NavLink activeStyle={{color: 'white'}} exact to='/mypage'>Min Side</NavLink>{' '}</li>
                    <li className={"navli"}><NavLink activeStyle={{color: 'white'}} to='/signout'>Logg ut</NavLink>{' '}</li>
                    <li className={"aboutli"}><NavLink activeStyle={{color: 'white'}} to='/about'>Om</NavLink>{' '}</li>
                </ul>
        </div>
      );
    }
    return (
      <div>
        <NavLink activeStyle={{color: 'red'}} to='/signin'>Logg inn</NavLink>{' '}
        <NavLink activeStyle={{color: "red"}} to="/forgottonpassword">Glemt passord</NavLink>{" "}
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
  };

  render() {
    return (
      <div className ="limiter">
        <div className ="container-login100" style={ { backgroundImage: `url(require("image-background.jpg"))` } }>
            <div className ="wrap-login100">
                <form className ="login100-form">
                    <span className ="login100-form-logo">
                        <img src="rodfugl.png" />
                    </span>
                        <span className="login100-form-title p-b-34 p-t-27">
                            Innlogging
                        </span>
                            <div className="wrap-input100">
                            <input className="input100" placeholder="Brukernavn" type="text" ref="signInUsername" />
                                <span className="focus-input100">
                                </span>
                            </div>
                            <div className="wrap-input100">
                            <input className="input100" placeholder="Passord" type="password" ref="signInPassword" />
                                <span className="focus-input100">
                                </span>
                            </div>
                            <div className="container-login100-form-btn">
                                <button className="login100-form-btn" ref="signInButton">Logg inn</button>
                            </div>
                            <div className ="container-login100-form-btn">
                                <NavLink  to="/forgottonpassword">Glemt passord</NavLink>{" "}
                            </div>
                </form>
            </div>
        </div>
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

let validationNumberForForgottonPassword;
let emailForForgottonPassword;
let accountNameForForgottonPassword;

class ForgottonPassword extends React.Component<{}> {
    refs: {
        emailAddress: HTMLInputElement,
        recoverPasswordButton: HTMLButtonElement
    }

    render() {
        return (
            <div className ="limiter">
                <div className ="container-login100" style={ { backgroundImage: `url(require("image-background.jpg"))` } }>
                    <div className ="wrap-login100">
                        <form className ="login100-form">
                            <span className="login100-form-title p-b-34 p-t-27">
                            Glemt passord
                        </span>
                            <div className="wrap-input100">
                                <input className ="input100" type="text" ref="emailAddress" placeholder ="E-post"/>
                                <span className="focus-input100">
                                </span>
                            </div>
                        </form>
                            <button className ="button1" ref="recoverPasswordButton">
                                Gjenopprett passord
                            </button>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.refs.recoverPasswordButton.onclick = () => {
            forgottonPasswordService.getUserFromEmail(this.refs.emailAddress.value).then((result) => {
                accountNameForForgottonPassword = result.Fornavn;
            }).catch((error: Error) => {
                if(errorMessage) errorMessage.set("Kunne ikke få konto detaljer");
            });

            forgottonPasswordService.getUserFromEmailCheck(this.refs.emailAddress.value).then(() => {
                validationNumberForForgottonPassword = (Math.floor(Math.random() * 9999));
                emailForForgottonPassword = this.refs.emailAddress.value;
                console.log(validationNumberForForgottonPassword);
                forgottonPasswordService.sendEmail(this.refs.emailAddress.value, validationNumberForForgottonPassword, accountNameForForgottonPassword)
                history.push("/ForgottonPasswordValidation")
            }).catch((error: Error) => {
                if(errorMessage) errorMessage.set("Denne eposten er ikke tilknyttet til en konto");
            });
        };
    }
}

class ForgottonPasswordValidation extends React.Component<{}> {
    refs: {
        validatingNumberInput: HTMLInputElement,
        validatingButton: HTMLButtonElement
    }

    render() {
        return (
            <div className ="limiter">
                <div className ="container-login100" style={ { backgroundImage: `url(require("image-background.jpg"))` } }>
                    <div className ="wrap-login100">
                        <form className ="login100-form">
                            <span className="login100-form-title p-b-34 p-t-27">
                            Valider koden din
                        </span>
                            <div className="wrap-input100">
                                <input className ="input100" type="text" ref="validatingNumberInput" placeholder ="Kode"/>
                                <span className="focus-input100">
                                </span>
                            </div>
                        </form>
                        <button className ="button1" ref="validatingButton">
                            Valider koden
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        console.log(validationNumberForForgottonPassword);
        this.refs.validatingButton.onclick = () => {
            if(this.refs.validatingNumberInput.value == validationNumberForForgottonPassword) {
                history.push("/ForgottonPasswordChange");
            }

            else { alert("Feil Kode"); }
        }
    }
}

class ForgottonPasswordChange extends React.Component<{}> {
    refs: {
        passwordChangeInput: HTMLInputElement,
        passwordConfirmChangeInput: HTMLInputElement,
        changePasswordButton: HTMLButtonElement
    }

    render() {
        return (
            <div className ="limiter">
                <div className ="container-login100" style={ { backgroundImage: `url(require("image-background.jpg"))` } }>
                    <div className ="wrap-login100">
                        <form className ="login100-form">
                            <span className="login100-form-title p-b-34 p-t-27">
                            Endre passordet ditt
                        </span>
                            <div className="wrap-input100">
                                <input className ="input100" type="password" ref="passwordChangeInput" placeholder ="Nytt passord"/>
                                <span className="focus-input100">
                                </span>
                            </div>
                            <div className="wrap-input100">
                                <input className ="input100" type="password" ref="passwordConfirmChangeInput" placeholder ="Gjenta nytt passord"/>
                                <span className="focus-input100">
                                </span>
                            </div>
                        </form>
                        <button className ="button1" ref="changePasswordButton">
                            Valider koden
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.refs.changePasswordButton.onclick = () => {
            if (this.refs.passwordChangeInput.value == this.refs.passwordConfirmChangeInput.value) {
                forgottonPasswordService.changePassword(emailForForgottonPassword, this.refs.passwordChangeInput.value).then(() => {
                    alert("Passordet har blit endret!");
                    history.push("/signin");
                }).catch((error: Error) => {
                    if (errorMessage) errorMessage.set("Kunne ikke endre passord!");
                });
            }
            else {alert("Passordene er ikke like!")};
        }
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

        return <div className ="body">
                    <div className ="content">
                        <h1>Hjem</h1><br/>
                            <div>
                                {listMembers}
                            </div>
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
  };
  render() {
    return <div>
              <h1>Opprett arrangement</h1><br />

        Navn: <input className="input" type="text" ref="addEventName" />
        Postnummer: <input className="inputSmall" type="text" ref="addZipCode" />
        Startdato: <input className="inputSmall" type="date" ref="addEventStartDate" />
        Sluttdato: <input className="inputSmall" type="date" ref="addEventEndDate" /><br />
        Beskrivelse: <textarea className="inputBig" ref='addEventDescription' /><br /><br />
        Starttidspunkt: <input className="inputSmall" type="time" ref="addStartTime" />
        Sluttidspunkt: <input className="inputSmall" type="time" ref="addEndTime" /><br /><br />
        Oppmøtedato: <input className="input" type="date" ref="addMeetingDate" />
        Oppmøtested: <input className="input" type="text" ref="addMeetingPoint" />
        Oppmøtetidspunkt: <input className="inputSmall" type="time" ref="addMeetingTime" /><br />
        Kontaktperson: <input className="input" type="number" ref="addContactPerson" />
        Vaktmal:<br />
        Utstyrsliste: <br /><br />

            <button className="button1" ref="addEventButton">Opprett arrangement</button>
            </div>
  }

  componentDidMount() {
    this.refs.addEventButton.onclick = () => {
        //her skal det stå eventList = this?
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

}
class Event extends React.Component<{}> {
  constructor() {
    super();

    this.events = [];
  }
  render() {
    let listEvents = [];
    for(let eventa of this.events) {
        listEvents.push(<tr key={eventa.idArrangementer}><NavLink activeStyle={{color: 'red'}} to={'/editevent/'+eventa.idArrangementer}>{eventa.Arrangement_Navn}</NavLink><td>{eventa.Beskrivelse}</td></tr>) //bruker key prop for optimalisering
    }

      return (
          <div>
          <h1>Arrangement</h1><br/>
          <table id = "roletable">
              <tbody>
              <tr>
                  <th>Rolle</th>
                  <th>Kompetanse</th>
              </tr>
                {listEvents}
              </tbody>
          </table>
              <br />

          <button className= "button" ref="goToEventButton">Opprett arrangement</button>
      </div>
      );
  }


  componentDidMount() {
      eventService.getEvents().then((events) => {
          this.events = events;
          this.forceUpdate();
      }).catch((error) => {
          if (errorMessage) errorMessage.set('Error getting notes: ' + error.message);
      });
      this.refs.goToEventButton.onclick = () => {
          history.push('/addevent');
          console.log("Hoppet til addevent");
      };
  }
}

class EditEvent extends React.Component {
    constructor(props) {
        super(props);

        this.idArrangementer = props.match.params.idArrangementer;
        this.Arrangement_Navn = "";
        this.Beskrivelse = "";
        this.Postnummer = "";
        this.StartDato = "";
        this.SluttDato = "";
        this.StartTid = "";
        this.SluttTid = "";
        this.Oppmotedato = "";
        this.OppmoteSted = "";
        this.OppmoteTid = "";
        this.EksternKontakt = "";
    }

    render() {
        return (
            <div>
                Arrangement id: {this.idArrangementer} <br/>
                Navn: <br/> <input className="input" type='text' ref='changeTitle'  /><br/>
                Beskrivelse: <br/> <textarea className="inputBig" ref='changeText'  /><br/>
                Postnummer: <br/> <input className="inputSmall" type="text" ref="changeZipCode" />
                Startdato: <br/> <input className="inputSmall" type="date" ref="changeEventStartDate" />
                Sluttdato: <input className="inputSmall" type="date" ref="changeEventEndDate" />
                Starttidspunkt: <br/> <input className="inputSmall" type="time" ref="changeStartTime" />
                Sluttidspunkt: <input className="inputSmall" type="time" ref="changeEndTime" /><br /><br />
                Oppmøtedato: <br/> <input className="inputSmall" type="date" ref="changeMeetingDate" />
                Oppmøtetidspunkt: <br/> <input className="inputSmall" type="time" ref="changeMeetingTime" /><br />
                Oppmøtested: <input className="input" type="text" ref="changeMeetingPoint" />
                Kontaktperson: <br/> <input className="inputSmall" type="number" ref="changeContactPerson" />

                <button className="button1" ref = "changeButton">Endre</button>
            </div>
        );
    }

    componentDidMount() {
        eventService.getEvent(this.idArrangementer).then((events) => {
            this.refs.changeTitle.value = events.Arrangement_Navn;
            this.refs.changeText.value = events.Beskrivelse;
            this.refs.changeZipCode.value = events.Postnummer;
            this.refs.changeEventStartDate.valueAsDate = events.StartDato;
            this.refs.changeEventEndDate.valueAsDate= events.SluttDato;
            this.refs.changeStartTime.value = events.StartTid;
            this.refs.changeEndTime.value = events.SluttTid;
            this.refs.changeMeetingDate.valueAsDate = events.Oppmotedato;
            this.refs.changeMeetingPoint.value = events.OppmoteSted;
            this.refs.changeMeetingTime.value = events.OppmoteTid;
            this.refs.changeContactPerson.value = events.EksternKontakt;
            this.forceUpdate();

        }).catch((error) => {
            if(errorMessage) errorMessage.set('Error getting events: ' + error.message);
        });
        this.refs.changeButton.onclick = () => {
            eventService.changeEvents(
            this.idArrangementer,
            this.refs.changeTitle.value,
            this.refs.changeText.value,
            this.refs.changeZipCode.value,
            this.refs.changeEventStartDate.value,
            this.refs.changeEventEndDate.value,
            this.refs.changeStartTime.value,
            this.refs.changeEndTime.value,
            this.refs.changeMeetingDate.value,
            this.refs.changeMeetingPoint.value,
            this.refs.changeMeetingTime.value,
            this.refs.changeContactPerson.value).then( () => {
                this.componentDidMount();
            }).catch((error) => {
                if(errorMessage) errorMessage.set('Error getting events: ' + error.message);
            });
        }
    }

    // Called when the this.props-object change while the component is mounted
    // For instance, when navigating from path /edit/1 to /edit/2
    componentWillReceiveProps(newProps) {
        this.idArrangementer = newProps.match.params.idArrangementer;
        this.componentDidMount();
        // To update the view and show the correct note data, rerun database query here
    }
}

class Crew extends React.Component<{}> {
    constructor() {
        super();
        this.crews = [];
    }
    render() {
        let listCrews = [];
        for(let crew of this.crews) {
            listCrews.push(<tr key={crew.Mann_id}>{crew.Navn}</tr>) //bruker key prop for optimalisering
        }

        return <div>
            <h1>Mannskap</h1><br/>
            <div>
                <table id="roletable">
                    <tbody>
                        <tr>
                            <th>
                                Navn
                            </th>
                        </tr>
                            {listCrews}
                    </tbody>
                </table>
            </div>
            <button className="button" ref="goToAddCrewButton">Opprett Mannskap</button>
        </div>;
    }


    componentDidMount() {
        crewService.getShiftTemplate().then((crews) => {
            this.crews = crews;
            this.forceUpdate();
        }).catch((error) => {
            if (errorMessage) errorMessage.set('Error getting crews: ' + error.message);
        });
        crewList = this;
        this.refs.goToAddCrewButton.onclick = () => {
            history.push('/addcrew');
            console.log("Hoppet til addCrew");
        };
    }
}
let crewList;

class AddCrew extends React.Component<{}> {
    refs: {
        crewName: HTMLInputElement,
        addRoleButton: HTMLButtonElement
    };
    render() {
        return <div>
            <h1>Opprett mannskap</h1><br />

            Navn: <input className="input" type="text" ref="crewName" /><br />
            <button className="button1" ref="addCrewButton">Opprett mannskap</button>
        </div>
    }
}

class Roles extends React.Component<{}> {
    constructor() {
        super();

        this.roles = [];
    }
  render() {
      let listRoles = [];
      for(let role of this.roles) {
          listRoles.push(<tr key={role.rolle_id}><td>{role.Rolle}</td><td>{role.Krav}</td></tr>)
      }

    return <div>
              <h1>Roller</h1>
                <table id = "roletable">
                    <tbody>
                    <tr>
                        <th>Rolle</th>
                        <th>Kompetanse</th>
                    </tr>
                        {listRoles}
                    </tbody>
                </table>
              <button className= "button" ref="goToRoleButton">Opprett rolle</button>
            </div>
  }
  componentDidMount() {
    this.refs.goToRoleButton.onclick = () => {
      history.push('/addrole');
      console.log("Hoppet til addrole");
    };
      roleService.getRoles().then((roles) => {
          this.roles = roles;
          this.forceUpdate();
      }).catch((error) => {
          if (errorMessage) errorMessage.set('Error getting roles: ' + error.message);
      });
      //eventList = this;
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

              Navn: <input className="input" type="text" ref="roleName" /><br />
              Beskrivelse: <input className="input" type="text" ref="roleDescription" />
              Vaktmal:<br />
              Kurs?: <br /><br />

            <button className="button" ref="addRoleButton">Opprett rolle</button>
            </div>
  }
}

class MyPage extends React.Component<{}> {
constructor(props) {
    super(props);

    this.ID = props.match.params.ID;
    this.Brukernavn = "";
    this.Fornavn = "";
    this.Etternavn = "";
    this.Telefon = "";
    this.Gateadresse = "";
    this.Postnummer = "";
    this.Fødselsdato = "";
    this.Epost = "";
}

  render() {
    return (
            <div>
              <h1>Min side</h1>
                <div>
                    Medlem id: {this.ID} <br/>
                    Brukernavn {this.Brukernavn} <br/> <input type='text' ref='changeUsername'  /><br/>
                    Fornavn: {this.Fornavn} <br/>      <input type='text' ref='changeFirstname'  /><br/>
                    Etternavn: {this.Etternavn}        <input type='text' ref='changeSurname'  /><br/>
                    Telefon: {this.Telefon}            <input type='text' ref='changeTelephone'  /><br/>
                    Gateadresse: {this.Gateadresse}    <input type='text' ref='changeAddress'  /><br/>
                    Postnummer: {this.Postnummer}      <input type='text' ref='changeZipcode'  /><br/>
                    Fødselsdato: {this.Fødselsdato}    <input type='date' ref='changeDateOfBirth'  /><br/>
                    E-post: {this.Epost}               <input type='text' ref='changeEmail'  /><br/>

                    <button ref = "changeButton">Endre</button>
                    {}
                </div>
            </div>
    );
  }
componentDidMount() {
    memberService.getMember(this.ID).then((members) => {
        this.Brukernavn= member.Brukernavn;
        this.Fornavn= member.Fornavn;
        this.Etternavn= member.Etternavn;
        this.Telefon= member.Telefon;
        this.Gateadresse= member.Gateadresse;
        this.Postnummer= member.Postnummer;
        this.Fødselsdato= member.Fødselsdato;
        this.Epost= member.Epost;
        this.forceUpdate();

    }).catch((error) => {
        if(errorMessage) errorMessage.set('Error getting member: ' + error.message);
    });
    this.refs.changeButton.onclick = () => {
        memberService.changeMembers(this.ID, this.refs.changeUsername.value, this.refs.changeFirstname.value, this.refs.changeSurname.value, this.refs.changeTelephone.value, this.refs.changeAddress.value, this.refs.changeZipcode.value, this.refs.changeDateOfBirth.value, this.refs.changeEmail.value).then( () => {
            this.componentDidMount();
        }).catch((error) => {
            if(errorMessage) errorMessage.set('Error getting member: ' + error.message);
        });
    }
}

  // Called when the this.props-object change while the component is mounted
  // For instance, when navigating from path /user/1 to /user/2
  componentWillReceiveProps() {
      this.ID= newProps.match.params.ID;
      this.componentDidMount();
      // To update the view and show the correct note data, rerun database query here
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

class About extends React.Component<{}> {
    render() {
        return <div>
            <h1>Om oss</h1><br />

            Denne applikasjonen er laget av gruppe 25, som består av Viljar, Lashnan, Helge og Raymond.

        </div>
    }
}
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
            <Route exact path="/forgottonpassword" component={ForgottonPassword} />
            <Route exact path="/forgottonpasswordvalidation" component={ForgottonPasswordValidation} />
            <Route exact path="/forgottonpasswordchange" component={ForgottonPasswordChange} />
          <Route exact path='/event' component={Event} />
          <Route exact path='/addevent' component={AddEvent} />
            <Route exact path='/editevent/:idArrangementer' component={EditEvent} />
          <Route exact path='/crew' component={Crew} />
            <Route exact path='/addcrew' component={AddCrew} />
          <Route exact path='/roles' component={Roles} />
          <Route exact path='/addrole' component={AddRole} />
          <Route exact path='/mypage:id' component={MyPage} />
            <Route exact path='/about' component={About} />
            <Route exact path='/' component={Home} />
        </Switch>
      </div>
    </HashRouter>
  ), root);
}
