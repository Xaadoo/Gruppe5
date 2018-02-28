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
  loggInnMedlem() {
    connection.query("select * from Medlemmer where (Brukernavn like ? and Passord like ?) order by Brukernavn", ["%" + brukernavnMedlemInput.value + "%", "%" + passordMedlemInput.value + "%"], (error, result) => {
      if (error) throw error;
      console.log(result);
    });
  }
}

module.exports = {
  InnloggingService: InnloggingService
}
