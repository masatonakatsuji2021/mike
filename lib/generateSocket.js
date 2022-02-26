const fs = require("fs");
const tool = require("hachiware_tool");

module.exports = function(routings, conf, context, webSocketServer, socket){

    var routes = routings.getSocket(webSocketServer.url);

    if(!routes){
        socket.send("connection failed.");
        socket.close();
        return;
    }

    var socketName = tool.ucFirst(routes.socket) + "Socket";

    var socketPath = conf.rootPath + "/" + conf.mikes.paths.socket + "/" + socketName + ".js";

    if(!fs.existsSync(socketPath)){
        socket.send("connection failed");
        socket.close();
        throw Error("\"" + socketName + "\" is not found.");
    }

    if(!fs.statSync(socketPath).isFile()){
        socket.send("connection failed");
        socket.close();
        throw Error("\"" + socketName + "\" is not File.(Not a file.)");
    }

    if(!conf.mikes.requestCache){
        delete require.cache[require.resolve(socketPath)];
    }

    var soc = require(socketPath);

    try{
        soc = new soc();
    }catch(error){
        socket.send("connection failed");
        socket.close();
        throw Error("The \"" + socketName + "\" class cannot be loaded because the \"" + socketName + "\" class does not exist or the code is incorrect.");
    }
    
    soc.$webSocketServer = webSocketServer;
    soc.$socket = socket;
    soc.$routes = routes;
    soc.$conf = conf;
    soc._modules = context.modules;

    if(soc[routes.action]){
        soc[routes.action]();
    }

    const openAction = routes.action + "_open";
    const dataAction = routes.action + "_data";
    const errorAction = routes.action + "_error";
    const closeAction = routes.action + "_close";

    if(soc[openAction]){
        soc[openAction]();
    }

    socket.on("message", function(data){
        if(soc[dataAction]){
            soc[dataAction](data);
        }

    });

    socket.on("error", function(exception){

        if(soc[errorAction]){
            soc[errorAction](exception);
        }

    });

    socket.on("close", function(){

        if(soc[closeAction]){
            soc[closeAction]();
        }

    });

}