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

module.exports = class Controller extends SoulGem{

    /**
     * __render
     * 
     * Start rendering if autoRender is true.
     * 
     * @param {function} resolve Solution function 
     * @returns 
     */
    __render(resolve){
        
        if(this.$layout()){
            this.$getLayout(this.$layout(), true);
        }
        else{
            this.$getView(this.$render(), true);
        }

        return resolve();
    }

};