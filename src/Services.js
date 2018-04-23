// Imports needed files
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

// This class contains all the questinons for the database regarding forgotton passwords
class ForgottonPasswordService {
    // Gets the user and his details which is connected to the email provided
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
    
    //  Finds out if there is a user with this email
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

    // This is code from Email.js and it sends an email
    sendEmail(emailTo, validatingCode, nameto) {
        emailjs.send("default_service","glemtpassord",{to_name: nameto, from_name: "Rød Fugl", to_email: emailTo, message_html: "Her er din validerings kode: " + validatingCode})
    }
    
    // Changes the password from the email given
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

// This is the class which has all the questions that has with the roles to do
class RoleService {
  // Gets the role from role id
  getRole(rolle_id): Promise<void> {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Roller Where rolle_id = ?', [rolle_id], (error, result) => {
                if(error) {
                    reject(error);
                    return;
                }
                resolve(result[0]);
            });
        });
    }
    
    // Changes the roles from the role id
    changeRoles(
        rolle_id: number,
        Rolle: string,
        Krav: string
    ) : Promise<void>{
        return new Promise((resolve, reject) => {
            connection.query('UPDATE Roller SET Rolle= ?, Krav= ? WHERE rolle_id= ?', [Rolle, Krav, rolle_id], (error, result) => {
                if(error) {
                    reject(error);
                    return;
                }
                resolve(result);
            });
        });
    }
    
    // Gets all the roles in an ascending order
    getRoles(): Promise<void> {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Roller ORDER BY Rolle ASC', (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(result);
            });
        });
    }
    
    // Adds roles
    addRole(Rolle: string, Krav: string) : Promise<void> {
        return new Promise((resolve, reject) => {
            connection.query(
                'INSERT INTO Roller (Rolle, Krav) VALUES (?, ?)', [Rolle, Krav], (error, result) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(result[1]);
                });
        });
    }

    // Gets all compatible roles from the id given
    getCompatibleRolesById(id) : Promise<void> {
      return new Promise((resolve, reject) => {
        connection.query('SELECT * From Roller JOIN Roller WHERE id=?', [id], (error, result) => {
          if (error) {
              reject(error);
              return;
          }
          resolve(result);
        })
      })
    }
}

let roleService = new RoleService;

