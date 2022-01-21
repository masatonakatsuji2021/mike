/**
 * =========================================================================================
 * Hachiware_Server_module_framework
 * 
 * Framework module of web server package "hachiware_server".
 * 
 * License : MIT License. 
 * Since   : 2022.01.15
 * Author  : Nakatsuji Masato 
 * Email   : nakatsuji@teastalk.jp
 * HP URL  : https://hachiware-js.com/
 * GitHub  : https://github.com/masatonakatsuji2021/hachiware_server_module_framework
 * npm     : https://www.npmjs.com/package/hachiware_server_module_framework
 * =========================================================================================
 */

const Routing = require("hachiware_routing");
const path = require("path");
const generate = require("./bin/genarate.js");

module.exports = function(conf, context){

    var routings;

    this.fookStart = function(){
        routings = new Routing("server", conf.frameworks.routings);
    };

    /**
     * fookRequest
     * @param {*} resolve 
     * @param {*} req 
     * @param {*} res 
     */
    this.fookRequest = function(resolve, req, res){
        generate(routings, conf, context, req, res);
    };

    /**
     * fookConsole
     * @param {*} rootPath 
     * @param {*} args 
     * @param {*} exitResolve 
     */
    this.fookConsole = function(rootPath, args, exitResolve){

        var info = {};

        context.then(function(resolve){

            this.outn("Hachiware Server Module Framework (Module Console).").br(2);

            this.in("Q. Port the initial settings of framework to the configuration file \"" + path.basename(conf._file,".js") + "\". Is it OK? [y/n] (y)", function(value, retry){

                if(!value){
                    value = "y";
                }

                value = value.toLowerCase();

                if(value == "y"){
                    return resolve();
                }

                this.br(2).outn(".....Cancel");

                exitResolve();
            });

        }).then(function(){

            console.log("OK!");

        }).start();

    };

};