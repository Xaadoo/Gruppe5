// @flow
import * as mysql from 'mysql';

// Setup MySQL-server connection
let connection;
function connect() {
  connection = mysql.createConnection({
    host     : 'mysql.stud.iie.ntnu.no',
    user     : 'g_oops_25',  // Replace [username] with your username
    password : 'XsWrxOxJ',     // Replace [password] with your password
    database : 'g_oops_25'   // Replace [username] with your username
  });

// Connect to MySQL-server
connection.connect(function(error) {
  if(error) throw error; // If error, show error in console and return from this function
});

connection.on('error', (error: Error) => {
  if (error.code === 'PROTOCOL_CONNECTION_LOST') { // Reconnect if connection to server is lost
    connect();
  }
  else {
    throw error;
  }
});
}
connect();

class User {
  id: number;
  username: string;
  firstName: string;
  password: string;
}

class ForgottonPasswordService {
    getUserFromEmail(email: string) : Promise<void> {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM Medlemmer WHERE Epost = ?", [email], (error, result) => {
                if(error) {
                    reject(error);
                    return;
                }
                resolve(result[0]);
            });
        });
    }

    getUserFromEmailCheck(email: string) : Promise<void> {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM Medlemmer WHERE BINARY Epost = ?", [email], (error, result) => {
                if(error) {
                    reject(error);
                    return;
                }
                if(result.length!=1) {
                    reject(new Error('Result length was not 1'))
                    return;
                }

                resolve();
            });
        });
    }

    // Dette er kode fra en annen javascript fil for å sende mail, den er ikke koblet til databasen
    sendEmail(emailTo, validatingCode, nameto) {
        emailjs.send("default_service","glemtpassord",{to_name: nameto, from_name: "Rød Fugl", to_email: emailTo, message_html: "Her er din validerings kode: " + validatingCode})
    }

    changePassword(email: string, password: string) : Promise<void> {
        return new Promise((resolve, reject) => {
            connection.query("UPDATE Medlemmer SET Passord = ? WHERE Epost = ?", [password, email], (error, result) => {
                if(error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    }
}
let forgottonPasswordService = new ForgottonPasswordService;

class RoleService {
    getRoles(): Promise<void> {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Roller', (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(result);
            });
        });
    }

    addRole(
        eventName: string,
        zipCode: string)
        : Promise<void> {
        return new Promise((resolve, reject) => {
            connection.query(
                'INSERT INTO Arrangementer (Postnummer, Beskrivelse, StartDato, SluttDato, StartTid, SluttTid, OppmoteDato,  OppmoteTid, OppmoteSted, EksternKontakt, Arrangement_Navn) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [zipCode, eventDescription, eventStartDate, eventEndDate, startTime, endTime, meetingDate, meetingTime, meetingPoint, contactPerson, eventName], (error, result) => {
                    // skriv dette i sluttrapporten: Det var vanskelig å få til denne spørringen da vi slurva med datatyper.
                    // connection.query( 'SELECT EXISTS (SELECT * FROM Medlemmer WHERE Brukernavn = ? AND Passord = ?', [username, password], (error, result) => {
                    // connection.query('SELECT * FROM Medlemmer where Brukernavn=?', [username], (error, result) => {
                    // connection.query('SELECT CASE WHEN EXIST ( SELECT * FROM Medlemmer WHERE Brukernavn = ?, Passord = ? ) THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END', [username, password], (error, result) => {

                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(result[1]);
                });
        });
    }
}

let roleService = new RoleService;

