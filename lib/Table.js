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

var ORM;
try{
    ORM = require("hachiware_orm");
}catch(error){}

 module.exports = class Table extends SoulGem{

    /**
     * _setOrm
     * @returns 
     */
    _setOrm(){

        if(this._orm){
            return;
        }

        if(!ORM){
            return this.$throw("Database connection cannot be made by Table class because \"hachiware_orm\" module is not installed.");
        }

        if(!this.$conf.mikes.dbConnection){
            return this.$throw("The database connection destination setting information is not specified.\n           Check if there is a database connection destination setting in the configuration file.");
        }

        var dbConnections = this.$conf.mikes.dbConnection;

        if(!this.connect){
            this.connect = "default";
        }

        if(typeof this.connect == "string"){
            
            if(!dbConnections[this.connect]){
                return this.$throw("The \"" + this.connect + "\" database connection destination setting information is not specified.\n           Check if there is a database connection destination setting in the configuration file.");            
            }

            this._orm = new ORM(dbConnections[this.connect]);
        }
        else if(typeof this.connect == "object"){
            this._orm = new ORM(this.connect);
        }
        else{
            return this.$throw("Could not read because the database connection destination information is in an invalid type format.");
        }
    }

    /**
     * setting
     * @param {*} newConnection 
     * @returns 
     */
    setting(newConnection){
        this._setOrm();
        this._orm.setting(newConnection);
        return this;
    }

    /**
     * connection
     * @param {*} callback 
     * @returns 
     */
    connection(callback){
        this._setOrm();
        this._orm.connection(callback);
        return this;
    }

    /**
     * query
     * @param {*} sql 
     * @param {*} callback 
     * @param {*} beforeCallback 
     * @returns 
     */
    query(sql, callback, beforeCallback){
        this._setOrm();
        return this._orm.query(sql, callback, beforeCallback);
    }
    
    /**
     * getLog
     * @returns 
     */
    getLog(){
        this._setOrm();
        return this._orm.getLog();
    }

    /**
     * getType
     * @returns 
     */
    getType(){
        this._setOrm();
        return this._orm.getType();
    }

    /**
     * getDatabase
     * @returns 
     */
    getDatabase(){
        this._setOrm();
        return this._orm.getDatabase();
    }

    /**
     * setDatabase
     * @param {*} dbName 
     * @returns 
     */
    setDatabase(dbName){
        this._setOrm();
        this._orm.setDatabase(dbName);
        return this;
    }

    /**
     * getTable
     * @returns 
     */
    getTable(){
        this._setOrm();
        return this._orm.getTable();
    }

    /**
     * setTable
     * @param {*} tableName 
     * @returns 
     */
    setTable(tableName){
        this._setOrm();
        this._orm.setTable(tableName);
        return this;
    }

    /**
     * getSurrogateKey
     * @returns 
     */
    getSurrogateKey(){
        this._setOrm();
        return this._orm.getSurrogateKey();
    }

    /**
     * setSurrogateKey
     * @param {*} keyName 
     * @returns 
     */
    setSurrogateKey(keyName){
        this._setOrm();
        this._orm.setSurrogateKey(keyName);
        return this;
    }

    /**
     * getUpdateOnGetData
     * @returns 
     */
    getUpdateOnGetData(){
        this._setOrm();
        return this._orm.getUpdateOnGetData();
    }

    /**
     * setUpdateOnGetData
     * @param {*} status 
     * @returns 
     */
    setUpdateOnGetData(status){
        this._setOrm();
        this._orm.setUpdateOnGetData(status);
        return this;
    }

    /**
     * getInsertOnGetData
     * @returns 
     */
    getInsertOnGetData(){
        this._setOrm();
        return this._orm.getInsertOnGetData();
    }

    /**
     * setInsertOnGetData
     * @param {*} status 
     * @returns 
     */
    setInsertOnGetData(status){
        this._setOrm();
        this._orm.setInsertOnGetData(status);
        return this;
    }
    
    /**
     * getCreateTimeStamp
     * @returns 
     */
    getCreateTimeStamp(){
        this._setOrm();
        return this._orm.getCreateTimeStamp();
    }

    /**
     * setCreateTimeStamp
     * @param {*} stampeName 
     * @returns 
     */
    setCreateTimeStamp(stampeName){
        this._setOrm();
        this._orm.setCreateTimeStamp(stampeName);
        return this;
    }

    /**
     * getUpdateTimeStamp
     * @returns 
     */
    getUpdateTimeStamp(){
        this._setOrm();
        return this._orm.getUpdateTimeStamp();
    }

    /**
     * setUpdateTimeStamp
     * @param {*} stampeName 
     * @returns 
     */
    setUpdateTimeStamp(stampeName){
        this._setOrm();
        this._orm.setUpdateTimeStamp(stampeName);
        return this;
    }

    /**
     * getLogicalDeleteKey
     * @returns 
     */
    getLogicalDeleteKey(){
        this._setOrm();
        return this._orm.getLogicalDeleteKey();
    }

    /**
     * setLogicalDeleteKey
     * @param {*} keyName 
     * @returns 
     */
    setLogicalDeleteKey(keyName){
        this._setOrm();
        this._orm.setLogicalDeleteKey(keyName);
        return this;
    }

    /**
     * selectCallback
     * @param {*} callback 
     * @returns 
     */
    selectCallback(callback){
        this._setOrm();
        this._orm.selectCallback(callback);
        return this;
    }

    /**
     * insertCallback
     * @param {*} callback 
     * @returns 
     */
    insertCallback(callback){
        this._setOrm();
        this._orm.insertCallback(callback);
        return this;
    }

    /**
     * updateCallback
     * @param {*} callback 
     * @returns 
     */
    updateCallback(callback){
        this._setOrm();
        this._orm.updateCallback(callback);
        return this;
    }

    /**
     * sanitize
     * @param {*} str 
     * @returns 
     */
    sanitize(str){
        this._setOrm();
        return this._orm.sanitize(str);
    }

    /**
     * getBindSql
     * @param {*} sql 
     * @param {*} values 
     * @returns 
     */
    getBindSql(sql, values){
        this._setOrm();
        return this._orm.getBindSql(sql, values);
    }

    /**
     * bind
     * @param {*} sql 
     * @param {*} values 
     * @param {*} callback 
     * @param {*} beforeCallback 
     * @returns 
     */
    bind(sql, values, callback, beforeCallback){
        this._setOrm();
        return this._orm.bind(sql, values, callback, beforeCallback);
    }

    /**
     * select
     * @param {*} option 
     * @returns 
     */
    select(option){
        this._setOrm();
        return this._orm.select(option);
    }

    /**
     * insert
     * @param {*} option 
     * @returns 
     */
    insert(option){
        this._setOrm();
        return this._orm.insert(option);
    }

    /**
     * update
     * @param {*} option 
     */
    update(option){
        this._setOrm();
        return this._orm.update(option);
    }

    /**
     * delete
     * @param {*} option 
     * @returns 
     */
    delete(option){
        this._setOrm();
        return this._orm.delete(option);
    }

    /**
     * truncate
     * @param {*} option 
     * @returns 
     */
    truncate(option){
        this._setOrm();
        return this._orm.truncate(option);
    }

    /**
     * createDatabase
     * @param {*} option 
     * @returns 
     */
    createDatabase(option){
        this._setOrm();
        return this._orm.createDatabase(option);
    }

    /**
     * createTable
     * @param {*} option 
     * @returns 
     */
    createTable(option){
        this._setOrm();
        return this._orm.createTable(option);
    }

    /**
     * createView
     * @param {*} option 
     * @returns 
     */
    createView(option){
        this._setOrm();
        return this._orm.createView(option);
    }

    /**
     * dropDatabase
     * @param {*} option 
     * @returns 
     */
    dropDatabase(option){
        this._setOrm();
        return this._orm.dropDatabase(option);
    }

    /**
     * dropTable
     * @param {*} option 
     * @returns 
     */
    dropTable(option){
        this._setOrm();
        return this._orm.dropTable(option);
    }

    /**
     * dropView
     * @param {*} option 
     * @returns 
     */
    dropView(option){
        this._setOrm();
        return this._orm.dropView(option);
    }

    /**
     * alterTable
     * @param {*} option 
     * @returns 
     */
    alterTable(option){
        this._setOrm();
        return this._orm.alterTable(option);
    }

    /**
     * then
     * @param {*} callback 
     * @returns 
     */
    then(callback){
        this._setOrm();
        return this._orm.then(callback);
    }

    /**
     * for
     * @param {*} start 
     * @param {*} end 
     * @param {*} callback 
     * @param {*} incrementValue 
     * @returns 
     */
    for(start, end, callback, incrementValue){
        this._setOrm();
        return this._orm.for(start, end, callback, incrementValue);
    }

    /**
     * transaction
     * @param {*} callback 
     * @param {*} commitCallback 
     * @param {*} rollbackCallback 
     * @returns 
     */
    transaction(callback, commitCallback, rollbackCallback){
        this._setOrm();
        return this._orm.transaction(callback, commitCallback, rollbackCallback);
    }

    /**
     * trs (= transaction)
     * @param {*} callback 
     * @param {*} commitCallback 
     * @param {*} rollbackCallback 
     * @returns 
     */
    trs(callback, commitCallback, rollbackCallback){
        return this.transaction(callback, commitCallback, rollbackCallback);
    }

    /**
     * begin
     * @param {*} callback 
     * @returns 
     */
    begin(callback){
        this._setOrm();
        return this._orm.begin(callback);
    }

    /**
     * commit
     * @param {*} callback 
     * @returns 
     */
    commit(callback){
        this._setOrm();
        return this._orm.commit(callback);
    }

    /**
     * rollback
     * @param {*} callback 
     * @param {*} error 
     * @returns 
     */
    rollback(callback, error){
        this._setOrm();
        return this._orm.rollback(callback, error);
    }

};