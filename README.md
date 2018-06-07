# Swagger made easy

This is a quickly made generator that loops trough all documents in a specified folder and makes
swagger documentation for all files that use express. It will take out all the "req.body" values
and the route of the API (example: 'api/account/get-user-data').I

## Features
- Makes simple swagger documentation for Express API files.
- You can choose your own input (where the API files are) and output (where the documentation will be saved) folder.

## Usage
In vscode press `CTRL+SHIFT+P` to open the commands and type `swagger-generator` and press `enter`.

The program will run trough your `swaggergen.inputPath` folder. It will then
scoop out all the `req.body` variables and the route of the API call.

The results will be placed in the `swaggergen.outputPath` folder, in a file called `swagger.json`.

## Extension Settings

To open the settings go to `File`>`Preferences`>`Settings`. In the settings you can overwrite the 
default settings. For more information on this go to: https://code.visualstudio.com/docs/getstarted/settings

This extension contributes the following settings:

* `swaggergen.outputPath`: Path where the documents will be saved (default "")
* `swaggergen.inputPath`: Path where the API files are (default "")
* `swaggergen.hostName`: Name of the swagger host (default "http://localhost:8080")
* `swaggergen.documentationName`: Title that will be at the top of the documentation (default "API documentation")
* `swaggergen.swagger`: Swagger version (default "2.0")
* `swaggergen.version`: Version of the documentation (default "1.0")