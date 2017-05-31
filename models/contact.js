var pg = require('pg');
var dateUtils = require('../utils/dateUtils.js');
var ftpUtils = require('../utils/ftpUtils.js');
var caesarsLogger = require('../utils/caesarsLogger.js');
var dbUtils = require('../utils/dbUtils.js');

exports.getRecordsBeforeDateAndPostToFTPServer = function(dateParam,fileName,callback){
    var startTime = new Date().getTime();
    var results = [];
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        const query = client.query('SELECT name FROM salesforce.contact where systemmodstamp < \'' + dateUtils.convertToPostgresDateTime(dateParam)+'\';');

        query.on('row', (row) => {results.push(row);});

        query.on('end', () => {
            done();
            caesarsLogger.log('info','getRecordsBeforeDateAndPostToFTPServer','{"timeDiff":"'+new Date().getTime() - startTime+'"}');
            callback(results,fileName);
        });
    });
}

exports.getContacts = function(request, response, next){
    caesarsLogger.generateKey();
    var startTime = new Date().getTime();
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT firstname, lastname FROM salesforce.contact ',
            function(err, result){
                done();
                caesarsLogger.log('info','exports.getContacts','{"timeDiff":"' + new Date().getTime() - startTime + '"}');
                response.json(err ? err : result.rows);
            }
        );
    });
}

exports.postContact = function(request, response, next){
     caesarsLogger.generateKey();
     console.log('posting contacts into database');
     var statement = dbUtils.buildContactInsertStatement(JSON.parse(JSON.stringify(request.body)));
     saveIntoDatabase(statement,'exports.postContact');
}

exports.uploadContacts = function(fileContent){
    console.log('uploading contacts into database');
    fileContent = 'firstname,lastname\nJohn,Rambo\nJohn,Rambo\nJohn,Rambo\nJohn,Rambo\nJohn,Rambo\nJohn,Rambo\nJohn,Rambo\nJohn,Rambo\nJohn,Rambo\nJohn,Rambo\nJohn,Rambo\nJohn,Rambo\nJohn,Rambo\nJohn,Rambo\nJohn,Rambo\n';
    var statement = dbUtils.buildContactInsertStatementFromFileContent(fileContent);
    //saveIntoDatabase(statement,'exports.uploadContacts');
}

var saveIntoDatabase = function(statement,message){
    var startTime = new Date().getTime();
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query(statement,
            function(err, result) {
                var timeDiff = new Date().getTime() - startTime;
                if (err) {
                    caesarsLogger.log('error',message,'{"timeDiff":"' + new Date().getTime() - startTime + '"}');
                    response.json({ message: 'Error ' + JSON.stringify(err)});
                } else {
                    caesarsLogger.log('info',message,'{"timeDiff":"' + new Date().getTime() - startTime + '"}');
                    response.json({ message: 'Done ' + JSON.stringify(result)});
                }
                client.end();
            });
        }
    );
}