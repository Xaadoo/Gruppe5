// @flow
import * as React from 'react'; //imports the React-Library
import ReactDOM from 'react-dom'; //imports ReactDOM
import { Link, NavLink, HashRouter, Switch, Route } from 'react-router-dom'; //imports Link, Navlink, Hashrouter, Switch, Route form "react-router-dom"
import createHashHistory from 'history/createHashHistory'; //imports createHashHistory
const history = createHashHistory(); //constant history
import { userService, eventService, memberService, externalService, roleService, crewService, rosterService, competenceService, forgottonPasswordService } from './innloggingService'; //importerer de
import $ from 'jquery'; //imports jquery
import 'fullcalendar'; //imports fullcalendar

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

//class Menu contains the navigation bar.
//It will only render the bar if the user is logged in.
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
                          <li className={"navli"}><NavLink activeStyle={{color: 'white'}} exact to='/mycompetence'>Min Kompetanse</NavLink>{' '}</li>
                        <li className={"navli"}><NavLink activeStyle={{color: 'white'}} exact to='/members'>Medlemmer</NavLink>{' '}</li>
                        <li className={"navli"}><NavLink activeStyle={{color: 'white'}} to='/signout'>Logg ut</NavLink>{' '}</li>
                        <li className={"aboutli"}><NavLink activeStyle={{color: 'white'}} to='/about'>Om</NavLink>{' '}</li>
                    </ul>
                </div>
            );
        }
        history.push("/signIn");
        return (
            <div>

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
                        <div className ="login100-form">
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
                            <div id="val"></div>
                            <div className="container-login100-form-btn">
                                <button className="login100-form-btn" ref="signInButton">Logg inn</button>
                            </div>
                            <div className="new">
                                <NavLink activeStyle={{color: 'red'}} to='/newmember'>Opprett ny bruker</NavLink>{' '}
                            </div>
                            <div className="for">
                                <NavLink activeStyle={{color: "red"}} to="/forgottonpassword">Glemt passord</NavLink>{" "}
                            </div>
                        </div>
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

        let konto = userService.getSignedInUser();

        if (konto.Admin == 1) {
          console.log("Admin konto funnet!");
          localStorage.setItem("adminCheckVariable", 1);
        } else {
          console.log("Admin konto ikke funnet");
          localStorage.setItem("adminCheckVariable", 0);
        }

        history.push('/');
        console.log("Logget inn!");

      }).catch((error: Error) => {

        if(errorMessage) errorMessage.set("Feil brukernavn eller passord! Kontoen kan også være deaktivert.");

      });
    };
  }
}

let validationNumberForForgottonPassword;
let emailForForgottonPassword;
let accountNameForForgottonPassword;

class NewMember extends React.Component<{}> {
  Refs: {
      username:HTMLInputElement,
      name:HTMLInputElement,
      middlename:HTMLInputElement,
      surname:HTMLInputElement,
      email:HTMLInputElement,
      passord:HTMLInputElement,
      passordRe:HTMLInputElement,
      birthdate:HTMLInputElement,
      adress:HTMLInputElement,
      phone:HTMLInputElement,
      addMemberButton:HTMLButtonElement,
      submitMember:HTMLInputElement,
      goBack:HTMLButtonElement
  }

  render() {
        return <div>
            <div className ="limiter">
                <div className ="container-login100" style={ { backgroundImage: `url(require("image-background.jpg"))` } }>
                    <div className ="wrap-login100">
                        <span className="login100-form-title p-b-34 p-t-27">
                            Ny bruker
                        </span>
                        <form ref="submitMember">

                            <div className="wrap-input100">Brukernavn: <input className="input" type="text" ref="username" placeholder="OleBekk" required/></div>
                            <div className="wrap-input100">Fornavn: <input className="input" type="text" ref="name" placeholder="Ole" required/></div>
                            <div className="wrap-input100">Mellomnavn: <input className="input" type="text" ref="middlename" placeholder="McPearson"/></div>
                            <div className="wrap-input100">Etternavn: <input className="input" type="text" ref="surname" placeholder="Hansen" required/></div>

                            <div className="wrap-input100">E-mail:  <input className="input" type="email" ref="email" placeholder="mail@ntnu.no" required/></div>
                            <div className="wrap-input100">Passord:  <input className="input" type="password" ref="passord" placholder="Passord" required/></div>
                            <div className="wrap-input100">Gjenta passord:  <input className="input" type="password" ref="passordRe"/></div>


                            <div className="wrap-input100">Fødselsdato:  <input className="input" type="date" ref="birthdate" required/></div>
                            <div className="wrap-input100">Adresse:  <input className="input" type="text" ref="adress" placeholder="Oslogata 34a" required/></div>
                            <div className="wrap-input100">Mobilnummer:  <input className="input" type="text" ref="phone" placeholder="11225588" required/></div>

                            <input className="button1" type="submit" ref="addMemberButton" value="Opprett Bruker"/>
                            <div className="back">
                                <button className="backB" ref="goBack">
                                    Tilbake
                                </button>
                            </div>
                        </form>
                        </div>
                    </div>
                </div>
        </div>
}
  componentDidMount() {
    newmember = this;
    this.refs.goBack.onclick = () => {
      history.push("/signIn");
    }
    this.refs.submitMember.onsubmit = () => {

      memberService.checkAccountDetailsFromUsernameAndEmail(this.refs.username.value, this.refs.email.value).then((result) => {
        console.log("Account: " + result);
        if(result.Brukernavn==this.refs.username.value) {
          errorMessage.set("Brukernavn opptatt.");
        } else if (result.Epost==this.refs.email.value) {
          errorMessage.set("Epost opptatt.");
        } else if (this.refs.passord.value.length<10) {
          errorMessage.set("Passord må være 10 eller flere karakterer langt.");
        } else if (this.refs.passord.value!=this.refs.passordRe.value) {
          errorMessage.set("Passord matcher ikke.");
        } else if (result==false) {
          memberService.addMember(
                                this.refs.username.value,
                                this.refs.name.value,
                                this.refs.middlename.value,
                                this.refs.surname.value,
                                this.refs.email.value,
                                this.refs.passord.value,
                                this.refs.birthdate.value,
                                this.refs.phone.value,
                                this.refs.adress.value).then(console.log("THEN"), errorMessage.set("Bruker opprettet!")).catch((error: Error) => {
              if(errorMessage) errorMessage.set("Error making new profile.");
            });
        }
      }).catch((error: Error) => {
        if(errorMessage) errorMessage.set("Error getting account details")
      });
    };
  }

