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

// Web Access Generator

const tool = require("hachiware_tool");
const sync = require("hachiware_sync");
const fs = require("fs");

module.exports = function(routings, conf, context, req, res){

    /**
     * echo
     * Output the specified character string as a response.
     * @param {string} string Output string
     * @returns Returns this.
     */
    const echo = function(string){
        _string += string;
        return this;
    };

    /**
     * statusCode
     * Get / Set response code.
     * 
     * If the argument statusCode is not specified, 
     * the current response code value is acquired and returned as the return value.
     * 
     * If the argument statusCode is specified, 
     * it will be changed to the specified response code.
     * 
     * @param {number} statusCode Response code value to change.
     * @returns Current response code or Returns this.
     * 
     */
    const statusCode = function(statusCode){
        if(statusCode){
            _statusCode = statusCode;
            return this;
        }
        else{
            return _statusCode;
        }
    }

    /**
     * layout
     * Get / Set Layout file name.
     * 
     * If the argument layoutName is not specified, 
     * Gets the current layout file name and returns it as a return value.
     * 
     * If the argument layoutName is specified, 
     * Sets or changes to the specified layout file name.
     * 
     * @param {string} layoutName Layout File Name
     * @returns Current Layout file name or Returns this.
     */
    const layout = function(layoutName){
        if(layoutName == undefined){
            return _layout;
        }
        else{
            _layout = layoutName;
            return this;            
        }
    };

    /**
     * render
     * 
     * Get / Set Render file name.
     * 
     * If the argument renderName is not specified, 
     * Gets the current Render file name.and returns it as a return value.
     * 
     * If the argument renderName is specified, 
     * Sets or changes to the specified Render file name.
     * 
     * @param {string} renderName Render File Name
     * @returns Current Render file name or Returns this.
     */
    const render = function(renderName){
        if(renderName == undefined){
            return _render;
        }
        else{
            _render = renderName;
            return this;            
        }
    };

    /**
     * autoRender
     * Get / Set Render autoRender status.
     * 
     * If the argument status is not specified, 
     * Gets the current autoRender status. and returns it as a return value.
     * 
     * If the argument status is specified, 
     * Sets or changes to the specified autoRender status.
     * 
     * @param {boolean} status autoRender status
     * @returns Current autoRender status or Returns this.
     */
    const autoRender = function(status){
        if(status == undefined){
            return _autoRender;
        }
        else{
            _autoRender = status;
            return this;
        }
    };

    /**
     * _throw ($throw)
     * 
     * Change to error screen when an error is issued
     * 
     * @param {string} message 
     * @returns {void}
     */
    const _throw = function(message){
        var exception = new Error(message);
        goError(exception, req, res);
    };

    /**
     * dump
     * 
     * View data details.  
     * Output the result as a response.
     * 
     * @param {*} data 
     * @returns {void}
     */
    const dump = function(data){
        var dataStr = JSON.stringify(data, null, "   ");
        this.$echo("<pre>" + dataStr + "</pre>");
    };

    /**
     * setController
     * @param {*} routes 
     * @param {*} req 
     * @param {*} res 
     */
    const setController = function(routes, req, res){

        if(routes.mode == "error"){
            if(_statusCode == 200){
                _statusCode = 500;
            }
        }

        var controllerName = tool.ucFirst(routes.controller) + "Controller";

        var controllerPath = conf.rootPath + "/" + conf.mikes.paths.controller + "/" + controllerName + ".js";

        if(!fs.existsSync(controllerPath)){
            throw Error("\"" + controllerName + "\" is not found.");
        }

        if(!fs.statSync(controllerPath).isFile()){
            throw Error("\"" + controllerName + "\" is not File.(Not a file.)");
        }

        if(!conf.mikes.requestCache){
            delete require.cache[require.resolve(controllerPath)];
        }

        var cont = require(controllerPath);

        try{
            cont = new cont();
        }catch(error){
            throw Error("The \"" + controllerName + "\" class cannot be loaded because the \"" + controllerName + "\" class does not exist or the code is incorrect.");
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
        cont._modules = context.modules;
        cont.$dump = dump;

        cont.$render(tool.ucFirst(routes.controller) + "/" + routes.action);

        sync.then(function(resolve){

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

            context.loadFookModule(conf, "access",[
                req, 
                res,
            ]);

        }).start();
    };

    var errorLoopCount = 0;

    /**
     * goError
     * 
     * Display an error screen.
     * 
     * @param {*} exception Error Exception
     * @param {*} req Request Object
     * @param {*} res Rresponse Object
     * @returns {void}
     */
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

            context.loadFookModule(conf, "error",[
                exception,
                req, 
                res,
            ]);

            context.loadFookModule(conf, "access",[
                req, 
                res,
            ]);

            return;
        }

        var errorRoutes = routings.getError(req.url);

        errorRoutes.exception = exception;

        try{
            setController.bind(this)(errorRoutes, req, res);
            context.loadFookModule(conf, "error",[
                exception,
                req, 
                res,
            ]);
            _writed = true;
        }catch(error2){

            if(res.statusCode == 200){
                res.statusCode = 500;
            }

            res.write(exception.stack.toString());
            res.end();    

            context.loadFookModule(conf, "access",[
                req, 
                res,
            ]);

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