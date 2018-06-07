
export interface Config  {
    //Swagger config
    host : 'http://localhost:8080';
    name : 'name';
    swagger : '2.0';
    version : '1.0';
    schemes : [
        'http',
        'https'
    ];

    //Folder which the generator will loop trough
    inputFolder : 'C:/Users/Jaap Flonk/Documents/backend-basezero/Backend/src/modules'

    //Folder where the generated files will be places
    outputFolder : 'C:/Users/Jaap Flonk/Documents/backend-basezero/Backend/src/docs'

}