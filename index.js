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
const tool = require("hachiware_tool");
const path = require("path");
const generate = require("./lib/genarate.js");

module.exports = function(conf, context){

    try{

        if(!conf.frameworks){
            throw Error("Framework information is not set.");
        }

        if(!conf.frameworks.routings){
            throw Error("Framework routing unconfigured.");
        }

        if(!conf.frameworks.templateEngine){
            conf.frameworks.templateEngine = "hte";
        }

        const acceptTe = [
            "html",
            "hte",
            "ejs",
        ];

        if(acceptTe.indexOf(conf.frameworks.templateEngine) === -1){
            throw Error("This Template engine is not supported or dose not exist.");
        }

        if(!conf.frameworks.paths){
            conf.frameworks.paths = {};
        }

        if(!conf.frameworks.paths.default){
            conf.frameworks.paths.default = "frameworks";
        }

        if(!conf.frameworks.paths.controller){
            conf.frameworks.paths.controller = conf.frameworks.paths.default + "/Controllers";
        }

        if(!conf.frameworks.paths.view){
            conf.frameworks.paths.view = conf.frameworks.paths.default + "/Views";
        }

        if(!conf.frameworks.paths.layout){
            conf.frameworks.paths.layout = conf.frameworks.paths.default + "/Layouts";
        }

        if(!conf.frameworks.paths.vpart){
            conf.frameworks.paths.vpart = conf.frameworks.paths.default + "/Vparts";
        }
        
        if(!conf.frameworks.paths.model){
            conf.frameworks.paths.model = conf.frameworks.paths.default + "/Models";
        }

        if(!conf.frameworks.paths.table){
            conf.frameworks.paths.table = conf.frameworks.paths.default + "/Tables";
        }

        if(!conf.frameworks.paths.validator){
            conf.frameworks.paths.validator = conf.frameworks.paths.default + "/Validators";
        }

        if(!conf.frameworks.paths.part){
            conf.frameworks.paths.part = conf.frameworks.paths.default + "/Parts";
        }

        if(!conf.frameworks.paths.shell){
            conf.frameworks.paths.shell = conf.frameworks.paths.default + "/Shells";
        }

    }catch(error){
        context.color.red("[FW ERROR] ").outn(error);
        process.exit();
    }

    const routings = new Routing("server", conf.frameworks.routings);

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