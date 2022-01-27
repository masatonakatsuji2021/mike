const fs = require("fs");

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