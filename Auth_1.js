const http = require("node:http");

// Anmelde-URL ist durch GET /Authenticate definiert
// Die Url kann die Form besitzen:
// https://roxtratest.uniklinik-LoreIpsum.de/Roxtra/api/roxApi.svc/rests/Authenticate
// Username und password sollten von einem eingetragenen Nutzer aus RoXtra sein mit genuegenden Rechten.
const url = ''
let username = ''
let password = ''
let headers = new Headers()

// HEADER: Inhalt der Anmeldung; HTTP-Method gehört hier nicht rein.
headers = {
    "Accept": "application/json",
    "Authorization": 'Basic ' + Buffer.from(username + ":" + password).toString('base64')
}

// Der Token wird hier vom Programm an uns geschickt.
async function authentifizierung() {
    const authentication = await fetch(url, {method: 'GET',headers: headers}).then(response => response.json()).then(json=>json )
    return authentication
}

// Modul wird exportiert fuer andere JS Files.
// Wiedergabe der Funktion muss mittels .then() abgefragt werden.
// Für Login.Token:
// authentifizierung().then(json => json.LoginToken)
module.exports.authentifizierung = authentifizierung;