// This is the class which has all the crew questions for the database
class CrewService {
  // This gets the shift template from the database
  getShiftTemplate() : Promise<void> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT DISTINCT Mannskap.Mann_id, Mannskap.Navn, Roller.rolle_id, Roller.Rolle FROM Mannskap INNER JOIN Roller ON Mannskap.Mann_id = Roller.rolle_id;',
          (error, result) => {
        if(error) {
          reject(error);
          return;
          }
          resolve(result);
          });
      });
  }
  
  // This adds a new shift template
  addShiftTemplate(navn: string) : Promise<void> {
        return new Promise((resolve, reject) => {
            connection.query(
                'INSERT INTO Mannskap (Navn) VALUES ("?")', [navn], (error, result) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve();
                });
        });
    }
}
let crewService = new CrewService;
// Class that performs database queries related to members
class MemberService {
  // Adds new members
  addMember(
    username: string,
    name: string,
    middlename: string,
    surname: string,
    email: string,
    passord: string,
    birthdate: Date,
    phone: string,
    adress: string,
    zipCode: string)
    : Promise<void> {
      return new Promise((resolve, reject) => {
        connection.query(
          'INSERT INTO Medlemmer (Brukernavn, Passord, Fornavn, Mellomnavn, Etternavn, Telefon, Gateadresse, Postnummer, Fødselsdato, Epost) values ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [username, passord, name, middlename, surname, phone, adress, zipCode, birthdate, email], (error, result) => {

          console.log("Sendt " + username + name + middlename + surname + email + passord + zipCode +  birthdate + adress + phone);

          if(error) {console.log(error)
          reject(error)}
          return;

          resolve(result[1]);
        });
      });
    }
  
    // Gets shift points in ascending order
    getMembersVaktpoengAsc() : Promise<void> {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Medlemmer WHERE KontoAktiv=? ORDER BY Vaktpoeng ASC LIMIT 20', [1], (error, result) => {
                if(error) {
                    reject(error);
                    return;
                }
                resolve(result);
            });
        });
      }
    
     // Gives shift points to a member by id
    giveMemberVaktPoeng(vaktpoeng, id) : Promise<void> {
      return new Promise((resolve, reject) => {
        connection.query("UPDATE Medlemmer SET Vaktpoeng=? WHERE ID=?", [vaktpoeng, id], (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        });
      });
    }
    
    // Gets members which accounts are active
    getMembers() : Promise<void> {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Medlemmer WHERE KontoAktiv=? ORDER BY Etternavn ASC', [1], (error, result) => {
                if(error) {
                    reject(error);
                    return;
                }
                resolve(result);
            });
        });
    }
    
    // Gets all members than yourself
    getAllOtherMembers(id) : Promise<void> {
      return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Medlemmer WHERE ID!=? ORDER BY Etternavn ASC", [id], (error, result) => {
          if(error) {
            reject(error);
            return;
          }
          resolve(result);
        });
      });
    }
    
    // Gets all active members than yourself
    getOtherMembers(id) : Promise<void> {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Medlemmer WHERE KontoAktiv=? AND ID!=? ORDER BY Etternavn ASC', [1, id], (error, result) => {
                if(error) {
                    console.log("Test:"+error);
                    reject(error);
                    return;
                }
                resolve(result);
            });
        });
    }
    
    // Gets a member from a search
    getMemberBySearch(search: string) : Promise<void> {
      return new Promise ((resolve, reject) => {
        connection.query('SELECT * FROM Medlemmer WHERE (Fornavn LIKE ? OR Mellomnavn LIKE ? OR Etternavn LIKE ? OR Telefon LIKE ? OR Epost LIKE ?) AND KontoAktiv=1', [search, search, search, search, search], (error, result) => {
            if(error) {
              reject(error);
              return;
            }
            console.log(result);
            resolve(result);
        });
      });
    }
    
    // Gets a member from search even deaactivated accounts
    getAllMembersBySearch(search: string) : Promise<void> {
      return new Promise ((resolve, reject) => {
        connection.query('SELECT * FROM Medlemmer WHERE (Fornavn LIKE ? OR Mellomnavn LIKE ? OR Etternavn LIKE ? OR Telefon LIKE ? OR Epost LIKE ?)', [search, search, search, search, search], (error, result) => {
            if(error) {
              reject(error);
              return;
            }
            console.log(result);
            resolve(result);
        });
      });
    }
    
    // Gets a member from id
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
    
    // Changes a member from id
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
    
    // Change member admin version where you can change if the account if active
    changeMembersAdmin(
      id: number,
      fornavn: string,
      mellomnavn: string,
      etternavn: string,
      telefon: string,
      gateadresse: string,
      postnummer: string,
      fødselsdato: Date,
      epost: string,
      kontoAktiv: string
    ) : Promise<void>{
        return new Promise((resolve, reject) => {
            connection.query('UPDATE Medlemmer SET Fornavn = ?, Mellomnavn=?, Etternavn=?, Telefon=?, Gateadresse=?, Postnummer=?, Fødselsdato=?, Epost=?, KontoAktiv=? WHERE id=?', [fornavn, mellomnavn, etternavn, telefon, gateadresse, postnummer, fødselsdato, epost, kontoAktiv, id], (error, result) => {
                if(error) {
                    reject(error);
                    return;
                }
                resolve(result);
            });
        });
    }
    
    // Delete member by id
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
    
    // Gets account details from username or email
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

// This class has all the queries for the users
class UserService {
  // This is the query which handles the sign in. If it finds a user which has your password and username it sets the
  // local storage item to your account details and signs you in
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

        console.log(result[0]);

        localStorage.setItem('signedInUser', JSON.stringify(result[0])); // Store User-object in browser
        resolve();
      });
    });
  }
  
  // Gets your account details from local storage
  getSignedInUser(): ?User {
    let item = localStorage.getItem('signedInUser'); // Get User-object from browser
    if(!item) return null;

    return JSON.parse(item);
  }
  
// Signs you out by setting the local storage item to blank
  signOut() {
    localStorage.setItem('signedInUser', "");
  }
}
let userService = new UserService();

