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

const tool = require("hachiware_tool");
const fs = require("fs");

module.exports = class SoulGem{

    /**
     * constructor
     * @param {*} constructOption 
     */
    constructor(constructOption){

        this._setData = {};

        if(!constructOption){
            return;
        }

        var colums = Object.keys(constructOption);
        for(var n = 0 ; n < colums.length ; n++){
            var field = colums[n];
            var value = constructOption[field];

            this[field] = value;
        }
    }

    /**
     * $envClass
     * @param {*} type 
     * @param {*} className 
     * @param {*} constructOption 
     * @returns 
     */
    $envClass(type, className, constructOption){

        if(!constructOption){
            constructOption = {};
        }

        var typeName = tool.ucFirst(type);

        if(className){

            var fullClassName = tool.ucFirst(className) + typeName;

            var defPath = this.$conf.mikes.paths.default + "/" + typeName;
            if(this.$conf.mikes.paths[type]){
                defPath = this.$conf.mikes.paths[type];
            }

            var classPath = this.$conf.rootPath + "/" + defPath + "/" + fullClassName + ".js";

            classPath = classPath.split("/").join("\\");

            if(!this.$conf.mikes.requireCache){
                delete require.cache[classPath];
            }

            try{

                var _class = require(classPath);

            }catch(error){
                throw Error("\"" + fullClassName + "\" class dose not exist or is corrupted.");
            }

        }
        else{
            var _class = require("./" + typeName + ".js");
        }

        constructOption.$req = this.$req;
        constructOption.$res = this.$res;
        constructOption.$routes = this.$routes;
        constructOption.$conf = this.$conf;
        constructOption.$echo = this.$echo;
        constructOption.$dump = this.$dump;
        constructOption.$statusCode = this.$statusCode;
        constructOption.$throw = this.$throw;

        try{
            _class = new _class(constructOption);
        }catch(error){
            throw Error(error);
        }

        return _class;
    }

    /**
     * $model
     * Loading Model class
     * @param {string} modelName Model name to be loaded
     * @param {constructOpion} constructOption Object data at model initialization
     * @returns {Model} Road model class
     */
    $model(modelName, constructOption){
        return this.$envClass("model", modelName, constructOption);
    }

    /**
     * $table
     * Loading Table class
     * @param {string} tableName Table name to be loaded
     * @param {constructOption} constructOption Object data at table initialization
     * @returns {Table} Road table class
     */
    $table(tableName, constructOption){
        return this.$envClass("table", tableName, constructOption);
    }

    /**
     * $validator
     * Loading Validator class
     * @param {string} validatorName Validator name to be loaded
     * @param {constructOption} constructOption Object data at validator initialization
     * @returns {Validator} Road validator class
     */
    $validator(validatorName, constructOption){
        return this.$envClass("validator", validatorName, constructOption);
    }

    /**
     * $ui
     * Loading Ui class
     * @param {string} uiName Ui name to be loaded
     * @param {constructOption} constructOption Object data at ui initialization
     * @returns {Ui} Road Ui class
     */
    $ui(uiName, constructOption){
        return this.$envClass("ui", uiName, constructOption);
    }

    /**
     * $shell
     * Get Shell class object
     * @param {string} shellName Shell class name
     * @param {object} constructOption Initial installation value
     * @returns 
     */
    $shell(shellName, constructOption){
        return this.$envClass("shell", shellName, constructOption);
    }

    /**
     * $module
     * Get the class methods available from the Server module.
     * @param {string} moduleName Module name
     * @returns {ServerModule} Server module class
     */
    $module(moduleName){

        var modules = this._modules[this.$conf._file];

        if(!modules[moduleName]){

            moduleName = "hachiware_server_module_" + moduleName;

            if(!modules[moduleName]){
                throw Error("module class not found.");
            }
        }

        if(!modules[moduleName].frameworkAdapter){
            throw Error("module class not found 2.");
        }

        return modules[moduleName].frameworkAdapter(this.$req, this.$res);
    }

    /**
     * $setData
     * Pass data to rendering (View, Layout, Vpart)
     * @param {string} name data name
     * @param {*} value data contents
     * @returns 
     */
    $setData(name, value){

        if(!value){
            value = "";
        }

        this._setData[name] = value;
        return this;
    }

    _renderingExists(renderType, renderPath){

        var engineType = this.$conf.mikes.templateEngine;

        var ext = "hte";
        if(engineType == "ejs"){
            ext = "ejs";
        }
        else if(engineType == "html"){
            ext = "html";
        }

        if(this.$conf.mikes.renderFileExt){
            ext = this.$conf.mikes.renderFileExt;
        }

        var renderFullPath = this.$conf.rootPath + "/" + this.$conf.mikes.paths[renderType] + "/" + renderPath + "." + ext;

        if(!fs.existsSync(renderFullPath)){
            return {
                exists: false,
            };
        }

        if(!fs.statSync(renderFullPath).isFile()){
            return {
                exists: false,
            };
        }

        return {
            exists: true,
            path: renderFullPath,
            ext: ext,
        };
    }

    _echoRendering(renderType, renderPath){

        var res = this._renderingExists(renderType, renderPath);

        if(!res.exists){
            throw Error("\"" + renderPath + "\" is the rendering file (" + renderType + ") was not found.");
        }

        var engineType = this.$conf.mikes.templateEngine;

        if(engineType == "hte"){
            var hte = require("./RenderHte.js");
            var renderHtml = hte.bind(this)(renderType, renderPath, res.ext);
        }
        if(engineType == "ejs"){
            var ejs = require("./RenderEjs.js");
            var renderHtml = ejs.bind(this)(renderType, renderPath, res.ext);
        }
        if(engineType == "html"){
            var html = require("./RenderHtml.js");
            var renderHtml = html.bind(this)(renderType, res.path);
        }

        return renderHtml;
    }

    /**
     * $getView
     * @param {*} viewPath 
     * @param {*} autoEcho 
     * @returns 
     */
    $getView(viewPath, autoEcho){

        var html = this._echoRendering("view",viewPath);

        if(autoEcho){
            return this.$echo(html);
        }

        return html;
    }

    /**
     * $existsView
     * @param {*} viewPath 
     * @returns 
     */
    $existsView(viewPath){
        var res = this._renderingExists("view", viewPath);
        return res.exists;
    }

    /**
     * $getLayout
     * @param {*} layoutPath 
     * @param {*} autoEcho 
     * @returns 
     */
    $getLayout(layoutPath, autoEcho){

        var html = this._echoRendering("layout",layoutPath);

        if(autoEcho){
            return this.$echo(html);
        }

        return html;
    }

    /**
     * $existLayout
     * @param {*} layoutPath 
     * @returns 
     */
    $existLayout(layoutPath){
        var res = this._renderingExists("layout", layoutPath);
        return res.exists;
    }    

    /**
     * $getVpart
     * @param {*} vpartName 
     * @param {*} autoEcho 
     * @returns 
     */
    $getVpart(vpartName, autoEcho){

        var html = this._echoRendering("vpart",vpartName);

        if(autoEcho){
            return this.$echo(html);
        }

        return html;
    }
    
    /**
     * $existsVpart
     * @param {*} vpartPath 
     * @returns 
     */
     $existsVpart(vpartPath){
        var res = this._renderingExists("vpart", vpartPath);
        return res.exists;
    }

    /**
     * $body
     * @returns 
     */
    $body(){
        if(this.$req.body){
            return this.$req.body;
        }
    }

    /**
     * $query
     * @returns 
     */
    $query(){
        if(this.$req.query){
            return this.$req.query;
        }
    }

    /**
     * $setHeader
     * @param {*} field 
     * @param {*} value 
     * @returns 
     */
    $setHeader(field, value){
        this.$res.setHeader(field, value);
        return this;
    }

    /**
     * $redirect
     * @param {*} url 
     * @returns 
     */
    $redirect(url){

        this
            .$statusCode(301)
            .$setHeader("location", url)
        ;
        
        return this;
    }

};