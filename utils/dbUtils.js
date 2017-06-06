var fs = require("fs");
var readLine = require("readline");
var pg = require('pg');
var caesarsLogger = require('./caesarsLogger.js');
var dateUtils = require('./dateUtils.js');

/**
* @description procedure reads file line by line and creates database insert statement
* @param fileName : name of the file
* @param callback : function that saves results into postgres
* @param insert : statement header
*/
exports.buildInsertStatementFromFile = function(fileName,callback,statement){

    var lineReader = readLine.createInterface({
      input: fs.createReadStream(fileName)
    });

    lineReader.on('line', function (line) {
        var columns = line.split(',');
        statement += '(';
        for(var i = 0 ; i < columns.length ; i++){
            statement += '\''+line[i]+'\'' + ',';
        }
        statement = statement.substring(0,statement.length - 1);
        statement += '),';
    });

    lineReader.on('close', function(){
        statement = statement.substring(0,statement.length - 1);
        callback(statement,'buildInsertStatementFromFile',null); // saveIntoDatabase
    });
}

/**
* @description procedure reads file line by line and creates database insert statement
* @param fileName : name of the file
* @param callback : function that saves results into postgres
*/
exports.buildContactInsertStatementFromFile = function(fileName,callback){
    var statement = 'INSERT INTO salesforce.contact (firstname, lastname, age__c, gender__c, tier_level__c, tier_score__c, winnet_id__c) VALUES ';
    exports.buildInsertStatementFromFile(fileName,callback,statement);
}

/**
* @description method used for running db query
* @param statement : insert statement to be executed
* @param message : message to be used for logging
* @param response : response object
*/
exports.runQuery = function(statement,message,response){
    var logKey = this.lKey;
    var startTime = new Date().getTime();
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query(statement,
            function(err, result) {
                var timeDiff = new Date().getTime() - startTime;
                if (err) {
                    caesarsLogger.log('error',message + err,'{"timeDiff":"' + dateUtils.calculateTimeDiffInMilliseconds(startTime) + '"}',logKey);
                    if(response != null) {
                        response.json({ message: 'Error ' + JSON.stringify(err)});
                    }
                } else {
                    caesarsLogger.log('info',message,'{"timeDiff":"' + dateUtils.calculateTimeDiffInMilliseconds(startTime) + '"}',logKey);
                    if(response != null) {
                        response.json({ message: 'Done ' + JSON.stringify(result)});
                    }
                }
                client.end();
            });
        }
    );
}

/**
* @param contacts list of contact objects
*/
exports.buildContactInsertStatement = function(contacts){
    var statement = 'INSERT INTO salesforce.contact (firstname, lastname, age__c, gender__c, tier_level__c, tier_score__c,established_date__c, winnet_id__c) VALUES';
    for(var i = 0; i<contacts.length; i++){
        statement += '(\''+contacts[i].firstname+'\'' + ',' +
                      '\''+contacts[i].lastname+'\''  + ',' +
                      '\''+contacts[i].age+'\''  + ',' +
                      '\''+contacts[i].gender+'\''  + ',' +
                      '\''+contacts[i].tierlevel+'\''  + ',' +
                      '\''+contacts[i].tierscore+'\''  + ',' +
                      '\''+contacts[i].edate+'\''  + ',' +
                      '\''+contacts[i].winnetid+'\''
                      +'),';
    }
    statement = statement.substring(0,statement.length - 1);
    return statement;
}

exports.buildOfferInsertStatement = function(offers){
    var statement = 'INSERT INTO offers (name) VALUES ';
    for(var i = 0; i<offers.length; i++){
        statement += '(\''+offers[i].name+'\'),';
    }
    statement = statement.substring(0,statement.length - 1);
    return statement;
}