// Query class which has all the querys with competence to do
class CompetenceService {
  // Gets a competence by id
  getCompetenceById(id) : Promise<void> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM MedlemHarKompetanse mk RIGHT JOIN Kompetanse k ON mk.KompetanseID = k.kompetanseID WHERE mk.ID=?', [id, id], (error, result) => {
        if(error) {
          reject(error);
          return;
        }
        console.log(result);
        resolve(result);
      })
    })
  }
  
  // Gets all competences
  getCompetences() : Promise<void> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * From Kompetanse', (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      })
    })
  }
  
  // Adds a competence
  addCompetenceToId(id, compId) : Promise<void> {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO MedlemHarKompetanse (ID, KompetanseID) values (?, ?)', [id, compId], (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      })
    })
  }

}
let competenceService = new CompetenceService();

// The query class which has to external contact person to do
class ExternalService {
  // Gets external contacts
  getContacts() : Promise<void> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * From EksternKontakt', (error, result) => {
        if(error) {
          reject(error);
          return;
        }
        console.log(result);
        resolve(result);
      })
    })
  }
  
  // Gets external contact from id
  getContact(id) : Promise<void> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM EksternKontakt where=?', [id], (error, result) => {
        if(error) {
          reject(error);
          return;
        }
        resove(result[0]);
      })
    })
  }

}
let externalService = new ExternalService();

// Class which has all the queries with the events
class EventService {
  // Gets all events in order
  getEvents() : Promise<void> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM Arrangementer ORDER BY OppmoteDato ASC', (error, result) => {
        if(error) {
          reject(error);
          return;
        }
        resolve(result);
        });
      });
    }
   // Gets one event from id
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
  // Change an event from id
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
// Adds an event
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

  // Checks all the events a member is interested in
  interestEventCheck(eventId: int, memberId: int) : Promise<void> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM ArrangementInteresse WHERE ArrangementID=? AND ID=?', [eventId, memberId], (error, result) => {
          if(error) {
              reject(error);
              return;
          }
          console.log(result);
          resolve(result[0]);
      })
    })
  }
  
  // Adds a new event that a member is interested in
  interestEvent(eventId: int, memberId: int) : Promise<void> {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO ArrangementInteresse (ArrangementID, ID) values (?, ?)', [eventId, memberId], (error, result) => {
          if(error) {
              reject(error);
              return;
          }
          console.log(result);
          resolve(result);
      })
    })
  }
  
  // Removes an event a member is interested in
  removeInterestEvent(eventId: int, memberId: int) : Promise<void> {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM ArrangementInteresse WHERE ArrangementID=? AND ID=?', [eventId, memberId], (error, result) => {
          if(error) {
              reject(error);
              return;
          }
          console.log(result);
          resolve(result);
      })
    })
  }
  
  // Gets interested event by event id
  getInterestedInEvent(eventId) : Promise<void> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM ArrangementInteresse ai LEFT JOIN Medlemmer m ON ai.ID=m.ID WHERE ArrangementID=?', [eventId], (error, result) => {
          if(error) {
              reject(error);
              return;
          }

          resolve(result);
      })
    })
  }
  
  // Gets a members events from member id
  getMembersEvents(memberId) : Promise<void> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM ArrangHarMedlem am LEFT JOIN Arrangementer a ON am.idArrangementer=a.idArrangementer LEFT JOIN Roller r on am.rolle_id=r.rolle_id WHERE am.ID=? ORDER BY OppmoteDato ASC', [memberId], (error, result) => {
          if(error) {
              reject(error);
              return;
          }

          resolve(result);
      })
    })
  }
  
  // Sends email for confirmation about confirmed shift
  sendEmailForConfirmation(
    nameto,
    emailTo,
    arrangementNavn,
    arrangementBeskrivelse,
    arrangementPostnummer,
    startDato,
    sluttDato,
    startTid,
    sluttTid,
    oppMoteDato,
    oppMoteTidspunkt,
    oppMoteSted,
    kontaktPerson)

  {
    emailjs.send("default_service","p_melding_til_vakt",{
      to_name: nameto,
      from_name: "Rød Fugl",
      to_email: emailTo,
      message_html1: "Du har blitt påmeldt til vakt på " + arrangementNavn + "!",
      message_html2: "Her er all informasjonen du trenger om arrangement! Gå inn på arrangementer i Rød Fugl for å bekrefte vakten!",
      message_html3: "Beskrivelse: " + arrangementBeskrivelse + ". Postnummer: " + arrangementPostnummer + ". Startdato: " + startDato + ". SluttDato: " + sluttDato + ". Starttidspunkt: " + startTid + ". Slutttidspunkt: " + sluttTid + ". Oppmøtedato: " + oppMoteDato + ". Oppmøtetidspunkt: " + oppMoteTidspunkt + ". Oppmøtested: " + oppMoteSted + ". Kontaktperson: " + kontaktPerson + "."
    })
  }

}
let eventService = new EventService();

