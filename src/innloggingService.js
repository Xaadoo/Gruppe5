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
  //kaskje id må stå idArrangementer?
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
  getEvents() {
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

  addEvent(
    eventName: string, zipCode: number,
    eventStartDate: string,
    eventEndDate: string,
    eventDescription: string,
    startTime: string,
    endTime: string,
    meetingDate: string,
    meetingPoint: string,
    meetingTime: string,
    contactPerson: string)
    : Promise<void> {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO Arrangementer (Arrangement_Navn, Postnummer, StartDato, SluttDato, Beskrivelse, StartTid, SluttTid, OppmoteDato, OppmoteSted, OppmoteTid, EksternKontakt) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [eventName, eventStartDate, eventEndDate, eventDescription, startTime, endTime, meetingDate, meetingPoint, meetingTime, contactPerson], (error, result) => {
      // connection.query( 'SELECT EXISTS (SELECT * FROM Medlemmer WHERE Brukernavn = ? AND Passord = ?', [username, password], (error, result) => {
      // connection.query('SELECT * FROM Medlemmer where Brukernavn=?', [username], (error, result) => {
      // connection.query('SELECT CASE WHEN EXIST ( SELECT * FROM Medlemmer WHERE Brukernavn = ?, Passord = ? ) THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END', [username, password], (error, result) => {

        if(error) {
          reject(error);
          return;
        }
        if(typeof(result.insertId) !=='number') {
          reject(new Error('Could not read insertId'))
          return;
        }

        resolve(result.insertId);
      });
    });
  }
}
let eventService = new EventService();
//skrev Eventa fordi Event er et reservert ord
  export { User, userService, Eventa, eventService };

// class InnloggingService {
//   loggInn(brukernavn, passord) {
//     return new Promise ((resolve, reject) => {
//
//       connection.query("SELECT CASE WHEN EXIST ( SELECT * FROM Medlemmer WHERE Brukernavn = ?, Passord = ? ) THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END", [brukernavn, passord], (error, result) => {
//         if (error) {
//           reject(error);
//           return;
//         }
//
//         console.log(result);
//         resolve(result);
//
//       });
//     });
//   }
// }
