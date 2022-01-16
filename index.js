/**
 * =========================================================================================
 * Hachiware_Server_module_framework
 * 
 * Framework module of web server package "hachiware_server".
 * 
 * Author : Nakatsuji Masato 
 * GitHub : https://github.com/masatonakatsuji2021/hachiware_server_module_framework
 * =========================================================================================
 */
const Routing = require("hachiware_routing");
const tool = require("hachiware_tool");
const fs = require("fs");

module.exports = function(conf, context){

    if(!conf.frameworks){
        return;
    }
    
    var routings = new Routing("server", conf.frameworks.routings);

    const setController = function(routes, req, res){

        if(conf.frameworks.path){
            conf.frameworks.path = "src";
        }

        var controllerName = tool.ucFirst(routes.controller) + "Controller";

        var controllerPath = conf.rootPath + "/" + conf.frameworks.paths.Controller + "/" + controllerName + ".js";

        if(!fs.existsSync(controllerPath)){
            throw Error("\"" + controllerName + "\" is not found.");
        }

        if(!fs.statSync(controllerPath).isFile()){
            throw Error("\"" + controllerName + "\" is not File.");
        }

        controllerPath = controllerPath.split("/").join("\\");

        if(conf.frameworks.noRequireCache){
            delete require.cache[controllerPath];
        }

        var cont = require(controllerPath);

        cont = new cont();

        cont.req = req;
        cont.res = res;
        cont.routes = routes;

        context.then(function(resolve){

            var syncName = "sync_" + routes.action;

            if(cont[syncName]){
                if(routes.mode == "success"){
                    cont[syncName](resolve);
                }
                else{
                    cont[syncName](resolve, routes.exception);
                }
            }
            else if(cont[routes.action]){

                if(routes.mode == "success"){
                    cont[routes.action]();
                }
                else{
                    cont[routes.action](routes.exception);
                }
                resolve();
            }
            else{
                throw Error("\"" + routes.action + "\" action for \"" + controllerName + "\" does not exist");
            }
    
        }).then(function(){

        }).start();
    };

    /**
     * fookRequest
     * @param {*} resolve 
     * @param {*} req 
     * @param {*} res 
     */
    this.fookRequest = function(resolve, req, res){

        if(!conf.frameworks){
            return resolve();
        }

        var routes = routings.get(req.url);

        try{
            setController.bind(this)(routes, req, res);
        }catch(error){

            var errorRoutes = routings.getError(req.url);

            errorRoutes.exception = error;

            try{
                setController.bind(this)(errorRoutes, req, res);
            }catch(error2){
                res.write(error.stack.toString());
                res.end();    
            }
        }
    };


};