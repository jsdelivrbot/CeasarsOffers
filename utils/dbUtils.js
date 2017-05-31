/**
* @param content string representing file content;
*/
exports.buildContactInsertStatementFromFileContent = function(content){
    var statement = 'INSERT INTO salesforce.contact (firstname, lastname) VALUES ';

    var lines = content.split('\n');

    for(var i = 1; i < lines.length; i++){
        var line = lines[i].split(',');
        statement += '(';
        for(var j = 0; j < line.length; j++){
            statement += '\''+line[j]+'\'' + ',';
        }
        statement = statement.substring(0,statement.length - 1);
        statement += '),'
    }
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