  componentWillUnmount() {
    newmember = null;
  }

}
let newmember: ?NewMember;
let submitMember;

class ForgottonPassword extends React.Component<{}> {
    refs: {
        emailAddress: HTMLInputElement,
        recoverPasswordButton: HTMLButtonElement,
        backButton: HTMLButtonElement
    }

    render() {
        return (
            <div className ="limiter">
                <div className ="container-login100" style={ { backgroundImage: `url(require("image-background.jpg"))` } }>
                    <div className ="wrap-login100">
                        <span className="login100-form-title p-b-34 p-t-27">
                            Glemt passord
                        </span>
                        <br />
                        <div id={"white"}>
                            Vi sender deg en link for å endre passord. Om du ikke mottar e-post, sjekk mappen for søppelpost.
                        </div>
                        <br />
                        <div className="wrap-input100">Epost: <input className="inputE" type="text" ref="emailAddress" /></div>
                        <div className="back">
                            <button className="button1" ref="recoverPasswordButton"> Gjennopprett passord </button>
                            <button className="backB" ref="backButton"> Tilbake </button>
                        </div>
                    </div>
                </div>
            </div>
        );
}

    componentDidMount() {
        this.refs.backButton.onclick = () => {
          history.push("/signIn");
        }

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
        validatingButton: HTMLButtonElement,
        backButton: HTMLButtonElement
    }

