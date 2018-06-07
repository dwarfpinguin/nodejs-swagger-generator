'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs'
import * as path from 'path'
import { ADDRGETNETWORKPARAMS } from 'dns';

var mkdirp = require('mkdirp')

let paths = []

//Config
let config = vscode.workspace.getConfiguration('swaggergen')


export function activate(context: vscode.ExtensionContext) {
    
    let disposable = vscode.commands.registerCommand('extension.swagger-generator', () => {
        //Returns an array of all the files in the directory
        const walkSync = (d) => fs.statSync(d).isDirectory() ? fs.readdirSync(d).map(f => walkSync(path.join(d, f))) : d;
        console.log(config.get('inputPath'))
        const moduleDir = walkSync(config.get('inputPath'))
        console.log('kanker')
        //Find all paths and add them to array
        paths = []
        findPaths(moduleDir)           

        //Generate documentation for all files that contain express
        let apiDocumentation = StartOfDoc()
        for(let i = 0; i < paths.length; i++) {
            let txt = fs.readFileSync(paths[i], 'utf8')
                
            if (txt.includes('Router().post') || txt.includes('Router().get')) {
                let type = 'post'
                if(txt.includes('Router().get')) {
                    type = 'get'
                } 
    
                let apiName = GetApiName(txt, type)   
                let apiTitle = ConvertToTitle(apiName)   
                let params = GetParams(txt, type)
                let tag = GetTag(apiName)

                apiDocumentation += GenerateJson(apiTitle, apiName, params, type, tag)     
            } else {
                console.log('Skipped file (no express): ' + paths[i])
            }
        
            
        }    

        let saveDir = config.get('outputPath')
        console.log(saveDir)

        //make directory only if it does not exist
        mkdirp(saveDir, (err) => {
            if (err) console.error(err)
            else console.log('Made directory')
        })

        apiDocumentation = apiDocumentation.substring(0, apiDocumentation.length-1)
        apiDocumentation += '\n}\n}'

        //makes file if it does not exist or overwrites it if it does exist
        fs.writeFileSync(saveDir + '/swagger.json', apiDocumentation)

    });

    context.subscriptions.push(disposable);
}

export function findPaths(arr, filter = ''){
    for(var i = 0; i < arr.length; i++){
        if(arr[i] instanceof Array){
            //console.log(arr[i].contains(filter))
            findPaths(arr[i]);
        }else{
            paths.push(arr[i])
        }
    }
}

export function GetParams(txt, type) {
    let offset = 15
    if (type == 'get') offset = 14

    let apiName = txt.substring(txt.search("Router") + offset, txt.indexOf(',', txt.search("Router"))-1)

    //title for doc
    let apiNameForJson = ToTitleCase(apiName)
    apiNameForJson = apiNameForJson.replace(/\//g,"")
    apiNameForJson = apiNameForJson.replace(/-/g,"")

    let params = []
            
    let startIndex = txt.indexOf('req.body.')

    while (txt.indexOf('req.body.') != -1) {
        let bodyName = txt.substring(startIndex + 9, txt.indexOf(' ', startIndex))

        let symbols = ' .!@#$%^&*()_+-={}[]'
        for (let i = 0; i < symbols.length; i++) {               
            if(bodyName.indexOf(symbols.charAt(i)) > -1)
                bodyName = bodyName.slice(0, bodyName.indexOf(symbols.charAt(i)))
        }

        bodyName  = bodyName.replace(/\r?\n|\r/g,"");

        let add = true
        for (let i = 0; i < params.length; i++) {
            if(params[i] == bodyName) {
                add = false
            }
        }
        
        if(add)
            params.push(bodyName)               

        txt = txt.slice(txt.indexOf(bodyName) + bodyName.length, -1)
        startIndex = txt.indexOf('req.body.')
    }

    return params
}

export function GetApiName(txt, type) {
    let offset = 15
    if (type == 'get') offset = 14

    let apiName = txt.substring(txt.search("Router") + offset, txt.indexOf(',', txt.search("Router"))-1)

    return apiName
}

export function ConvertToTitle(apiName) {
    //title for doc
    let apiNameTitle = ToTitleCase(apiName)
    apiNameTitle = apiNameTitle.replace(/\//g,"")
    apiNameTitle = apiNameTitle.replace(/-/g,"")

    return apiNameTitle
}

export function ToTitleCase(str) {
    return str.toLowerCase().replace(/(?:^|[\s-/])\w/g, function (match) {
        return match.toUpperCase()
    })
}

export function GetTag(apiName) {
    let tag = apiName.substring(1, apiName.length)
    tag = tag.substring(0, tag.search('/'))

    return tag
}

export function reverse(s){
    return s.split("").reverse().join("");
}

export function StartOfDoc() {
    return '{'
    + '\n"swagger": "'+config.get('swagger')+'",'
    + '\n"info": {'
    + '\n"version": "'+config.get('version')+'",'
    + '\n"title": "'+config.get('documentationName')+'"'
    + '\n},'
    + '\n"schemes": ['
    + '\n"https",'
    + '\n"http"'
    + '\n],'
    + '\n"host": "'+config.get('hostName')+'",'
    + '\n"basePath": "",'
    + '\n"paths": {'
}

export function GenerateJson(apiTitle, apiName, params, type, tag) {
    let swaggerDocument = '\n"/api' + apiName + '" : {'
        + '\n"' + type + '": {'
        + '\n"summary" : "' + apiTitle + '",'
        + '\n"tags" : ["' + tag + '"],'
        + '\n"parameters" : [ {'
        + '\n"in" : "body",'
        + '\n"name" : "body",'
        + '\n"required" : true,'
        + '\n"schema" : {'
        + '\n"type" : "object",'
        + '\n"properties" : {'

    for(let i = 0; i < params.length; i++) {
        swaggerDocument += '\n"' + params[i] + '": {'
        + '\n"type": "string",'
        + '\n"example": "' + params[i] + '"'



        if (i+1 == params.length) {
            swaggerDocument += '\n}'
        } else {
            swaggerDocument += '\n},'
          
        }  
    }

    swaggerDocument +='\n}'
    + '\n}'
    + '\n}]'
    + '\n}'
    + '\n},'

    return swaggerDocument
}

export function spacing(amount) {
    let spacing = '\n'

    for(let i; i < amount; i++) {
        spacing += '\t'
    }

    return spacing
}

