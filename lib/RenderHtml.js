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


const fs = require("fs");

/**
 * RenderHtml
 * 
 * Rendering method without template engine
 * 
 * @param {string} renderType Rendering type (view, layout, vpart)
 * @param {string} renderFullPath Rendering file path (full).
 * @returns {string} endered response data
 */
module.exports = function(renderType, renderFullPath){

    var renderHtml = fs.readFileSync(renderFullPath).toString();

    if(renderType == "layout"){
        if(renderHtml.indexOf("{{getView}}") > -1){
            var viewHtml = this.$getView(this.$render());
            renderHtml = renderHtml.replace("{{getView}}", viewHtml);
        }
    }

    return renderHtml;
};