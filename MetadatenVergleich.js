const some = require('./Auth_1.js')
const metaData = require('./GetFileDetails.js')
const http = require("node:http");
const fs = require('node:fs')

// Abstand zwischen zwei Strings (Benutzbar für den Titel)
function HammingDistance(aStr, bStr,verbose) {
    const longleng = aStr.length > bStr.length ? aStr.length : bStr.length;
    var hammingdist = 0;
    for (let index = 0 ; index < longleng; index++){
        if (aStr[index] === bStr[index]){
            if(verbose){
                console.log(`Similarity at ${index}:`,aStr[index], bStr[index]);
            }
            hammingdist += 1;
        }
    }
    if (verbose) {
        console.log("Hammingdistance is:",hammingdist);
    }
    return hammingdist
}

// normalisierte HammingDistanz ausgehend vom längsten String
function normalHamming(aStr, bStr, verbose){
    var hammingdist = HammingDistance(aStr, bStr, false)
    const longleng = aStr.length > bStr.length ? aStr.length : bStr.length;
    const percent = Math.trunc(((hammingdist/longleng)*100))
    if(verbose) {
        console.log((percent),"% übereinstimmung zwischen \""+aStr+"\" und \""+ bStr+"\"")
    }
    return percent
}


// Vergleicht die Schlagwörter auf Identität 
function KeywordComp(aStr, bStr, verbose, cutoff) {
    // cutoff parameter is for the lower bound of Similarity of two strings
    // it is a percentage between 0 and 100, calculated as the normalised Hamming distance
    ArrFrom = []
    ArrTo = []
    var word = ''
    // Schlagwörter kleinschreiben und Leerzeichen entfernen
    aStr = aStr.toLowerCase().replace(/\s/g,"")
    bStr = bStr.toLowerCase().replace(/\s/g,"")

    if (verbose) {
        console.log("Eingefügte Strings",aStr,bStr)
    }

    // Schlagwörter aus dem Metadatenstring 1 lesen
    for (let index = 0; index < (aStr.length); index++) {
        if(aStr[index] === ','){
            ArrFrom = ArrFrom.concat(word)
            word = ''
            continue
        }
        word += aStr[index]
    }
    ArrFrom = ArrFrom.concat(word)
    word = ''
    // Schlagwörter aus dem Metadatenstring 2 lesen
    for (let index = 0; index < (bStr.length); index++) {
        if(bStr[index] === ','){
            ArrTo = ArrTo.concat(word)
            word = ''
            continue
        }
        word += bStr[index]
    }
    ArrTo = ArrTo.concat(word)

    if (verbose) {
        console.log(ArrFrom,"and", ArrTo)
    }

    // Vergleich beider Schlagwörter Strings auf Identität
    var Identity = 0
    for(let items of ArrFrom){
        if (ArrTo.includes(items)){
            Identity += 1
        }
    }

    if(verbose) {
        console.log(Identity,'identical items found')
    }

    // Vergleicht beide Schlagwörter auf Ähnlichkeit bezüglich des Parameters cutoff
    var Similarity = 0
    for(let item1 of ArrFrom) {
        for(let item2 of ArrTo){
            if(normalHamming(item1, item2,false) >= cutoff){
                Similarity += 1
            }
        }
    }
    if(verbose) {
        console.log(Similarity-Identity,'similar items found')
    }
    return [Identity, Similarity]
}


async function MetaFileOutput(Id1){
    // Abfrage der originalen Datei
    var metaOriginal = JSON.parse(await metaData.Meta_Output(true,907).then(abc => abc))
        
    const contentPath = './'
    // FileIds sind in File.txt
    const contentName = 'File.txt'
    // DoubleFiles werden geschrieben in:
    const database = `Double_Files_of_${Id1}.txt`

    // Datei mit FileIDs lesen und zurückgeben und als JSON auslesen
    var FileIDs = JSON.parse(await fs.readFileSync(contentPath + contentName, 'utf8', (err, data)=> {
        if(err) {
            console.log("ERR:File.txt wurde nicht gelesen \n");
            console.error(err);
        }
        return data
    }))
    console.log(FileIDs)
    // Iteration durch Json-Datenbank(Vergleich der Dateien)
    var Database = []
    var comp;
    for(let items in FileIDs){

        // Auslesen der Metadaten der einzelne FileIDs
        const output = JSON.parse(await metaData.Meta_Output(false,items).then(abc => abc))
        console.log('This is the output \n',output,'\n')

        // Vergleichsfunktion Schlagwort 
        comp = KeywordComp(output.Schlagworte, metaOriginal.Schlagworte, true,80)
        // Vergleich mit dem Titel                        Prozentsatz der Übereinstimmung 
        if (normalHamming(metaOriginal.Titel, output.Titel,false)>=50) {
            console.log("\t --------------------------------")
            Database = Database.concat(output.Titel)
        } 
        // Vergleich mit den Schlagworten    Anzahl der Identität und Similarität
        else if (comp [0]>0 || comp[1]>0) {
            console.log("\t \tschlagwörter:",output.Schlagworte)
            Database = Database.concat(output.Schlagworte)
        }
        
    }
    console.log(Database)
}
//MetaFileOutput(907)
