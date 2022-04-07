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

const SoulGem = require("./SoulGem.js");
var _Validator;
try{
    _Validator = require("hachiware_validator");
}catch(error){}

module.exports = class Validator extends SoulGem{

    constructor(constructObject){
        super(constructObject);

        if(!_Validator){
            return this.$throw("Since the \"hachiware_validator\" module is not installed, it is not possible to perform data validation checks using the Validator class.");
        }

        this._validator = new _Validator();
    }

    /**
     * setRules
     * @param {*} rules 
     * @returns 
     */
    setRules(rules){
        this.rules = function(){
            return rules;
        };
        return this;
    }

    /**
     * verify
     * @param {*} data 
     * @param {*} rules 
     * @param {*} option 
     * @returns 
     */
    verify(data, rules, option){
        if(!rules){
            if(this.rules){
                rules = this.rules();
            }
        }
        return this._validator.verify(data, rules, option);
    }

};