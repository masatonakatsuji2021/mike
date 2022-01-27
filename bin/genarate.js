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

const tool = require("hachiware_tool");
const fs = require("fs");

module.exports = function(routings, conf, context, req, res){

    const echo = function(string){
        _string += string;
        return this;
    };
    const statusCode = function(statusCode){
        if(statusCode){
            _statusCode = statusCode;
            return this;
        }
        else{
            return _statusCode;
        }
    }

    const layout = function(layoutName){
        if(layoutName == undefined){
            return _layout;
        }
        else{
            _layout = layoutName;
            return this;            
        }
    };

    const render = function(renderName){
        if(renderName == undefined){
            return _render;
        }
        else{
            _render = renderName;
            return this;            
        }
    };

    const autoRender = function(status){
        if(status == undefined){
            return _autoRender;
        }
        else{
            _autoRender = status;
            return this;
        }
    };

    const _throw = function(message){
        var exception = new Error(message);
        goError(exception, req, res);
    };

    const dump = function(data){
        var dataStr = JSON.stringify(data, null, "   ");
        this.$echo("<pre>" + dataStr + ",/pre>");
    };

    const setController = function(routes, req, res){

        if(routes.mode == "error"){
            if(_statusCode == 200){
                _statusCode = 500;
            }
        }

        var controllerName = tool.ucFirst(routes.controller) + "Controller";

        var controllerPath = conf.rootPath + "/" + conf.frameworks.paths.controller + "/" + controllerName + ".js";

        if(!fs.existsSync(controllerPath)){
            throw Error("\"" + controllerName + "\" is not found.");
        }

        if(!fs.statSync(controllerPath).isFile()){
            throw Error("\"" + controllerName + "\" is not File.(ファイルではない)");
        }

        controllerPath = controllerPath.split("/").join("\\");

        if(!conf.frameworks.requestCache){
            delete require.cache[controllerPath];
        }

        try{

            var cont = require(controllerPath);

            cont = new cont();

        }catch(error){
            throw Error(error.stack.toString());
        }

        cont.$req = req;
        cont.$res = res;
        cont.$routes = routes;
        cont.$conf = conf;
        cont.$echo = echo;
        cont.$statusCode = statusCode;
        cont.$layout = layout;
        cont.$render = render;
        cont.$autoRender = autoRender;
        cont.$throw = _throw;
        cont.$dump = dump;

        cont.$render(tool.ucFirst(routes.controller) + "/" + routes.action);

        context.then(function(resolve){

            try{

                if(cont.sync_filterBefore){
                    if(routes.mode == "error"){
                        cont.sync_filterBefore(resolve,routes.exception);
                    }
                    else{
                        cont.sync_filterBefore(resolve);
                    }
                    return;
                }
                else if(cont.filterBefore){
                    if(routes.mode == "error"){
                        cont.filterBefore(routes.exception);
                    }
                    else{
                        cont.filterBefore();
                    }
                }
    
                resolve();
    
            }catch(error){
                goError(error, req, res);
            }

        }).then(function(resolve){

            if(_writed){
                return;
            }

            try{

                var syncName = "sync_" + routes.action;

                if(cont[syncName]){
                    if(routes.mode == "error"){
                        cont[syncName](resolve, routes.exception);
                    }
                    else{
                        cont[syncName](resolve);
                    }
                }
                else if(cont[routes.action]){
    
                    if(routes.mode == "error"){
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

            }catch(error){
                goError(error, req, res);
            }
   
        }).then(function(resolve){

            if(_writed){
                return;
            }

            try{
                if(cont.sync_filterAfter){
                    if(routes.mode == "error"){
                        cont.sync_filterAfter(resolve, routes.exception);
                    }
                    else{
                        cont.sync_filterAfter(resolve);
                    }
                    return;
                }
                else if(cont.filterAfter){
                    if(routes.mode == "error"){
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

            if(_writed){
                return;
            }

            try{

                if(!cont.$autoRender()){
                    return resolve();
                }

                cont.__render(resolve);

            }catch(error){
                goError(error, req, res);
            }

        }).then(function(){

            if(_writed){
                return;
            }

            _writed = true;

            res.statusCode = _statusCode;
            res.write(_string);
            res.end();

        }).start();
    };

    var errorLoopCount = 0;

    const goError = function(exception, req, res){

        errorLoopCount++;
 
        if(_writed){
            return;
        }

        if(errorLoopCount > 1){
            if(res.statusCode == 200){
                res.statusCode = 500;
            }
            res.write(exception.stack.toString());
            res.end();
            return;
        }

        var errorRoutes = routings.getError(req.url);

        errorRoutes.exception = exception;

        try{
            setController.bind(this)(errorRoutes, req, res);
            _writed = true;
        }catch(error2){

            if(res.statusCode == 200){
                res.statusCode = 500;
            }

            res.write(exception.stack.toString());
            res.end();    

            _writed = true;
        }

    };

    var _string = "";
    var _statusCode = 200;
    var _layout = null;
    var _render = null;
    var _autoRender = false;
    var _writed = false;

    var routes = routings.get(req.url);

    if(routes.mode == "error"){
        _statusCode = 404;
    }

    try{
        setController.bind(this)(routes, req, res);
    }catch(exception){
        goError(exception, req, res);
    }
    
};