    render() {
        return (
            <div className ="limiter">
                <div className ="container-login100" style={ { backgroundImage: `url(require("image-background.jpg"))` } }>
                    <div className ="wrap-login100">
                        <span className="login100-form-title p-b-34 p-t-27">
                            Glemt passord
                        </span>
                            <div className="wrap-input100">Kode: <input className="input" type="text" ref="validatingNumberInput" />
                            <div className={"back"}>
                                <button className="button1" ref="validatingButton"> Valider koden </button>
                                <button className="backB" ref="backButton"> Tilbake </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
}

    componentDidMount() {
        this.refs.backButton.onclick = () => {
          history.push("/signIn");
        }

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
        changePasswordButton: HTMLButtonElement,
        backButton: HTMLButtonElement
    }

    render() {
        return (
            <div className ="limiter">
                <div className ="container-login100" style={ { backgroundImage: `url(require("image-background.jpg"))` } }>
                    <div className ="wrap-login100">
                        <span className="login100-form-title p-b-34 p-t-27">
                            Gjenopprett passord
                        </span>
                            <div className="wrap-input100">
                                Nytt passord: <input className="input" type="password" ref="passwordChangeInput" />
                            </div>
                            <div className="wrap-input100">
                                Bekreft nytt passord: <input className="input" type="password" ref="passwordConfirmChangeInput" />
                            </div>
                            <div className={"back"}>
                                <button className="button1" ref="changePasswordButton"> Forandre passord </button>
                                <button className="backB" ref="backButton"> Tilbake </button>
                            </div>
                    </div>
                </div>
            </div>
        )
}

    componentDidMount() {
        this.refs.backButton.onclick = () => {
          history.push("/signIn");
        }

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

let eventsForCalendarInHomeClass = [];
class Home extends React.Component<{}> {

    componentDidMount() {
      let signedInUser = userService.getSignedInUser();
      if(signedInUser) {
        this.getEvents();
        this.createCalendar();
      }
    }

    createCalendar() {
      $("#calendar").fullCalendar({
        defaultView: 'month',
        height: 'auto',
        events: eventsForCalendarInHomeClass,
        eventColor: "#ed2e2e",
        eventClick: function(calEvent, jsEvent, view) {
            history.push("/editevent/" + calEvent.id)
        }
      })
    }

    updateCalendar() {
      $('#calendar').fullCalendar('destroy');
      this.createCalendar();
    }

    getEvents() {
      eventService.getEvents().then((result) => {
        eventsForCalendarInHomeClass = [];
        let allEvents = result;

        for (let i = 0; i < allEvents.length; i++) {
          let startDate = new Date(result[i].StartDato).toISOString().slice(0,10);;
          let endDate = new Date(result[i].SluttDato).toISOString().slice(0,10);;
          let insertEvents = {}
              insertEvents =
              {
                title: result[i].Arrangement_Navn,
                start: startDate,
                end: endDate,
                id: result[i].idArrangementer,
              }
              eventsForCalendarInHomeClass.push(insertEvents);
        }
        this.updateCalendar();
      });
    }

    render() {
      return <div id='calendar'></div>;
    }

    componentWillUnmount() {
      $("#calendar").fullCalendar("destroy");
    }

}

class AddEvent extends React.Component<{}> {
    constructor() {
        super();

        this.external = [];
    }
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
      let listContacts = [<option>Velg Kontaktperson</option>];
      for(let contact of this.external) {
          listContacts.push( <option key={contact.EksternKontaktID} value={contact.EksternKontaktID}> {contact.Fornavn + " " + contact.Mellomnavn + " " + contact.Etternavn} </option> );   //bruker key prop for optimalisering
      }

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

            Kontaktperson: <input className="input" list="contacts" ref="addContactPerson" />
              <datalist id="contacts">
                {listContacts}
              </datalist>

            <button className="button1" ref="addEventButton">Opprett arrangement</button>
        </div>
    }

    componentDidMount() {
        externalService.getContacts().then((res) => {
          this.external = res;
          this.forceUpdate();
        });

        // This function gets every value from the input-fields and uses a query from the service-file.
        // The method eventService.addEvent makes it possible to add events to the databas
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

}

class Event extends React.Component<{}> {
  constructor() {
    super();
    this.myEventList = [];
    this.events = [];
  }
  render() {
    let member = userService.getSignedInUser();
    let myList = [];
    for(let event of this.myEventList) {
      console.log(event);
      let check;
      let check2;
      if (event.Godkjenning==1) {
        check = "Godkjent";
      } else if (event.Godkjenning==2) {check = "Avslått";
    } else { check = <button onClick={()=>(this.eventAnswer(event.ID, event.VaktRolleId, 1), this.shiftPoints(member.ID))}>Godkjenn</button>;
               check2 = <button onClick={()=>this.eventAnswer(event.ID, event.VaktRolleId, 2)}>Avslå</button> }
        myList.push(<tr key={event.VaktRolleId}> <td>{event.OppmoteDato.toString().substring(0, 10)}</td> <NavLink activeStyle={{color: 'red'}} to={'/editevent/'+event.idArrangementer}> <td>{event.Arrangement_Navn}</td></NavLink> <td>{event.Rolle}</td> <td>{check}{check2}</td> </tr>)
    }


    let listEvents = [];
    for(let eventa of this.events) {
        listEvents.push(<tr key={eventa.idArrangementer}><td>{eventa.OppmoteDato.toString().substring(0, 10)}</td><NavLink activeStyle={{color: 'red'}} to={'/editevent/'+eventa.idArrangementer}><td>{eventa.Arrangement_Navn}</td></NavLink><td>{eventa.Beskrivelse}</td></tr>) //bruker key prop for optimalisering
      }

    if (localStorage.getItem("adminCheckVariable") == 1) {
      return (
            <div>
                <div>
                <h1>Mine Arrangementer</h1>
                    <table id = "bigTable">
                        <tbody>
                        <tr>
                            <th>Oppmøtedato</th>
                            <th>Påmeldte Arrangement</th>
                            <th> Rolle </th>
                            <th>Status</th>
                        </tr>
                          {myList}
                        </tbody>
                    </table>
                </div>
                <h1>Arrangementer</h1>
                    ? Trykk på et arrangementnavn for å se mer informasjon for det arrangementet.
                <table id = "bigTable">
                    <tbody>
                    <tr>
                        <th>Oppmøtedato</th>
                        <th>Arrangement</th>
                        <th>Beskrivelse</th>
                    </tr>
                      {listEvents}
                    </tbody>
                </table>
                <br />

                <button className= "button" ref="goToEventButton">Opprett arrangement</button>
            </div>
          );
    } if (localStorage.getItem("adminCheckVariable") == 0) {
      return (
            <div>
                 <div>
                 <h1>Mine Arrangementer</h1>
                     <table id = "bigTable">
                         <tbody>
                         <tr>
                            <th>Oppmøtedato</th>
                            <th>Påmeldte Arrangement</th>
                            <th> Rolle </th>
                            <th>Status</th>
                         </tr>
                           {myList}
                         </tbody>
                     </table>
                 </div>



                <h1>Arrangementer</h1>
                    ? Trykk på et arrangementnavn for å se mer informasjon for det arrangementet.
                <table id = "bigTable">
                    <tbody>
                    <tr>
                        <th>Oppmøtedato</th>
                        <th>Arrangement</th>
                        <th>Beskrivelse</th>
                    </tr>
                      {listEvents}
                    </tbody>
                </table>
            </div>
          );
    }
  }


  componentDidMount() {
    let member = userService.getSignedInUser();
      this.getMyEvents(member.ID);
      eventService.getEvents().then((events) => {
          this.events = events;
          this.forceUpdate();
      }).catch((error) => {
          if (errorMessage) errorMessage.set('Error getting notes: ' + error.message);
      });
      if (localStorage.getItem("adminCheckVariable") == 1) {
      this.refs.goToEventButton.onclick = () => {
          history.push('/addevent');
          console.log("Hoppet til addevent");
      };
    }


  }

  getMyEvents(ID) {
    eventService.getMembersEvents(ID).then((res) => {
      console.log(res);
      this.myEventList = res;
      this.forceUpdate();
    })
  }

  eventAnswer(myId, vaktRolleId, answer) {
    rosterService.addToEventRosterByVaktRolleId(myId, vaktRolleId, answer).then((res) => {
      console.log(res);
      this.componentDidMount();
    })
  }

  shiftPoints(id) {
    memberService.getMember(id).then((result) => {
      let vaktpoeng = result.Vaktpoeng;
      vaktpoeng += 10;
      memberService.giveMemberVaktPoeng(vaktpoeng, id).then(() => {

      });
    });
  }

}


class EditEvent extends React.Component {
    constructor(props) {
        super(props);

        this.external = [];

        this.idArrangementer = props.match.params.idArrangementer; //props.match.params.idArrangementer retrieves data from choosen event.idArrangementer
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

        this.interest;

        this.openRoster = [];
        this.personsOpen = [];
        this.roles = [];
        this.points = [];
        this.roster = [];
        this.eventInterested = [];
    }

    render() {
      let listContacts = [];
      for(let contact of this.external) {
          listContacts.push( <option key={contact.EksternKontaktID} value={contact.EksternKontaktID}> {contact.Fornavn + " " + contact.Mellomnavn + " " + contact.Etternavn} </option> );   //bruker key prop for optimalisering
      }

      let interested = [];
      for(let inter of this.eventInterested) {
          interested.push(<tr key={inter.ID}><td>{inter.Fornavn} {inter.Mellomnavn} {inter.Etternavn}</td> <td> {inter.Telefon} </td></tr>)
      }

      if (localStorage.getItem("adminCheckVariable") == 1) {
        let rosterList = [];
        for(let roster of this.roster) {
          let button : ?HTMLButtonElement;
          let button2: HTMLButtonElement = <button className="button" onClick={() => {this.removeRole(roster.VaktRolleId)}}>Fjern Rolle</button>;
          let check;
          if (roster.Godkjenning==1) {check = "Godkjent"}
             else if (roster.Godkjenning==2) { check = "Avslått" }
             else { check = "Venter"}

          if (roster.ID != null) {
            button = <button className="button" onClick={() => {this.remove(roster.VaktRolleId), this.shiftPoints(roster.Godkjenning, roster.ID)}}>Tøm</button>;
            rosterList.push(<tr key={roster.VaktRolleId}><td>{roster.Rolle}</td><td>{roster.Fornavn} {roster.Etternavn}</td><td>{roster.Telefon}</td> <td>{check}</td> {button2} {button}</tr>)
          }

          if (roster.ID == null) {
            button = ""
            rosterList.push(<tr key={roster.VaktRolleId}><td>{roster.Rolle}</td><td>{roster.Fornavn} {roster.Etternavn}</td><td>{roster.Telefon}</td> <td></td> {button2} </tr>)
          }
        }

        let pointList = [];
        for(let roster of this.points) {
            pointList.push(<tr key={roster.ID}><td>{roster.Fornavn} {roster.Mellomnavn} {roster.Etternavn}</td><td>{roster.Telefon}</td> <td>{roster.Vaktpoeng}</td></tr>)
        }

        let listRoles = [<option>Velg Ny Rolle</option>];
        for(let r of this.roles) {
            listRoles.push( <option key={r.rolle_id} value={r.rolle_id}> {r.Rolle} </option> );
          }


          let openRosterList = [<option>Velg Åpen Rolle</option>];
          for(let r of this.openRoster) {
              openRosterList.push( <option key={r.VaktRolleId} value={r.VaktRolleId}> {r.Rolle} </option> );
            }

          let listPersons = [];
          for(let p of this.personsOpen) {
              listPersons.push( <option key={p.ID} value={p.ID}> {p.Fornavn} {p.Mellomnavn} {p.Etternavn} </option> );
            }

          return (
              <div>
                  <h1>Endre arrangement</h1><br />
                  <div className="bold">
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
                      Kontaktperson: <input className="input" list="contacts" ref="changeContactPerson" />
                        <datalist id="contacts">
                          {listContacts}
                        </datalist>
                  </div>
                  <button className="button1" ref = "changeButton">Endre</button>

                    {this.interest}

                  <br/>
                  <br/>
                  <div>
                  <table id="bigTable">
                    <tr>
                    <th>Vaktliste</th> <th>Person</th> <th>Telefon</th> <th> Godkjent </th>
                    </tr>
                     <tbody>
                         {rosterList}
                     </tbody>
                  </table>
                  <select className="input" list="roles" ref="newRole" > {listRoles} </select> <button className="button" ref = "newRoleButton">Legg til rolle</button>
                    <datalist id="roles">
                      {listRoles}
                    </datalist>
                  </div>
                  <div>
                  <select className="input" list="open" ref="openListInput"> {openRosterList} </select> <input className="inputSmall" list="persons" ref="personsInput" placeholder="Velg Medlem"/> <button className="button" ref = "enlistButton">Meld På</button>
                    <datalist id="persons">
                      {listPersons}
                    </datalist>
                    <datalist id="open">
                      {openRosterList}
                    </datalist>
                  </div>
                <br/>

                <div>
                <table id="bigTable">
                <tr>
                  <th>Interessert</th><th>Telefon</th>
                </tr>
                  <tbody>
                    {interested}
                  </tbody>
                </table>
                </div>
                <br/>

                  <div>
                  <table id="bigTable">
                    <tr>
                      <th>Medlemmer etter poeng</th> <th>Telefon</th> <th>Vaktpoeng</th>
                    </tr>
                     <tbody>
                      {pointList}
                     </tbody>
                  </table>
                  </div>

              </div>
          );
      } if (localStorage.getItem("adminCheckVariable") == 0) {
        let rosterList = [];
        for(let roster of this.roster) {
          let check;
          if (roster.Godkjenning==1) {check = "Godkjent"}
             else if (roster.Godkjenning==2) { check = "Avslått" }
             else { check = "Venter"}

          if (roster.ID != null) {
            rosterList.push(<tr key={roster.VaktRolleId}><td>{roster.Rolle}</td><td>{roster.Fornavn} {roster.Mellomnavn} {roster.Etternavn}</td><td>{roster.Telefon}</td> <td>{check}</td></tr>)
          }

          if (roster.ID == null) {
            rosterList.push(<tr key={roster.VaktRolleId}><td>{roster.Rolle}</td><td>{roster.Fornavn} {roster.Mellomnavn} {roster.Etternavn}</td><td>{roster.Telefon}</td><td></td> </tr>)
          }
        }

        return (
          <div>
              <h1>Endre arrangement</h1><br />
              <div className="bold">
                  Arrangement id: {this.idArrangementer} <br/>
                  Navn: <br/> <input className="input" type='text' ref='changeTitle' disabled="disabled" /><br/>
                  Beskrivelse: <br/> <textarea className="inputBig" ref='changeText' disabled="disabled" /><br/>
                  Postnummer: <br/> <input className="inputSmall" type="text" ref="changeZipCode" disabled="disabled" />
                  Startdato: <br/> <input className="inputSmall" type="date" ref="changeEventStartDate" disabled="disabled" />
                  Sluttdato: <input className="inputSmall" type="date" ref="changeEventEndDate" disabled="disabled"/>
                  Starttidspunkt: <br/> <input className="inputSmall" type="time" ref="changeStartTime" disabled="disabled" />
                  Sluttidspunkt: <input className="inputSmall" type="time" ref="changeEndTime" disabled="disabled" /><br /><br />
                  Oppmøtedato: <br/> <input className="inputSmall" type="date" ref="changeMeetingDate" disabled="disabled" />
                  Oppmøtetidspunkt: <br/> <input className="inputSmall" type="time" ref="changeMeetingTime" disabled="disabled" /><br />
                  Oppmøtested: <input className="input" type="text" ref="changeMeetingPoint" disabled="disabled" />
                  Kontaktperson: <input className="input" list="contacts" ref="changeContactPerson" disabled="disabled" />
                    <datalist id="contacts">
                      {listContacts}
                    </datalist>
              </div>

                {this.interest}

                <table id="bigTable">
                  <tr>
                  <th>Vaktliste</th> <th>Person</th> <th>Telefon</th> <th> Godkjent </th>
                  </tr>
                   <tbody>
                       {rosterList}
                   </tbody>
                </table>


            </div>
        )
      }

    }

    componentDidMount() {
      if (localStorage.getItem("adminCheckVariable") == 1) {
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
                history.push('/event');
            }).catch((error) => {
                if(errorMessage) errorMessage.set('Error getting events: ' + error.message);
            });
        }

        this.refs.newRoleButton.onclick = () => {
          rosterService.addRoleToEvent(eventId, this.refs.newRole.value).then(
            this.componentDidMount()
          )
        }

        this.refs.enlistButton.onclick = () => {
          rosterService.addToEventRosterByVaktRolleId(this.refs.personsInput.value, this.refs.openListInput.value, 0).then(
            this.componentDidMount()
          )
          memberService.getMember(this.refs.personsInput.value).then((result) => {
            eventService.getEvent(this.idArrangementer).then((events) => {
              eventService.sendEmailForConfirmation(result.Fornavn, result.Epost, events.Arrangement_Navn, events.Beskrivelse, events.Postnummer, events.StartDato.toISOString().slice(0,10), events.SluttDato.toISOString().slice(0,10), events.StartTid, events.SluttTid, events.OppmoteDato.toISOString().slice(0,10), events.OppmoteSted, events.OppmoteTid, events.EksternKontakt)
            }).catch((error) => {
              if(errorMessage) errorMessage.set("Could Not get events: " + error.message);
            });
          }).catch((error) => {
            if(errorMessage) errorMessage.set("Could not get member: " + error.message);
          });
        }
      }

      externalService.getContacts().then((res) => {
        this.external = res;
        this.forceUpdate();
      });

        eventService.getEvent(this.idArrangementer).then((events) => {
            this.refs.changeTitle.value = events.Arrangement_Navn;
            this.refs.changeText.value = events.Beskrivelse;
            this.refs.changeZipCode.value = events.Postnummer;
            this.refs.changeEventStartDate.valueAsDate = events.StartDato;
            this.refs.changeEventEndDate.valueAsDate= events.SluttDato;
            this.refs.changeStartTime.value = events.StartTid;
            this.refs.changeEndTime.value = events.SluttTid;
            this.refs.changeMeetingDate.valueAsDate = events.OppmoteDato;
            this.refs.changeMeetingPoint.value = events.OppmoteSted;
            this.refs.changeMeetingTime.value = events.OppmoteTid;
            this.refs.changeContactPerson.value = events.EksternKontakt;
            this.forceUpdate();

        }).catch((error) => {
            if(errorMessage) errorMessage.set('Error getting events: ' + error.message);
        });

          this.getInterestButton(this.idArrangementer);




          let user = userService.getSignedInUser();
          let eventId = this.idArrangementer;
            eventService.getInterestedInEvent(eventId).then((res) => {
              console.log(res);
                this.eventInterested = res;
                this.forceUpdate();
            })
            rosterService.getRosterFromEvent(eventId).then((res) => {
                this.roster = res;
                this.forceUpdate();
            })
            memberService.getMembersVaktpoengAsc().then((res) => {
              this.points = res;
              this.forceUpdate();
            })

            roleService.getRoles().then((res) => {
              this.roles = res;
              this.forceUpdate();
            });


            rosterService.checkRosterForInvertedMembers(eventId).then((res) => {
                this.personsOpen = res;
                this.forceUpdate();
            });

            rosterService.getOpenRoster(eventId).then((res) => {
              this.openRoster = res;
              this.forceUpdate();
            });


    }