// Class which has all the queries about rosters
class RosterService {
  // Adds a role to the event by id
   addRoleToEvent(eventId, roleId) : Promise<void> {
     return new Promise((resolve, reject) => {
       connection.query('INSERT INTO ArrangHarMedlem (idArrangementer, rolle_id) values (?, ?)', [eventId, roleId], (error, result) => {
         if(error) {
           reject(error);
           return;
         }
         resolve(result);
       })
     })
   }
  
   // Gets roster from event by event id
  getRosterFromEvent(eventId: int) : Promise<void> {
      return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM ArrangHarMedlem am LEFT JOIN Medlemmer m ON am.ID=m.ID LEFT JOIN Roller r ON am.rolle_id = r.rolle_id WHERE am.idArrangementer=? ORDER BY am.rolle_id DESC', [eventId], (error, result) => {
          console.log(result);
          if(error) {
              reject(error);
              return;
          }
          resolve(result);
        })
      })
  }

   // Adds a member to event roster with shift id
  addToEventRosterByVaktRolleId(memberId, VaktRolleId, check) : Promise<void> {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE ArrangHarMedlem SET ID=?, Godkjenning=? WHERE VaktRolleId=?', [memberId, check, VaktRolleId], (error, result) => {
        if(error) {
            reject(error);
            return;
        }
        console.log(result);
        resolve(result);
      })
    })
  }

  // Checks roster for members by event id and member id
 checkRosterForMember(eventId: int, memberId: int) : Promise<void> {
     return new Promise((resolve, reject) => {
       connection.query('SELECT * FROM ArrangHarMedlem WHERE idArrangementer=? AND ID=?', [eventId, memberId], (error, result) => {
           if(error) {
               reject(error);
               return;
           }
           console.log(result);
           resolve(result[0]);
       })
     })
 }
  
 // Checks roster for members by only member id 
 checkRosterForMembers(eventId: int) : Promise<void> {
     return new Promise((resolve, reject) => {
       connection.query('SELECT * FROM ArrangHarMedlem WHERE idArrangementer=? AND ID LIKE ?', [eventId, '%'], (error, result) => {
           if(error) {
               reject(error);
               return;
           }
           console.log(result);
           resolve(result);
       })
     })
  }

  // Checks roster for active members by event id
  checkRosterForInvertedMembers(eventId: int) : Promise<void> {
      return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM Medlemmer m WHERE m.KontoAktiv > 0', [eventId], (error, result) => {
            if(error) {
                reject(error);
                return;
            }
            console.log(result);
            resolve(result);
        })
      })
   }
  
   // Gets open roster by event id
  getOpenRoster(eventId: int): Promise<void> {
      return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM ArrangHarMedlem am LEFT JOIN Roller r ON am.rolle_id=r.rolle_id WHERE idArrangementer=? AND ID IS NULL', [eventId], (error, result) => {
            if(error) {
                reject(error);
                return;
            }
            console.log(result);
            resolve(result);
        })
      })
   }
  
   // Deletes roster by shift role id
   deleteRosterByVaktRolleId(VaktRolleId: int) : Promise<void> {
       return new Promise((resolve, reject) => {
         connection.query('DELETE FROM ArrangHarMedlem WHERE VaktRolleId = ?', [VaktRolleId], (error, result) => {
             if(error) {
                 reject(error);
                 return;
             }
             console.log(result);
             resolve(result);
         })
       })
    }

}
let rosterService = new RosterService();

//Exports all the different classes
export {userService, Eventa, eventService, memberService, externalService, roleService, competenceService, crewService, rosterService, forgottonPasswordService };
