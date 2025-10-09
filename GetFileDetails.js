const some = require('./Auth_1.js')
const http = require("node:http");
const fs = require('node:fs')


// HEADER: Inhalt der Anmeldung; HTTP-Method gehört hier nicht rein.
// Funktionsaufruf mit Ausgabe aller Metadaten
async function antwort(verbose,id) {
    // Metadatenabfrage ist durch GET /GetFileDetails definiert
    let ID_File = id
    // URL kann in folgender Form sein fuer den Templatestring
    //https://roxtratest.uniklinik-LoreIpsum.de/Roxtra/api/roxApi.svc/rests/GetFileDetails/${ID_File}
    const url = ``

    if(verbose){
        console.log("Start der Funktion");
    }
    const Token_API = await some.authentifizierung().then(json => json.LoginToken)
    if(verbose){
        console.log("Token retrieved:",Token_API);
    }
    const File_Details = await fetch(url, {method: 'GET',headers: {
        "Accept": "application/json",
        "authtoken": Token_API
    }}).then(data => data.json() ).then(abc=>abc)
    if(verbose){
        console.log(File_Details)
    }
    return File_Details
}

// Filtern bestimmter Metadaten und schreiben als Datei
async function Meta_File(verbose,id){
    const content = await antwort(verbose,id);
    var metaData = "{ \n" ; 

    // Auslesen der Metadaten
    for (parts in Object.values(content.Fields)){
        // console.log(content.Fields[parts]);
        let field = content.Fields[parts].FieldCaption;

        // Zusätzliche Metadaten können hier herausgesucht werden.
        if (field == "Titel" || field == "Dateigröße" || field == "Schlagworte" || field == "Dateiname") {
            //console.log(content.Fields[parts].FieldCaption," : ", content.Fields[parts].Value);
            metaData += `\t"${content.Fields[parts].FieldCaption}": "${content.Fields[parts].Value}" ,\n`;
        }
    }
    metaData = metaData.substring(0, metaData.length-2)
    metaData += "\n}"
    const folderPath = "./";
    const file_name = `MetaFile${id}.txt`;

    // Wenn Datei mit dem Name existiert, wird der Inhalt überschrieben.
    // Ende einer Json-Datei
    fs.writeFile(folderPath + file_name, metaData, err => {
    if (err) {
        console.log(`\t\tERROR: Metadaten für ${id} wurden nicht geschrieben.`)
        console.error(err);
    } else {
        console.log(`Datei mit ${id} erfolgreich geschrieben`)
        // Datei Erfolgreich erstellt!
    }
    });
    // console.log(metaData)
    // Anzahl der Attribute/Metadaten/Felder
    // console.log(parseInt(Object.keys(content.Fields).pop())+1);
}

// Filtern bestimmter Metadaten und zurückgeben als Wert
async function Meta_Output(verbose,id){
    const content = await antwort(false,id);
    var metaData = "{ \n" ; 
    // Auslesen der Metadaten
    for (parts in Object.values(content.Fields)){
        let field = content.Fields[parts].FieldCaption;
        // Zusätzliche Metadaten können hier herausgesucht werden.
        // console.log("What is going on:",field)
        if (field == "Titel" || field == "Dateigröße" || field == "Dateiname") {
            metaData += `\t"${content.Fields[parts].FieldCaption}": "${content.Fields[parts].Value}",\n`;
            //console.log(metaData);
        }
        if (field == "Schlagworte"){
            metaData += `\t"${content.Fields[parts].FieldCaption}":`
            console.log("Schlagworte", JSON.stringify(content.Fields[parts].Value))
            var stringer = content.Fields[parts].Value
            metaData += ` "${stringer.trim().split(/\r\n|\n|\r/).join(',')}",\n`
        }
    }
    metaData = metaData.substring(0, metaData.length-2)
    metaData += "\n}"
    return metaData
}
// MAIN() auskommentiert lassen, da andere Dateien diese Modul benutzen
// Meta_File(true,1604)
// Meta_Output(true,1604)

module.exports.Meta_Output = Meta_Output
module.exports.Meta_File = Meta_File