    shiftPoints(id, check) {
      if (check == 1) {
        memberService.getMember(id).then((result) => {
          let vaktpoeng = result.Vaktpoeng;
          vaktpoeng -= 10;
          memberService.giveMemberVaktPoeng(vaktpoeng, id).then(() => {
          this.componentDidMount();
          });
        });
      }
    }

    remove(VaktRolleId) {
      rosterService.addToEventRosterByVaktRolleId(null, VaktRolleId, null)
      this.componentDidMount();
    }

    removeRole(VaktRolleId) {
      console.log(VaktRolleId);
      rosterService.deleteRosterByVaktRolleId(VaktRolleId);
      this.componentDidMount();
    }

    getInterestButton(ArrangementID) {
      let user = userService.getSignedInUser();
      console.log(ArrangementID + " and " + user.ID );
      eventService.interestEventCheck(ArrangementID, user.ID).then((res) => {
        console.log(res);
        if (res==undefined) {
              this.interest = <button className="button1" onClick={() => {
                eventService.interestEvent(ArrangementID, user.ID);
                this.componentDidMount()}
              }>Meld Interesse</button>
        } else {
              this.interest = <button className="button1" onClick={() => {
                eventService.removeInterestEvent(ArrangementID, user.ID);
                this.componentDidMount()}
              }>Meld Ikke interessert</button>
        }
        this.forceUpdate();
      })
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

        if (localStorage.getItem("adminCheckVariable") == 1) {
          return <div>
              <h1>Mannskap</h1>
                  <table id="bigTable">
                      <tbody>
                      <tr>
                          <th>
                              Navn
                          </th>
                      </tr>
                      {listCrews}
                      </tbody>
                  </table>
              <button className="button" ref="goToAddCrewButton">Opprett Mannskap</button>
          </div>;
        }
        if (localStorage.getItem("adminCheckVariable") == 0) {
          return <div>
              <h1>Mannskap</h1>
                  <table id="bigTable">
                      <tbody>
                      <tr>
                          <th>
                              Navn
                          </th>
                      </tr>
                      {listCrews}
                      </tbody>
                  </table>
          </div>;
        }
    }


