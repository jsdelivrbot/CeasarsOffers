var fs = require("fs");
var readLine = require("readline");

/**
* @description procedure reads file line by line and creates database insert statement
* @param fileName name of the file
*/
exports.buildContactInsertStatementFromFile = function(fileName){
    var statement = 'INSERT INTO salesforce.contact (firstname, lastname) VALUES ';

    var lineReader = readLine.createInterface({
      input: fs.createReadStream(fileName)
    });

    lineReader.on('line', function (line) {
        var columns = line.split(',');
        statement += '(';
        for(var i = 0 ; i < columns.length ; i++){
            statement += '\''+line[j]+'\'' + ',';
        }
        statement = statement.substring(0,statement.length - 1);
        statement += '),'
    });

    statement = statement.substring(0,statement.length - 1);
    console.log('statement ' + statement);
    return statement;
}

/**
* @param contacts list of contact objects
*/
exports.buildContactInsertStatement = function(contacts){
    var statement = 'INSERT INTO salesforce.contact (firstname,lastname) VALUES ';
    for(var i = 0; i<contacts.length; i++){
        statement += '(\''+contacts[i].firstname+'\'' + ',' + '\''+contacts[i].lastname+'\'' +'),';
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