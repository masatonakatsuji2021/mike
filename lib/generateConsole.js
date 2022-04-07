const fs = require("fs");
const tool = require("hachiware_tool");

module.exports = function(routings, conf, context, command, exitResolve){

    var routes = routings.getConsole(command);

    if(!routes){
        console.log("[ERROR] Console Command Not Exists.");
        return exitResolve();
    }

    console.log(routes);

    console.log("command...." + command);

    exitResolve();
};