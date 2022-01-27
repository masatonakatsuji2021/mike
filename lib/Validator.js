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

const Core = require("./Core.js");
const validator = require("hachiware_validator");

module.exports = class Validator extends Core{

    constructor(constructObject){
        super(constructObject);

        this._validator = new Validator();
    }

    setRules(rules){
        this.rules = function(){
            return rules;
        };
        return this;
    }

    verify(data, rules, option){
        if(!rules){
            if(this.rules){
                rules = this.rules();
            }
        }
        return this._validator.verify(data, rules, option);
    }

};