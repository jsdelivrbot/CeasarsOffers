
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