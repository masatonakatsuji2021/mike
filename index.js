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

const Routing = require("hachiware_routing");
const tool = require("hachiware_tool");
const path = require("path");
const generate = require("./lib/genarate.js");

module.exports = function(conf, context){

    try{

        if(!conf.mikes){
            throw Error("Framework information is not set.");
        }

        if(!conf.mikes.routings){
            throw Error("Framework routing unconfigured.");
        }

        if(!conf.mikes.templateEngine){
            conf.mikes.templateEngine = "hte";
        }

        const acceptTe = [
            "html",
            "hte",
            "ejs",
        ];

        if(acceptTe.indexOf(conf.mikes.templateEngine) === -1){
            throw Error("This Template engine is not supported or dose not exist.");
        }

        if(!conf.mikes.paths){
            conf.mikes.paths = {};
        }

        if(!conf.mikes.paths.default){
            conf.mikes.paths.default = "mikes";
        }

        if(!conf.mikes.paths.controller){
            conf.mikes.paths.controller = conf.mikes.paths.default + "/Controllers";
        }

        if(!conf.mikes.paths.view){
            conf.mikes.paths.view = conf.mikes.paths.default + "/Views";
        }

        if(!conf.mikes.paths.layout){
            conf.mikes.paths.layout = conf.mikes.paths.default + "/Layouts";
        }

        if(!conf.mikes.paths.vpart){
            conf.mikes.paths.vpart = conf.mikes.paths.default + "/Vparts";
        }
        
        if(!conf.mikes.paths.model){
            conf.mikes.paths.model = conf.mikes.paths.default + "/Models";
        }

        if(!conf.mikes.paths.table){
            conf.mikes.paths.table = conf.mikes.paths.default + "/Tables";
        }

        if(!conf.mikes.paths.validator){
            conf.mikes.paths.validator = conf.mikes.paths.default + "/Validators";
        }

        if(!conf.mikes.paths.part){
            conf.mikes.paths.part = conf.mikes.paths.default + "/Parts";
        }

        if(!conf.mikes.paths.shell){
            conf.mikes.paths.shell = conf.mikes.paths.default + "/Shells";
        }

    }catch(error){
        context.color.red("[FW ERROR] ").outn(error);
        process.exit();
    }

    const routings = new Routing("server", conf.mikes.routings);

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

        var plan = null;

        context.then(function(resolve){

            this.outn("Hachiware Server Module Framework (Module Console).").br(2);

            this.outn("Create a sample from the plan below.").br()
                .outn("  - hallo_world ...... Show Hello World in your browser")
                .outn("  - readme ........... Various usage samples of the framework are available")
                .outn("  - webapi ........... Web API that returns JSON format")
                .br()
                .in("Which plan do you want to output? (hallo_world)", function(value, retry){

                    if(!value){
                        value = "hallo_world";
                    }

                    var list = ["hallo_world","readme","webapi"];

                    if(list.indexOf(value) == -1){
                        this.color.red("  [Error] ").outn("No plan entered. retry");
                        return retry();
                    }

                    plan = value;

                    resolve();
                });


        }).then(function(){





        }).start();

    };

};