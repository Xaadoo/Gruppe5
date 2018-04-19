// @flow
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Link, NavLink, HashRouter, Switch, Route } from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
const history = createHashHistory();
import { userService, eventService, memberService, roleService, crewService, forgottonPasswordService } from './innloggingService';
import $ from 'jquery';
import 'fullcalendar';

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
                        <li className={"navli"}><NavLink activeStyle={{color: 'white'}} exact to='/members'>Medlemmer</NavLink>{' '}</li>
                        <li className={"navli"}><NavLink activeStyle={{color: 'white'}} to='/signout'>Logg ut</NavLink>{' '}</li>
                        <li className={"aboutli"}><NavLink activeStyle={{color: 'white'}} to='/about'>Om</NavLink>{' '}</li>
                    </ul>
                </div>
            );
        }
        return (
            <div>
                <NavLink activeStyle={{color: 'red'}} to='/signin'>Logg inn</NavLink>{' '}
                <NavLink activeStyle={{color: 'red'}} to='/newmember'>Ny Bruker</NavLink>{' '}
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

let adminCheckVariable;

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
                            <div className="container-login100-form-btn">
                                <button className="login100-form-btn" ref="signInButton">Logg inn</button>
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
                    adminCheckVariable = 1;
                } else if (konto.Admin == 0) {
                    console.log("Admin konto ikke funnet");
                    adminCheckVariable = 0;
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
        submitMember:HTMLInputElement
    }

    render() {
        return <div>
            <h1> Ny Bruker </h1>
            <form ref="submitMember">
                <div>Brukernavn: <input type="text" ref="username" placeholder="OleBekk" required/></div>
                <div>Fornavn: <input type="text" ref="name" placeholder="Ole" required/></div>
                <div>Mellomnavn: <input type="text" ref="middlename" placeholder="McPearson"/></div>
                <div>Etternavn: <input type="text" ref="surname" placeholder="Hansen" required/></div>

                <div>E-mail:  <input type="email" ref="email" placeholder="mail@ntnu.no" required/></div>
                <div>Passord:  <input type="password" ref="passord" placholder="Passord" required/></div>
                <div>Gjenta passord:  <input type="password" ref="passordRe"/></div>


                <div>Fødselsdato:  <input type="date" ref="birthdate" required/></div>
                <div>Adresse:  <input type="text" ref="adress" placeholder="Oslogata 34a" required/></div>
                <div>Mobilnummer:  <input type="text" ref="phone" placeholder="11225588" required/></div>

                <input type="submit" ref="addMemberButton" value="Opprett Bruker"/>
            </form>
        </div>
    }
    componentDidMount() {
        newmember = this;
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
        recoverPasswordButton: HTMLButtonElement
    }

    render() {
        return (
            <div>
                <h1> Glemt Passord </h1>
                Epost: <input type="text" ref="emailAddress" />
                <div>
                    <button ref="recoverPasswordButton"> Gjennoprett passord </button>
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
            <div>
                <h1> Valider koden din </h1>
                <div>
                    Kode: <input type="text" ref="validatingNumberInput" />
                </div>
                <div>
                    <button ref="validatingButton"> Valider koden </button>
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
            <div>
                <h1> Endre passordet ditt </h1>
                <div>
                    Nytt passord: <input type="password" ref="passwordChangeInput" />
                </div>
                <div>
                    Bekreft nytt passord: <input type="password" ref="passwordConfirmChangeInput" />
                </div>
                <div>
                    <button ref="changePasswordButton"> Forandre passord </button>
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
    constructor(props) {
        super(props);
        this.updateEvents = this.updateEvents.bind(this);
    }
    componentDidMount() {
        this.updateEvents(this.props.events);
    }
    componentDidUpdate() {
        this.updateEvents(this.props.events);
    }
    updateEvents() {
        $('#calendar').fullCalendar('destroy');
        $('#calendar').fullCalendar({
            defaultView: 'month', // Only show week view
            height: 'auto', // Get rid of  empty space on the bottom
            events: 'https://fullcalendar.io/demo-events.json'
        });
    }
    render() {
        return <div id='calendar'></div>;
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
            listEvents.push(<tr key={eventa.idArrangementer}><td>{eventa.OppmoteDato.toString().substring(0, 10)}</td><NavLink activeStyle={{color: 'red'}} to={'/editevent/'+eventa.idArrangementer}>{eventa.Arrangement_Navn}</NavLink><td>{eventa.Beskrivelse}</td></tr>) //bruker key prop for optimalisering
        }

        return (
            <div>
                <h1>Arrangement</h1><br/>
                <table id = "roletable">
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
                    Kontaktperson: <br/> <input className="inputSmall" type="number" ref="changeContactPerson" />
                </div>
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
                history.push('/event');
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
    componentDidMount() {
        this.refs.addCrewButton.onclick = () => {
            //her skal det stå eventList = this?
            crewService.addShiftTemplate(this.refs.crewName.value
                ).then((Mann_id) => {
                history.push('/crew');
                console.log("Mannskap lagt til!");
            }).catch((error: Error) => {
                if(errorMessage) errorMessage.set("Error adding the crew.");
            });
        };
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
            listRoles.push(<tr key={role.rolle_id}><NavLink activeStyle={{color: 'red'}} to={'/editrole/'+role.rolle_id}>{role.Rolle}</NavLink><td>{role.Krav}</td></tr>)
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
                            Brukernavn: <input className="inputSmall" type='text' ref='changeUsername'  /><br/>
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
        search:HTMLInputElement
    }

    render() {
        let listMembers = [];
        for(let member of this.memberList) {
            listMembers.push(<tr key={member.ID}><NavLink activeStyle={{color: 'red'}} to={'/editmember/'+member.ID}>{member.Fornavn}</NavLink><td>{member.Mellomnavn}</td><td>{member.Etternavn}</td><td>{member.Epost}</td><td>{member.Telefon}</td></tr>)
        }
        return <div>

            <h1>Medlemmer</h1>
            <input className= "search" type="text" placeholder="Ole / ole@mail.no / 99887766" ref="search"/> <button ref="searchButton" className= "button">Søk</button>
            <table id = "roletable">
                <tbody>
                <tr>
                    <th>Fornavn</th> <th>Mellomnavn</th> <th>Etternavn</th> <th>Epost</th> <th>Telefon</th>
                </tr>
                {listMembers}
                </tbody>
            </table>
            <br />
        </div>
    }

    componentDidMount() {
        memberPage = this;
        let user = userService.getSignedInUser();
        memberService.getOtherMembers(user.ID).then(
            (result) => {
                this.memberList = result;
                console.log(this.memberList);
                console.log(result);
                this.forceUpdate();
            }).catch()

        this.refs.searchButton.onclick = () => {
            let search = this.refs.search.value + "%";
            console.log(search);
            memberService.getMemberBySearch(search).then(
                (returned) => {
                    this.memberList = returned;
                    this.forceUpdate();
                }
            )
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
    this.Brukernavn = "";
    this.Fornavn = "";
    this.Mellomnavn = "";
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
                <h1>Endre medlem</h1><br />
                <div className="bold">
                    Medlem id: {this.ID}<br />
                    Brukernavn: <input className="inputSmall" type='text' ref='changeUsername'  /><br />
                    Fornavn : <input className="inputSmall" type="text" ref='changeFirstName'  />
                    Mellomnavn : <input className="inputSmall" type="text" ref="changeMiddleName" />
                    Etternavn : <input className="inputSmall" type="text" ref="changeSurName" /><br />
                    Telefon : <input className="inputSmall" type="text" ref="changePhoneNum" />
                    Gateadresse : <input className="inputSmall" type="text" ref="changeAdress" />
                    Postnummer : <input className="inputSmall" type="text" ref="changeZipcode" /><br />
                    Fødselsdato : <input className="inputSmall" type="Date" ref="changeBirthOfDate" />
                    Epost : <input className="inputE" type="text" ref="changeEmail" />
                </div>
                <button className="button1" ref = "changeButton">Endre</button>
            </div>
        );
    }

    componentDidMount() {
        memberService.getMember(this.ID).then((members) => {
            this.refs.changeUsername.value = members.Brukernavn;
            this.refs.changeFirstName.value = members.Fornavn;
            this.refs.changeMiddleName.value = members.Mellomnavn;
            this.refs.changeSurName.value = members.Etternavn;
            this.refs.changePhoneNum.value= members.Telefon;
            this.refs.changeAdress.value = members.Gateadresse;
            this.refs.changeZipcode.value = members.Postnummer;
            this.refs.changeBirthOfDate.valueAsDate = members.Fødselsdato;
            this.refs.changeEmail.value = members.Epost;
            this.forceUpdate();

        }).catch((error) => {
            if(errorMessage) errorMessage.set('Error getting events: ' + error.message);
        });
        this.refs.changeButton.onclick = () => {
            memberService.changeMembers(
                this.ID,
                this.refs.changeUsername.value,
                this.refs.changeFirstName.value,
                this.refs.changeMiddleName.value,
                this.refs.changeSurName.value,
                this.refs.changePhoneNum.value,
                this.refs.changeAdress.value,
                this.refs.changeZipcode.value,
                this.refs.changeBirthOfDate.value,
                this.refs.changeEmail.value).then( () => {
                this.componentDidMount();
            }).catch((error) => {
                if(errorMessage) errorMessage.set('Error getting members: ' + error.message);
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
        return (<div><button ref="signOut">Press this button to sign out</button></div>);
    };

    componentDidMount() {
        signOut = this;
        this.refs.signOut.onclick = () => {
            userService.signOut();
            adminCheckVariable = 0;
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
                    <Route exact path='/members' component={Members} />
                    <Route exact path='/editmember/:ID' component={EditMember} />
                    <Route exact path='/about' component={About} />
                    <Route exact path='/' component={Home} />
                </Switch>
            </div>
        </HashRouter>
    ), root);
}