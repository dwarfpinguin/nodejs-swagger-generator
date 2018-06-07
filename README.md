# swagger-generator README

This is a quickly made generator that loops trough all documents in a specified folder and makes
swagger documentation for all files that use express. It will take out all the "req.body" values
and the route of the API (example: 'api/account/get-user-data').I

## Features
- Makes simple swagger documentation for Express API files.
- You can choose your own input (where the API files are) and output (where the documentation will be saved) folder.

## Extension Settings

This extension contributes the following settings:

* `swaggergen.outputPath`: path where the documents will be saved
* `swaggergen.inputPath`: path where the API files are