    componentDidMount() {
      if (localStorage.getItem("adminCheckVariable") == 1) {
        this.refs.goToAddCrewButton.onclick = () => {
            history.push('/addcrew');
            console.log("Hoppet til addCrew");
        };
      }
        crewService.getShiftTemplate().then((crews) => {
            this.crews = crews;
            this.forceUpdate();
        }).catch((error) => {
            if (errorMessage) errorMessage.set('Error getting crews: ' + error.message);
        });
        crewList = this;
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
            <button className="button1" ref="addCrewButton" disabled="disabled">Opprett mannskap</button>
        </div>
    }
    componentDidMount() {
        this.refs.addCrewButton.onclick = () => {
            //her skal det stå eventList = this?
            crewService.addShiftTemplate(this.refs.crewName.value
                ).then(() => {
                history.push('/crew');
                console.log("Mannskap lagt til!");
            }).catch((error: Error) => {
                if(errorMessage) errorMessage.set("Error adding the crew.");
            });
        };
    }
}

class MyCompetence extends React.Component<{}> {
  constructor() {
    super();

    this.competenceList = [];
    this.newCompetenceList = [];
  }

  refs: {
    newRoleinput: HTMLInputElement,
    addButton: HTMLButtonElement

  }

  render() {
    let listCompetence = [];
    for(let comp of this.competenceList) {
        listCompetence.push(<tr key={comp.KompetanseID}><td>{comp.KompetanseNavn}</td></tr>)
    }

    let listNewCompetence = [];
    for(let newComp of this.newCompetenceList) {
      listNewCompetence.push( <option key={newComp.KompetanseID} value={newComp.KompetanseID}> {newComp.KompetanseNavn} </option> );
    }


    return<div>
            <h1>Min Kompetanse</h1>
            <table id="bigTable">
              <tbody>
                <tr>
                  <th>Kompetanse</th>
                </tr>
                {listCompetence}
              </tbody>
            </table>

            <input className="inputSmall" list="newList" ref="newRoleinput" />
              <datalist id="newList">
                {listNewCompetence}
              </datalist>
            <input className="button" type="button" ref="addButton" value="Ny Kompetanse"/>


          </div>


  }

