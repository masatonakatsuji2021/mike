
const tool = require("hachiware_tool");
const fs = require("fs");

module.exports = function(routings, conf, context, req, res){

    const echo = function(string){
        _string += string;
    };
    const statusCode = function(statusCode){
        if(statusCode){
            _statusCode = statusCode;
        }
        else{
            return _statusCode;
        }
    }

    const setController = function(routes, req, res){

        if(routes.mode == MODE_ERROR){
            if(_statusCode == 200){
                _statusCode = 500;
            }
        }

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
        cont.$echo = echo;
        cont.$statusCode = statusCode;

        context.then(function(resolve){

            if(cont.sync_filterBefore){
                if(routes.mode == MODE_ERROR){
                    cont.sync_filterBefore(resolve,routes.exception);
                }
                else{
                    cont.sync_filterBefore(resolve);
                }
                return;
            }
            else if(cont.filterBefore){
                if(routes.mode == MODE_ERROR){
                    cont.filterBefore(routes.exception);
                }
                else{
                    cont.filterBefore();
                }
            }

            resolve();

        }).then(function(resolve){

            var syncName = "sync_" + routes.action;

            if(cont[syncName]){
                if(routes.mode == MODE_ERROR){
                    cont[syncName](resolve, routes.exception);
                }
                else{
                    cont[syncName](resolve);
                }
            }
            else if(cont[routes.action]){

                if(routes.mode == MODE_ERROR){
                    cont[routes.action](routes.exception);
                }
                else{
                    cont[routes.action]();
                }
                resolve();
            }
            else{
                throw Error("\"" + routes.action + "\" action for \"" + controllerName + "\" does not exist");
            }
    
        }).then(function(resolve){

            try{
                if(cont.sync_filterAfter){
                    if(routes.mode == MODE_ERROR){
                        cont.sync_filterAfter(resolve, routes.exception);
                    }
                    else{
                        cont.sync_filterAfter(resolve);
                    }
                    return;
                }
                else if(cont.filterAfter){
                    if(routes.mode == MODE_ERROR){
                        cont.filterAfter(routes.exception);
                    }
                    else{
                        cont.filterAfter();
                    }
                }
    
                resolve();

            }catch(exception){
                goError(exception, req, res);
            }

        }).then(function(resolve){

            if(!conf.frameworks.templateEngine){
                conf.frameworks.templateEngine = "hte";
            }

            var te = conf.frameworks.templateEngine;

            if(te == "ejs"){


            }
            else if(te == "hte"){
                var hte = require("hachiware_te");

                var hts = new hte({
                    path: __dirname + "/hte",
                    errorDebug: true,
                    load: "main.hte",
                });

                _string = hts.out();
            }

        }).then(function(){

            res.statusCode = _statusCode;
            res.write(_string);
            res.end();

        }).start();
    };

    const goError = function(exception, req, res){

        var errorRoutes = routings.getError(req.url);

        errorRoutes.exception = exception;

        try{
            setController.bind(this)(errorRoutes, req, res);
        }catch(error2){
            res.write(exception.stack.toString());
            res.end();    
        }

    };


    if(!conf.frameworks){
        return;
    }

    const MODE_ERROR = "error";
    const MODE_SUCCESS = "success";

    var _string = "";
    var _statusCode = 200;

    if(!conf.frameworks){
        return resolve();
    }

    var routes = routings.get(req.url);

    if(routes.mode == MODE_ERROR){
        res.statusCode = 404;
    }

    try{
        setController.bind(this)(routes, req, res);
    }catch(exception){
        goError(exception, req, res);
    }
    
};