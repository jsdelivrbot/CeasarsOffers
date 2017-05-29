var pg = require('pg');
var dateUtils = require('../utils/dateUtils.js');
var fileUtility = require('../controllers/fileUtility.js');
var caesarsLogger = require('../utils/caesarsLogger.js');

exports.getRecordsBeforeDateAndPostToFTPServer = function(dateParam,fileName){
    var results = [];
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        const query = client.query('SELECT name FROM salesforce.contact where systemmodstamp < \'' + dateUtils.convertToPostgresDateTime(dateParam)+'\';');

        query.on('row', (row) => {results.push(row);});

        query.on('end', () => {
            done();
            fileUtility.saveFileOnFTPServer(results,fileName);
        });
    });
}

var buildInsertStatement = function(contacts){
    var statement = 'INSERT INTO salesforce.contact (firstname,lastname) VALUES ';
    for(var i = 0; i<contacts.length; i++){
        statement += '(\''+contacts[i].firstname+'\'' + ',' + '\''+contacts[i].lastname+'\'' +'),';
    }
    statement = statement.substring(0,statement.length - 1);
    return statement;
}

exports.postContact = function(request, response, next){

     var statement = buildInsertStatement(JSON.parse(JSON.stringify(request.body)));

     pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query(statement,
            function(err, result) {
                if (err) {
                    response.json({ message: 'Error during contact post ' + JSON.stringify(err)});
                } else {
                    response.json({ message: 'You have done successful contact post call ' + JSON.stringify(result)});
                }
                client.end();
            }
        );
     });
 }

 exports.getContacts = function(request, response, next){
    var startTime = new Date().getTime();
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT firstname, lastname FROM salesforce.contact ',
            function(err, result){
                done();
                var timeDiff = new Date().getTime() - startTime;
                caesarsLogger.log('info','exports.getContacts','{"timeDiff":"'+timeDiff+'"}');
                response.json(err ? err : result.rows);
            }
        );
    });
 }