//jobb med CrewService: Joine tabeller?
class CrewService {
  getShiftTemplate() : Promise<void> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT Mannskap.Mann_id, Mannskap.Navn, Roller.rolle_id, Roller.Rolle FROM Mannskap INNER JOIN Roller ON Mannskap.Mann_id = Roller.rolle_id;',
          (error, result) => {
        if(error) {
          reject(error);
          return;
          }
          resolve(result);
          });
      });
  }
}
let crewService = new CrewService;
// Class that performs database queries related to members
class MemberService {
  addMember(
    username: string,
    name: string,
    middlename: string,
    surname: string,
    email: string,
    passord: string,
    birthdate: Date,
    phone: string,
    adress: string)
    : Promise<void> {
      return new Promise((resolve, reject) => {
        connection.query(
          'INSERT INTO Medlemmer (Brukernavn, Passord, Fornavn, Mellomnavn, Etternavn, Telefon, Gateadresse, Fødselsdato, Epost) values ( ?, ?, ?, ?, ?, ?, ?, ?, ?)', [username, passord, name, middlename, surname, phone, adress, birthdate, email], (error, result) => {

          console.log("Sendt " + username + name + middlename + surname + email + passord + birthdate + adress + phone);

          if(error) {console.log(error)
          reject(error)}
          return;

          resolve(result[1]);
        });
      });
    }

    getMembers() : Promise<void> {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Medlemmer WHERE KontoAktiv=?', [1], (error, result) => {
                if(error) {
                    reject(error);
                    return;
                }
                resolve(result);
            });
        });
    }

    getOtherMembers(id) : Promise<void> {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Medlemmer WHERE KontoAktiv=? AND ID!=?', [1, id], (error, result) => {
                if(error) {
                    console.log("Test:"+error);
                    reject(error);
                    return;
                }
                resolve(result);
            });
        });
    }

    getMemberBySearch(search: string) : Promise<void> {
      return new Promise ((resolve, reject) => {
        connection.query('SELECT * FROM Medlemmer WHERE (Fornavn LIKE ? OR Mellomnavn LIKE ? OR Etternavn LIKE? OR Telefon LIKE ? OR Epost LIKE ?) AND KontoAktiv=1', [search, search, search, search, search], (error, result) => {
            if(error) {
              reject(error);
              return;
            }
            console.log(result);
            resolve(result);
        })
      })
    }


    getMember(id) : Promise<void> {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Medlemmer Where id = ?', [id], (error, result) => {
                if(error) {
                    reject(error);
                    return;
                }
                resolve(result[0]);
            });
        });
    }

    changeMembers(
      id: number,
      fornavn: string,
      mellomnavn: string,
      etternavn: string,
      telefon: string,
      gateadresse: string,
      postnummer: string,
      fødselsdato: Date,
      epost: string
    ) : Promise<void>{
        return new Promise((resolve, reject) => {
            connection.query('UPDATE Medlemmer SET Fornavn = ?, Mellomnavn=?, Etternavn=?, Telefon=?, Gateadresse=?, Postnummer=?, Fødselsdato=?, Epost=? WHERE id=?', [fornavn, mellomnavn, etternavn, telefon, gateadresse, postnummer, fødselsdato, epost, id], (error, result) => {
                if(error) {
                    reject(error);
                    return;
                }
                resolve(result);
            });
        });
    }

    deleteMember(id) : Promise<void> {
        return new Promise((resolve, reject) => {
            connection.query("UPDATE Medlemmer SET KontoAktiv = 0 WHERE ID = ?", [id], (error, result) => {
                if(error) {
                    reject(error);
                    return;
                }
                resolve(result);
            });
        });
    }

    checkAccountDetailsFromUsernameAndEmail(username:string, email:string) : Promise<void> {
         return new Promise((resolve, reject) => {
           connection.query('SELECT * From Medlemmer WHERE BINARY Brukernavn=? OR Epost=?', [username, email], (error, result) => {

             console.log("Username&Mail: " + result);

             if(error) {
               reject(error);
               return;
             }

             if(result=="") {
               resolve(result=false);
               return;
             }

             resolve(result[0]);
           });
         })
   }
}

let memberService = new MemberService();

