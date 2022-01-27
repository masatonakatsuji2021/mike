const hte = require("hachiware_te");
const fs = require("fs");

module.exports = function(renderType, renderPath, ext){

    var vm = this;

    var outData = {};

    var colums = Object.keys(this._setData);
    for(var n = 0 ; n < colums.length ; n++){
        var field = colums[n];
        var value = this._setData[field];

        outData[field] = value;
    }

    outData.__getContents = function(renderType, renderPath){

            var renderFullPath = vm.$conf.rootPath + "/" + vm.$conf.frameworks.paths[renderType] + "/" + renderPath + "." + ext;

            if(!fs.existsSync(renderFullPath)){
                throw Error("\"" + renderPath + "\" is the rendering file (" + renderType + ") was not found.");
            }

            if(!fs.statSync(renderFullPath).isFile()){
                throw Error("\"" + renderPath + "\" is the rendering file (" + renderType + ") was not found.");
            }

            this.load(vm.$conf.frameworks.paths[renderType] + "/" + renderPath + "." + ext, {aaa:"bbbb"});

    };
    outData.$getView = function(viewPath){
            if(viewPath){
                this.__getContents("view",viewPath);
            }
            else{
                this.__getContents("view", this.$render());
            }
    };
    outData.$getVpart = function(vpartPath){
            this.__getContents("vpart",vpartPath);
    };

    outData.$render = this.$render;
    outData.$statusCode = this.$statusCode;

    var hte_ = new hte({
        path: this.$conf.rootPath,
        errorDebug: true,
        load: this.$conf.frameworks.paths[renderType] + "/" + renderPath + "." + ext,
        data: outData,
    });

    return hte_.out();
};