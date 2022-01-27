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

        var typeName = tool.ucFirst(type);

        if(className){

            var fullClassName = tool.ucFirst(className) + typeName;

            var defPath = this.$conf.frameworks.paths.default + "/" + typeName;
            if(this.$conf.frameworks.paths[type]){
                defPath = this.$conf.frameworks.paths[type];
            }

            var classPath = this.$conf.rootPath + "/" + defPath + "/" + fullClassName + ".js";

            classPath = classPath.split("/").join("\\");

            if(!this.$conf.frameworks.requireCache){
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

        _class = new _class(constructOption);

        _class.$req = this.$req;
        _class.$res = this.$res;
        _class.$routes = this.$routes;
        _class.$conf = this.$conf;
        _class.$echo = this.$echo;
        _class.$dump = this.$dump;
        _class.$statusCode = this.$statusCode;
        _class.$throw = this.$throw;

        return _class;
    }

    $model(modelName, constructOption){
        return this.$envClass("model", modelName, constructOption);
    }

    $table(tableName, constructOption){
        return this.$envClass("table", tableName, constructOption);
    }

    $validator(validatorName, constructOption){
        return this.$envClass("validator", validatorName, constructOption);
    }

    $pack(packName, constructOption){
        return this.$envClass("pack", packName, constructOption);
    }

    $ui(uiName, constructOption){
        return this.$envClass("ui", uiName, constructOption);
    }

    $shell(shellName, constructOption){
        return this.$envClass("shell", shellName, constructOption);
    }

    $setData(name, value){

        if(!value){
            value = "";
        }

        this._setData[name] = value;
        return this;
    }

    _echoRendering(renderType, renderPath){

        var engineType = this.$conf.frameworks.templateEngine;

        var ext = "hte";
        if(engineType == "ejs"){
            ext = "ejs";
        }
        else if(engineType == "html"){
            ext = "html";
        }

        if(this.$conf.frameworks.renderFileExt){
            ext = this.$conf.frameworks.renderFileExt;
        }

        var renderFullPath = this.$conf.rootPath + "/" + this.$conf.frameworks.paths[renderType] + "/" + renderPath + "." + ext;

        if(!fs.existsSync(renderFullPath)){
            throw Error("\"" + renderPath + "\" is the rendering file (" + renderType + ") was not found.");
        }

        if(!fs.statSync(renderFullPath).isFile()){
            throw Error("\"" + renderPath + "\" is the rendering file (" + renderType + ") was not found.");
        }

        if(engineType == "hte"){
            var hte = require("./RenderHte.js");
            var renderHtml = hte.bind(this)(renderType, renderPath, ext);
        }
        if(engineType == "ejs"){
            var ejs = require("./RenderEjs.js");
            var renderHtml = ejs.bind(this)(renderType, renderPath, ext);
        }
        if(engineType == "html"){
            var html = require("./RenderHtml.js");
            var renderHtml = html.bind(this)(renderType, renderFullPath);
        }

        return renderHtml;
    }


    $getView(viewPath, autoEcho){

        var html = this._echoRendering("view",viewPath);

        if(autoEcho){
            return this.$echo(html);
        }

        return html;
    }

    $getLayout(layoutPath, autoEcho){

        var html = this._echoRendering("layout",layoutPath);

        if(autoEcho){
            return this.$echo(html);
        }

        return html;
    }

    $getVpart(vpartName, autoEcho){

        var html = this._echoRendering("vpart",vpartName);

        if(autoEcho){
            return this.$echo(html);
        }

        return html;
    }

    $body(){
        if(this.$req.body){
            return this.$req.body;
        }
    }

    $query(){
        if(this.$req.query){
            return this.$req.query;
        }
    }
};