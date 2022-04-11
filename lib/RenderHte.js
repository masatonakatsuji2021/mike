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

const hte = require("hachiware_te");
const fs = require("fs");

/**
 * RenderHte
 * 
 * Rendering method using template engine Hachiware_template (HTE).
 * 
 * @param {string} renderType Rendering type (view, layout, vpart)
 * @param {string} renderPath Rendering file path
 * @param {string} ext extension
 * @returns {string} Rendered response data
 */
module.exports = function(renderType, renderPath, ext){

    var vm = this;

    var outData = {};

    var colums = Object.keys(this._setData);
    for(var n = 0 ; n < colums.length ; n++){
        var field = colums[n];
        var value = this._setData[field];

        outData[field] = value;
    }

    /**
     * __getContents
     * 
     * Method for loading each rendering file (view, Layout, Vpart).
     * 
     * @param {string} renderType Rendering type (view, layout, vpart) 
     * @param {string} renderPath Rendering file path
     */
    outData.__getContents = function(renderType, renderPath){

            var renderFullPath = vm.$conf.rootPath + "/" + vm.$conf.mikes.paths[renderType] + "/" + renderPath + "." + ext;

            if(!fs.existsSync(renderFullPath)){
                throw Error("\"" + renderPath + "\" is the rendering file (" + renderType + ") was not found.");
            }

            if(!fs.statSync(renderFullPath).isFile()){
                throw Error("\"" + renderPath + "\" is the rendering file (" + renderType + ") was not found.");
            }

            this.load(vm.$conf.mikes.paths[renderType] + "/" + renderPath + "." + ext, {aaa:"bbbb"});

    };
    /**
     * getView
     * 
     * Method for loading View file.
     * 
     * @param {string} viewPath View file path
     */
    outData.$getView = function(viewPath){
        if(viewPath){
            this.__getContents("view",viewPath);
        }
        else{
            this.__getContents("view", this.$render());
        }
    };

    /**
     * getVpart
     * 
     * Methods for loading Vpart files
     * 
     * @param {string} vpartPath Vpart file path.
     */
    outData.$getVpart = function(vpartPath){
        this.__getContents("vpart",vpartPath);
    };

    outData.$render = this.$render;
    outData.$statusCode = this.$statusCode;

    var hte_ = new hte({
        path: this.$conf.rootPath,
//        errorDebug: true,
        errorOutput: this.$conf.mikes.viewErrorOutput,
        load: this.$conf.mikes.paths[renderType] + "/" + renderPath + "." + ext,
        data: outData,
    });

    return hte_.out();
};