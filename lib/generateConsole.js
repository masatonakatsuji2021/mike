/**
 * =========================================================================================
 * mike
 * 
 * Framework module of web server package "hachiware_server".
 * 
 * License : MIT License. 
 * Since   : 2022.01.15
 * Author  : Nakatsuji Masato 
 * Email   : nakatsuji@teastalk.jp
 * HP URL  : https://hachiware-js.com/
 * GitHub  : https://github.com/masatonakatsuji2021/mike
 * npm     : https://www.npmjs.com/package/mike
 * =========================================================================================
 */

// Console Generator

const fs = require("fs");
const path = require("path");
const tool = require("hachiware_tool");
const sync = require("hachiware_sync");

module.exports = function(routings, conf, context, command, exitResolve){

    conf.rootPath = path.dirname(conf._file);

    var routes = routings.getConsole(command);

    if(!routes){
        console.log("[ERROR] Console Command Not Exists.");
        return exitResolve();
    }

    var shellName = tool.ucFirst(routes.shell) + "Shell";

    var shellPath = conf.rootPath + "/" + conf.mikes.paths.shell + "/" + shellName + ".js";

    if(!fs.existsSync(shellPath)){
        console.log("[Error] The \"" + shellName + "\" Shell class file was not found.\n Path: " + shellPath);
        return exitResolve();
    }

    if(!fs.statSync(shellPath).isFile()){
        console.log("[Error] The \"" + shellName + "\" Shell class file was not found.\n Path: " + shellPath);
        return exitResolve();
    }

    if(!conf.mikes.requestCache){
        delete require.cache[require.resolve(shellPath)];
    }

    var shell = require(shellPath);

    try{
        shell = new shell();
    }catch(error){
        console.log("[Error] The \"" + shellName + "\" class cannot be loaded because the \"" + shellName + "\" class does not exist or the code is incorrect.");
        return exitResolve();
    }

    shell.$routes = routes;
    shell.$conf = conf;
    shell._modules = context.modules;

    sync.then(function(resolve){

        // Filter before clalback

        if(shell.filterBefore){
            shell.filterBefore();
            resolve();
        }
        else if(shell.sync_filterBefore){
            shell.sync_filterBefore(resolve);
        }
        else{
            return resolve();
        }

    }).then(function(resolve){

        // action callback

        var action = routes.action;
        var sync_action = "sync_" + action;

        if(shell[sync_action]){
            shell[sync_action](resolve);
        }
        else if(shell[action]){
            shell[action]();
            resolve();
        }
        else{
            console.log("[Error] Action \"" + routes.action + "\" does not exist in \"" + shellName + "\"");
            return exitResolve();
        }

    }).then(function(resolve){

        // Filter After Callback

        if(shell.filterAfter){
            shell.filterAfter();
            resolve();
        }
        else if(shell.sync_filterAfter){
            shell.sync_filterAfter(resolve);
        }
        else{
            return resolve();
        }

    }).then(function(){

        console.log("...Exit!");
        exitResolve();

    }).start();

};