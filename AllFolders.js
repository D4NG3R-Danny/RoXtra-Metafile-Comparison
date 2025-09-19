const some = require('./Auth_1.js')
const http = require("node:http");
const { stdin, stdout } = require('node:process')
const fs = require('node:fs')

async function antwort(verbose,id) {
    // Anmelde-URL ist durch GET /Authenticate definiert
    let ID_Folder = id
    // URL kann in folgender Form sein fuer den Templatestring
    // https://roxtratest.uniklinik-LoreIpsum.de/Roxtra/api/roxApi.svc/rests/GetFolderContent/${ID_Folder}
    const url = ``

    // Warten auf den LoginToken zur Anmeldung der RoXtraAPI
    const Token_API = await some.authentifizierung().then(json => json.LoginToken)
    if(verbose){
        console.log("Token retrieved:",Token_API);
    }
    const File_Details = await fetch(url, {method: 'GET',headers: {
        "Accept": "application/json",
        "authtoken": Token_API
    }}).then(data => data.json() ).then(abc=>abc)
    if(verbose){
        for (let counter = 0; counter < File_Details.FoldersList.length; counter++) {
            // console.log(File_Details.FoldersList[counter]);
            stdout.write(JSON.stringify(File_Details.FoldersList[counter])+"\t\n")
            console.log(File_Details.FoldersList[counter].Id,File_Details.FoldersList[counter].Title)
        }
    }
    return File_Details
}

// Abfrage der Inhalt
async function Unterordner(id) {
    let ID_Folder = id
    // URL kann in folgender Form sein fuer den Templatestring
    //https://roxtratest.uniklinik-LoreIpsum.de/Roxtra/api/roxApi.svc/rests/GetFolderContent/${ID_Folder}
    const url = ``
    const Token_API = await some.authentifizierung().then(json => json.LoginToken)
    const File_Details = await fetch(url, {method: 'GET',headers: {
        "Accept": "application/json",
        "authtoken": Token_API
    }}).then(data => data.json() ).then(abc=>abc)
    return File_Details
}

// Aufstellung aller OrdnerIDs in einer JSON-Datei
async function iterativeSuche() {
    // Zwei Stacks zum durchwechseln
    // Hier koennen die AnfangsIDs eingegeben werden zum Auschluss von bestimmten ordner
    var L1 = [100];
    var L2 = [];
    var counter = 0;
    var allID = "{ \n";
    while(true){
        for (let subfolderid in L1){
            // Anfrage an Ordnerinhalt 
            const result = await antwort(false,L1[subfolderid]);
            for (let index = 0 ; index < result.FoldersList.length; index++){
                //console.log("TEST",result.FoldersList[index].Id,":",result.FoldersList[index].Title);
                // Die Datei muss händisch am Ende um ein Komma gekürzt werden, da letzte Resultat mit , endet.
                allID += `\t"${result.FoldersList[index].Id}": "${result.FoldersList[index].Title}", \n`;
                L2.push(result.FoldersList[index].Id);
            }
        }
        //console.log("\t FIRST ","L1:"+L1+"\n"+"L2:"+L2);
        L1 = L2
        L2 = []
        console.log("\t LAST ","L1:"+L1+"\n"+"L2:"+L2);
        if (JSON.stringify(L1) == '[]') {
            console.log("Fund ends here");
            break;
        }
        counter++;
        // console.log("Counter",counter);
    }
    allID += "}"
    console.log(allID)

    // Schreiben der Ausgabedatei
    const folderPath = "";
    const file_name = `Folder.txt`;

    // Wenn Datei mit dem Name existiert, wird der Inhalt überschrieben.
    // Ende einer Json-Datei
    fs.writeFile(folderPath + file_name, allID, err => {
    if (err) {
        console.log(`\t\tERROR: Datei konnte nicht erstellt werden.`)
        console.error(err);
    } else {
        console.log(`Datei Folder erfolgreich geschrieben`)
        var endTime = performance.now()
        console.log("Dauer:", (endTime-startTime)/1000 ,"Sekunden Laufzeit")
        // Datei Erfolgreich erstellt!
    }
    });
}

// MAIN()
var startTime = performance.now()
iterativeSuche()