class UserService {
  // Vet ikke hvordan å få en egen melding for at kontoen er deaktivert
  signIn(username: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      connection.query( "SELECT * FROM Medlemmer WHERE BINARY Brukernavn=? AND BINARY Passord=? AND KontoAktiv=1", [username, password], (error, result) => {

        if(error) {
          reject(error);
          return;
        }
        if(result.length!=1) {
          reject(new Error('Result length was not 1'))
          return;
        }

        localStorage.setItem('signedInUser', JSON.stringify(result[0])); // Store User-object in browser
        resolve();
      });
    });
  }

  getSignedInUser(): ?User {
    let item = localStorage.getItem('signedInUser'); // Get User-object from browser
    if(!item) return null;

    return JSON.parse(item);
  }

  signOut() {
    localStorage.setItem('signedInUser', "");
  }
}
let userService = new UserService();

class Eventa {
  //skrev Eventa fordi Event er et reservert ord
  id: number;
  eventName: string;
  zipCode: number;
  eventStartDate: string;
  eventEndDate: string;
  eventDescription: string;
  startTime: string;
  endTime: string;
  meetingDate: string;
  meetingPoint: string;
  meetingTime: string;
  contactPerson: string;
}

class EventService {
  getEvents() : Promise<void> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM Arrangementer', (error, result) => {
        if(error) {
          reject(error);
          return;
        }
        resolve(result);
        });
      });
    }
  getEvent(idArrangementer) : Promise<void> {
      return new Promise((resolve, reject) => {
          connection.query('SELECT * FROM Arrangementer Where idArrangementer = ?', [idArrangementer], (error, result) => {
              if (error) {
                  reject(error);
                  return;
              }
              resolve(result[0]);
          });
      });
  }
changeEvents(idArrangementer, Arrangement_Navn, Beskrivelse, Postnummer, StartDato, SluttDato, StartTid, SluttTid, Oppmotedato, OppmoteSted, OppmoteTid, EksternKontakt) : Promise<void> {
    return new Promise((resolve, reject) => {
        connection.query('UPDATE Arrangementer SET Arrangement_Navn = ?, Beskrivelse = ?, Postnummer = ?, StartDato = ?, SluttDato = ?, StartTid = ?, SluttTid = ?, Oppmotedato = ?, OppmoteSted = ?, OppmoteTid = ?, EksternKontakt = ? WHERE idArrangementer = ?', [Arrangement_Navn, Beskrivelse, Postnummer, StartDato, SluttDato, StartTid, SluttTid, Oppmotedato, OppmoteSted, OppmoteTid, EksternKontakt, idArrangementer], (error, result) => {
            if(error) {
                reject(error);
                return;
            }
            resolve(result);
        });
    });
}
  addEvent(
      eventName: string,
      zipCode: string,
      eventStartDate: Date,
      eventEndDate: Date,
      eventDescription: string,
      startTime: string,
      endTime: string,
      meetingDate: Date,
      meetingPoint: string,
      meetingTime: string,
      contactPerson: string)
    : Promise<void> {
    return new Promise((resolve, reject) => {
      connection.query(
          'INSERT INTO Arrangementer (Postnummer, Beskrivelse, StartDato, SluttDato, StartTid, SluttTid, OppmoteDato,  OppmoteTid, OppmoteSted, EksternKontakt, Arrangement_Navn) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [zipCode, eventDescription, eventStartDate, eventEndDate, startTime, endTime, meetingDate, meetingTime, meetingPoint, contactPerson, eventName], (error, result) => {
              // skriv dette i sluttrapporten: Det var vanskelig å få til denne spørringen da vi slurva med datatyper.
      // connection.query( 'SELECT EXISTS (SELECT * FROM Medlemmer WHERE Brukernavn = ? AND Passord = ?', [username, password], (error, result) => {
      // connection.query('SELECT * FROM Medlemmer where Brukernavn=?', [username], (error, result) => {
      // connection.query('SELECT CASE WHEN EXIST ( SELECT * FROM Medlemmer WHERE Brukernavn = ?, Passord = ? ) THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END', [username, password], (error, result) => {

              if(error) {
                  reject(error);
                  return;
              }
              resolve(result[1]);
          });
    });
  }
}
let eventService = new EventService();
//skrev Eventa fordi Event er et reservert ord
export { User, userService, Eventa, eventService, memberService, roleService, crewService, forgottonPasswordService };
