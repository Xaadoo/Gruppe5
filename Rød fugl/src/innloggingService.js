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
    getRoles() : Promise<void> {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Roller', (error, result) => {
                if(error) {
                    reject(error);
                    return;
                }
                resolve(result);
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
    getMembers() : Promise<void> {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Medlemmer', (error, result) => {
                if(error) {
                    reject(error);
                    return;
                }
                resolve(result);
            });
        });
    }
    getMember(ID) : Promise<void> {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Medlemmer Where ID = ?', [ID], (error, result) => {
                if(error) {
                    reject(error);
                    return;
                }
                resolve(result[0]);
            });
        });
    }

    changeMembers(id, fornavn, text) : Promise<void>{
        return new Promise((resolve, reject) => {
            connection.query('UPDATE Medlemmer SET fornavn = ?, text = ? WHERE id = ?', [fornavn, text, id], (error, result) => {
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
            connection.query("DELETE FROM Medlemmer Where ID = ?", [id], (error, result) => {
                if(error) {
                    reject(error);
                    return;
                }
                resolve(result);
            });
        });
    }
}

let memberService = new MemberService();

class UserService {
  signIn(username: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      connection.query( "SELECT * FROM Medlemmer WHERE BINARY Brukernavn=? AND BINARY Passord=?", [username, password], (error, result) => {
      // connection.query( 'SELECT EXISTS (SELECT * FROM Medlemmer WHERE Brukernavn = ? AND Passord = ?', [username, password], (error, result) => {
      // connection.query('SELECT * FROM Medlemmer where Brukernavn=?', [username], (error, result) => {
      // connection.query('SELECT CASE WHEN EXIST ( SELECT * FROM Medlemmer WHERE Brukernavn = ?, Passord = ? ) THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END', [username, password], (error, result) => {

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
        console.log("Logget inn!");
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


  // getFriends(id: number): Promise<User[]> {
  //   return new Promise((resolve, reject) => {
  //     connection.query('SELECT * FROM Users where id!=?', [id], (error, result) => {
  //       if(error) {
  //         reject(error);
  //         return;
  //       }
  //
  //       resolve(result);
  //     });
  //   });
  // }
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


