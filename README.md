# About the Software & Project
RoXtra is a quality management (QM) software that stores a large volume of files within its "Prozessmodel" module. In a large organization, such as a hospital, this can lead to the unsupervised creation of numerous redundant files.

This project implements a solution to identify duplicate or similar files. Instead of relying on complex AI, it utilizes the existing metadata—specifically the file name and info tags—to compare documents. This provides a fast and reasonably reliable method for detecting copies.

Because of the nature of the project,<ins> this won't be continued in any shape or form </ins>. This was just a small improvement of the [PublicAPI implementation](https://github.com/roXtra/PublicAPI) of RoXtra.

## API Integration
The project interacts with the RoXtra API, whose official documentation and examples can be found on their [Github page](https://github.com/roXtra/PublicAPI). Their examples primarily use the [httpYac](https://marketplace.visualstudio.com/items?itemName=anweber.vscode-httpyac) and [httpBook](https://marketplace.visualstudio.com/items?itemName=anweber.httpbook) Visual Studio Code extensions.

While useful for simple requests, these tools are less practical for building complex logic like loops and data processing. Therefore, this project is built using JavaScript and Node.js for a more powerful and programmable approach.

## Project Structure
The code is organized into modules for better readability and maintainability. Many core functions are located in their own JavaScript files.

For example:

**Auth1.js** contains the authentication logic to retrieve a security token from the API server, which is required for all subsequent API calls.

**AllFiles.js** takes IDs of folders from a local file (e.g. Folder.txt) and creates a txt-File with IDs of Files from those folders.

**AllFolders.js** starts either at the root or specified folder and uses queue to get all IDs of folders depending on a depth/iteration parameter. Creates a Folder.txt to be used by AllFiles.js.

**GetFileDetails.js** fetches the metainformation of any existing file given an ID. 

**MetaDatenVergleich.js** takes the metainformation of GetFileDetails.js and uses Hammingdistance for comparison.

## Using This Project as a Template
You can use this repository as a template for your own RoXta API integrations. The modular structure makes it easy to understand, extend, and adapt the code to your specific needs.

## Tips
If you have typos in your Project you can get answers from your API-calls such as:

{

  "Description": "Ordner-/Akten-/Dateioperation nicht möglich",
  
  "ErrorID": 10100,
  
  "LongDescription": "Zugriffsrechte fehlen"
  
}
