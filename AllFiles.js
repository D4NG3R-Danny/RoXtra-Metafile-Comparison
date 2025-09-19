const some = require('./Auth_1.js')
const http = require("node:http");
const { stdin, stdout } = require('node:process')
const fs = require('node:fs')


const contentPath = './'
// FolderIDs sind in   Folder.txt
const contentName = 'Folder.txt'
// FileIDs werden geschrieben in File.txt
const filesJson = 'Files.txt' 

async function DateienLeser() {
    // Datei mit FolderIDs lesen und zurückgeben und als JSON auslesen
    var FolderIDs = JSON.parse(await fs.readFileSync(contentPath + contentName, 'utf8', (err, data)=> {
        if(err) {
            console.log("ERR:Folder.txt wurde nicht gelesen \n");
            console.error(err);
        }
        return data
    }))

    const Token_API = await some.authentifizierung().then(token => token.LoginToken)

    // Anfang der Dateien-Datenbank 
    var File_Database = "{ \n";
    // Übergeordnete Schleife geht durch OrdnerIDs der Folder.txt Datenbank
    for(let value in FolderIDs){
        //console.log("Ordner" ,FolderIDs[value]," mit ID", value)
        var folderID = value
        // URL kann folgende Form haben
        //https://roxtratest.uniklinik-LoreIpsum.de/Roxtra/api/roxApi.svc/rests/GetFolderContent/${folderID}
        var url = ``
        // Abfrage der OrdnerInhalte
        const FilesOfFolder = await fetch(url, {method: 'GET', headers: {
            "Accept": "application/json",
            "authtoken": Token_API
        }}).then(data => data.json()).then(abc => abc)
        // ID und Titel der einzelnen Dateien
        // Erste Schleife geht durch alle Dateien eines Ordners durch
        for(let key of FilesOfFolder.FilesList) {
            console.log(key.Id)
        // Zweite Schleife geht über die Felderattribute der Dateien
            for(let index = 0 ; index < key.Fields.length; index++){
                if(key.Fields[index].FieldCaption == "Titel"){
                    File_Database += `\t"${key.Id}": "${key.Fields[index].Value}",\n`;
                }
            }
        }
    }
    File_Database = File_Database.substring(0, File_Database.length-2)
    File_Database += "\n}";

    const folderPath = "";
    const file_name = `File.txt`;

    // Wenn Datei mit dem Name existiert, wird der Inhalt überschrieben.
    // Ende einer Json-Datei
    fs.writeFile(folderPath + file_name, File_Database, err => {
    if (err) {
        console.log(`\t\tERROR: Datei konnte nicht erstellt werden.`)
        console.error(err);
    } else {
        console.log(`Datei Folder erfolgreich geschrieben`)
        // Datei Erfolgreich erstellt!
    }})
    console.log(File_Database)
    var endTime = performance.now()
    console.log()
    console.log("+++++++++++++LAUFZEIT++++++++++++++++")
    console.log((endTime - startTime)/1000+" Sekunden Laufzeit")
}
// Laufzeit messen
var startTime = performance.now()
DateienLeser()
