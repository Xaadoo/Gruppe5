const mysql = require('mysql');

// Setup MySQL-server connection
const connection = mysql.createConnection({
  host     : 'mysql.stud.iie.ntnu.no',
  user     : 'g_oops_25',  // Replace [username] with your username
  password : 'XsWrxOxJ',     // Replace [password] with your password
  database : 'g_oops_25'   // Replace [username] with your username
});

// Connect to MySQL-server
connection.connect(function(error) {
  if(error) throw error; // If error, show error in console and return from this function
});

let brukernavnMedlemInput = document.getElementById("brukernavnMedlem");
let passordMedlemInput = document.getElementById("passordMedlem");
let brukernavnAdminInput = document.getElementById("brukernavnAdmin");
let passordAdminInput = document.getElementById("passordAdmin");

class InnloggingService {
  loggInn(brukernavn, passord) {
    return new Promise ((resolve, reject) => {

      connection.query("SELECT CASE WHEN EXIST ( SELECT * FROM Medlemmer WHERE Brukernavn = ?, Passord = ? ) THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END", [brukernavn, passord], (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        console.log(result);
        resolve(result);

      });
    });
  }
}

module.exports = {
  InnloggingService: InnloggingService
}