  componentDidMount() {
    let user = userService.getSignedInUser();

    competenceService.getCompetenceById(user.ID).then(
      (result) => {
        this.competenceList = result;
    }).catch()

    competenceService.getCompetences().then(
      (result) => {
        console.log(result);
          this.newCompetenceList = result;
          this.forceUpdate();
      }
    )

    this.refs.addButton.onclick = () => {
      competenceService.addCompetenceToId(user.ID, this.refs.newRoleinput.value).then();
      this.componentDidMount();
    }
  }

}


class Roles extends React.Component<{}> {
    constructor() {
        super();

        this.roles = [];
    }

    render() {
        let listRoles = [];

        if(localStorage.getItem("adminCheckVariable") == 1) {
          for(let role of this.roles) {
              listRoles.push(<tr key={role.rolle_id}><NavLink activeStyle={{color: 'red'}} to={'/editrole/'+role.rolle_id}>{role.Rolle}</NavLink><td>{role.Krav}</td></tr>)
          }

          return <div>
              <h1>Roller</h1>
              ? Trykk på et rollenavn for å se mer informasjon for den rollen.
              <table id = "bigTable">
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
        if(localStorage.getItem("adminCheckVariable") == 0) {
          for(let role of this.roles) {
              listRoles.push(<tr key={role.rolle_id}>{role.Rolle}<td>{role.Krav}</td></tr>)
          }

          return <div>
              <h1>Roller</h1>
              ? Trykk på et rollenavn for å se mer informasjon for den rollen.
              <table id = "bigTable">
                  <tbody>
                  <tr>
                      <th>Rolle</th>
                      <th>Kompetanse</th>
                  </tr>
                  {listRoles}
                  </tbody>
              </table>
          </div>
        }
    }
    componentDidMount() {
      if (localStorage.getItem("adminCheckVariable") == 1) {
        this.refs.goToRoleButton.onclick = () => {
            history.push('/addrole');
            console.log("Hoppet til addrole");
        };
      }
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
    componentDidMount() {
        this.refs.addRoleButton.onclick = () => {
            //her skal det stå eventList = this?
            roleService.addRole(this.refs.roleName.value,
                this.refs.roleDescription.value
            ).then((rolle_id) => {
                history.push('/roles');
                console.log("Rolle lagt til!");
            }).catch((error: Error) => {
                if(errorMessage) errorMessage.set("Error adding the role.");
            });
        };
    }
}

class EditRole extends React.Component<{}> {
    constructor(props) {
        super(props);

        this.rolle_id = props.match.params.rolle_id;
        this.Rolle = "";
        this.Krav = "";
    }

    render() {
        return (
            <div>
                <h1>Endre rolle</h1><br />
                <div className="bold">
                    Rolle_id: {this.rolle_id}<br />
                    Navn: <input className="input" type='text' ref='changeRoleName'  /><br />
                    Krav: <input className="input" type="text" ref='changeCompetence'  />
                </div>
                <button className="button1" ref = "changeButton">Endre</button>
            </div>
        );
    }

    componentDidMount() {
        roleService.getRole(this.rolle_id).then((roles) => {
            this.refs.changeRoleName.value = roles.Rolle;
            this.refs.changeCompetence.value = roles.Krav;

            this.forceUpdate();

        }).catch((error) => {
            if(errorMessage) errorMessage.set('Error getting roles: ' + error.message);
        });
        this.refs.changeButton.onclick = () => {
            roleService.changeRoles(
                this.rolle_id,
                this.refs.changeRoleName.value,
                this.refs.changeCompetence.value).then( () => {
                this.componentDidMount();
                history.push('/roles');

            }).catch((error) => {
                if(errorMessage) errorMessage.set('Error getting members: ' + error.message);
            });
        }
    }

    // Called when the this.props-object change while the component is mounted
    // For instance, when navigating from path /edit/1 to /edit/2
    componentWillReceiveProps(newProps) {
        this.rolle_id = newProps.match.params.rolle_id;
        this.componentDidMount();
        // To update the view and show the correct note data, rerun database query here
    }
}

class MyPage extends React.Component<{}> {
  constructor() {
    super();

    this.myEventList = [];
  }

    Refs: {
        userID:HTMLOutputElement,
        changeUsername:HTMLOutputElement,
        changeFirstname:HTMLInputElement,
        changeMiddlename:HTMLInputElement,
        changeSurname:HTMLInputElement,
        changeTelephone:HTMLInputElement,
        changeAddress:HTMLInputElement,
        changeZipcode:HTMLInputElement,
        changeDateOfBirth:HTMLInputElement,
        changeEmail:HTMLInputElement,
        changeButton:HTMLButtonElement,
        submitChange:HTMLInputElement
    }

    render() {

        return (
            <div>
                <h1>Min side</h1>
                <form ref="submitChange">
                    <div className="bold">
                            Medlem id: <output ref="userID"/> <br/>
                            Brukernavn: <input className="inputSmall" type='text' ref='changeUsername'  disabled="disabled" /><br/>
                            Fornavn: <input className="inputSmall" type='text' ref='changeFirstname'  /><br/>
                            Mellomnavn: <input className="inputSmall" type='text' ref='changeMiddlename'  /><br/>
                            Etternavn: <input className="inputSmall" type='text' ref='changeSurname'  /><br/>
                            Telefon: <input className="inputSmall" type='text' ref='changeTelephone'  /><br/>
                            Gateadresse: <input className="input" type='text' ref='changeAddress'  /><br/>
                            Postnummer: <input className="inputSmall" type='text' ref='changeZipcode'  /><br/>
                            Fødselsdato:  <input className="inputSmall" type='date' ref='changeDateOfBirth'  /><br/>
                            E-post: <input className="inputE" type='email' ref='changeEmail'  /><br/>
                    </div>
                        <input className="button1" type="submit" ref="changeButton" value="Endre"/>
                </form>
            </div>
        )
    }

    componentDidMount() {
        let member = userService.getSignedInUser();
        member.Fødselsdato = new Date(member.Fødselsdato);

        this.refs.userID.value = member.ID;
        this.refs.changeUsername.value = member.Brukernavn;
        this.refs.changeFirstname.value = member.Fornavn;
        this.refs.changeMiddlename.value = member.Mellomnavn;
        this.refs.changeSurname.value = member.Etternavn;
        this.refs.changeTelephone.value = member.Telefon;
        this.refs.changeAddress.value = member.Gateadresse;
        this.refs.changeZipcode.value = member.Postnummer;
        this.refs.changeDateOfBirth.valueAsDate = member.Fødselsdato;
        this.refs.changeEmail.value = member.Epost;

        this.refs.submitChange.onsubmit = () => {
            memberService.changeMembers(member.ID, this.refs.changeFirstname.value, this.refs.changeMiddlename.value, this.refs.changeSurname.value, this.refs.changeTelephone.value, this.refs.changeAddress.value, this.refs.changeZipcode.value, this.refs.changeDateOfBirth.valueAsDate, this.refs.changeEmail.value).then(
                memberService.getMember(member.ID).then((result)=> {
                    localStorage.setItem('signedInUser', JSON.stringify(result))
                    alert('Endret!');
                }),
            ).catch((error) => {
                if(errorMessage) errorMessage.set('Error getting member: ' + error.message);
            });
        }

    }

    componentWillUnmount() {
        myPage = null;
    }
}
let myPage: ?MyPage

class Members extends React.Component<{}> {
  constructor() {
    super();

    this.memberList = [];
  }

  Refs: {
    searchButton:HTMLButtonElement,
    search:HTMLInputElement,
    kontoAktivInput:HTMLInputElement
  }

  render() {
    let listMembers = [];

    if (localStorage.getItem("adminCheckVariable") == 1) {
      for(let member of this.memberList) {
          listMembers.push(<tr key={member.ID}><td><NavLink activeStyle={{color: 'red'}} to={'/editmember/'+member.ID}>{member.Fornavn}</NavLink></td><td>{member.Mellomnavn}</td><td>{member.Etternavn}</td><td>{member.Epost}</td><td>{member.Telefon}</td><td>{member.KontoAktiv}</td></tr>)
        }

        return (
        <div>

        <h1>Medlemmer</h1>
          Søk etter et medlem i søkefeltet under. <br />
          <input className= "search" type="text" placeholder="Ole / ole@mail.no / 99887766" ref="search"/> <button ref="searchButton" className= "button">Søk</button>
          <table id = "bigTable">
                <tbody>
                  <tr>
                    <th>Fornavn</th> <th>Mellomnavn</th> <th>Etternavn</th> <th>Epost</th> <th>Telefon</th> <th>KontoenAktiv</th>
                  </tr>
                  {listMembers}
                </tbody>
            </table>
            <br />

        </div>
      )
    }

    if (localStorage.getItem("adminCheckVariable") == 0) {
      for(let member of this.memberList) {
          listMembers.push(<tr key={member.ID}><td>{member.Fornavn}</td><td>{member.Mellomnavn}</td><td>{member.Etternavn}</td><td>{member.Epost}</td><td>{member.Telefon}</td></tr>)
        }

        return (
          <div>

          <h1>Medlemmer</h1>
            Søk etter et medlem i søkefeltet under. <br />
            <input className= "search" type="text" placeholder="Ole / ole@mail.no / 99887766" ref="search"/> <button ref="searchButton" className= "button">Søk</button>
            <table id = "bigTable">
                  <tbody>
                    <tr>
                      <th>Fornavn</th> <th>Mellomnavn</th> <th>Etternavn</th> <th>Epost</th> <th>Telefon</th>
                    </tr>
                    {listMembers}
                  </tbody>
              </table>
              <br />

          </div>
      )
    }
  }

  componentDidMount() {
    memberPage = this;
    let user = userService.getSignedInUser();
    let search = this.refs.search.value + "%";
    let choices1 = [memberService.getOtherMembers, memberService.getAllOtherMembers];
    let choices2 = [memberService.getMemberBySearch, memberService.getAllMembersBySearch];

    for (let i = 0; i < 2; i++) {
      if(localStorage.getItem("adminCheckVariable") == i) {
        choices1[i](user.ID).then(
          (result) => {
            console.log('TEST');
            this.memberList = result;
            this.forceUpdate();
          }).catch()

          this.refs.searchButton.onclick = () => {
            search = this.refs.search.value + "%";
            console.log(search);
            choices2[i](search).then(
              (result) => {
                console.log(result);
                this.memberList = result;
                this.forceUpdate();
              }
            ).catch()
          }
      }
    }

  }

  componentWillUnmount() {
    memberPage = null;
  }
}
let memberPage: ?Members

class EditMember extends React.Component<{}> {

    constructor(props) {
    super(props);

    this.ID = props.match.params.ID;
}

  Refs: {
    changeUsername:HTMLOutputElement,
    changeFirstname:HTMLInputElement,
    changeMiddlename:HTMLInputElement,
    changeSurname:HTMLInputElement,
    changeTelephone:HTMLInputElement,
    changeAddress:HTMLInputElement,
    changeZipcode:HTMLInputElement,
    changeDateOfBirth:HTMLInputElement,
    changeEmail:HTMLInputElement,
    changeButton:HTMLButtonElement,
    changeKontoAktiv:HTMLInputElement
  }

  render() {
        return (
            <div>
                <h1>Endre medlem</h1><br />
                <div className="bold">
                    Medlem id: {this.ID}<br />
                    Brukernavn: <input className="inputSmall" type='text' ref='changeUsername'  /><br />
                    Fornavn : <input className="inputSmall" type="text" ref='changeFirstname'  />
                    Mellomnavn : <input className="inputSmall" type="text" ref="changeMiddlename" />
                    Etternavn : <input className="inputSmall" type="text" ref="changeSurname" /><br />
                    Telefon : <input className="inputSmall" type="text" ref="changeTelephone" />
                    Gateadresse : <input className="inputSmall" type="text" ref="changeAddress" />
                    Postnummer : <input className="inputSmall" type="text" ref="changeZipcode" /><br />
                    Fødselsdato : <input className="inputSmall" type="Date" ref="changeDateOfBirth" />
                    Epost : <input className="inputE" type="text" ref="changeEmail" />
                    KontoAktiv : <input className="inputE" type="text" ref="changeKontoAktiv" />
                </div>
                <button className="button1" ref = "changeButton">Endre</button>
            </div>
        );
}

  componentDidMount() {
    memberService.getMember(this.ID).then((result) => {
      this.refs.changeUsername.value = result.Brukernavn;
      this.refs.changeFirstname.value = result.Fornavn;
      this.refs.changeMiddlename.value = result.Mellomnavn;
      this.refs.changeSurname.value = result.Etternavn;
      this.refs.changeTelephone.value = result.Telefon;
      this.refs.changeAddress.value = result.Gateadresse;
      this.refs.changeZipcode.value = result.Postnummer;
      this.refs.changeDateOfBirth.valueAsDate = result.Fødselsdato;
      this.refs.changeEmail.value = result.Epost;
      this.refs.changeKontoAktiv.value = result.KontoAktiv;
      this.forceUpdate();
    }).catch((error) => {
    if(errorMessage) errorMessage.set("Could not get member: " + error.message);
  });

  this.refs.changeButton.onclick = () => {
      memberService.changeMembersAdmin(this.ID, this.refs.changeFirstname.value, this.refs.changeMiddlename.value, this.refs.changeSurname.value, this.refs.changeTelephone.value, this.refs.changeAddress.value, this.refs.changeZipcode.value, this.refs.changeDateOfBirth.valueAsDate, this.refs.changeEmail.value, this.refs.changeKontoAktiv.value).then(() => {
        this.forceUpdate();
        alert("Endring gjort!");
     }).catch((error) => {
          if(errorMessage) errorMessage.set('Error getting member: ' + error.message);
      });
    }


  }

  // Called when the this.props-object change while the component is mounted
  // For instance, when navigating from path /edit/1 to /edit/2
  componentWillReceiveProps(newProps) {
      this.ID = newProps.match.params.ID;
      this.componentDidMount();
      // To update the view and show the correct note data, rerun database query here
  }
}

class SignOut extends React.Component<{}> {
  refs: {
    signOut: HTMLInputElement
  };

  render() {
        return (
            <div className="back">
                <br />
                <br />
                <br />
                Er du sikker på at du vil logge ut?
                <br />
                <button className="button" ref="signOut">Trykk her for å logge ut</button>
            </div>
        );
};

  componentDidMount() {
    signOut = this;
    this.refs.signOut.onclick = () => {
      userService.signOut();
      localStorage.setItem("adminCheckVariable", 0);
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
                    <Route exact path='/newmember' component={NewMember} />
                    <Route exact path='/event' component={Event} />
                    <Route exact path='/addevent' component={AddEvent} />
                    <Route exact path='/editevent/:idArrangementer' component={EditEvent} />
                    <Route exact path='/crew' component={Crew} />
                    <Route exact path='/addcrew' component={AddCrew} />
                    <Route exact path='/roles' component={Roles} />
                    <Route exact path='/addrole' component={AddRole} />
                    <Route exact path='/editrole/:rolle_id' component={EditRole} />
                    <Route exact path='/mypage' component={MyPage} />
                    <Route exact path='/mycompetence' component={MyCompetence} />
                    <Route exact path='/members' component={Members} />
                    <Route exact path='/editmember/:ID' component={EditMember} />
                    <Route exact path='/about' component={About} />
                    <Route exact path='/' component={Home} />
                </Switch>
            </div>
        </HashRouter>
    ), root);
}
