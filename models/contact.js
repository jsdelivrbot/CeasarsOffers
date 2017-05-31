var pg = require('pg');
var dateUtils = require('../utils/dateUtils.js');
var ftpUtils = require('../utils/ftpUtils.js');
var caesarsLogger = require('../utils/caesarsLogger.js');
var dbUtils = require('../utils/dbUtils.js');

exports.getRecordsBeforeDateAndPostToFTPServer = function(dateParam,fileName,callback){
    var startTime = new Date().getTime();
    var results = [];
    console.log('dateParam' + dateParam);
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
         console.log('dateParam before query' + dateParam);
        const query = client.query('SELECT name FROM salesforce.contact where systemmodstamp < \'' + dateUtils.convertToPostgresDateTime(dateParam)+'\';');

        query.on('row', (row) => {results.push(row);});

        query.on('end', () => {
            done();
            var timeDiff = new Date().getTime() - startTime;
            caesarsLogger.log('info','getRecordsBeforeDateAndPostToFTPServer','{"timeDiff":"' + timeDiff + '"}',this.logkey);
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
                var timeDiff = new Date().getTime() - startTime;
                caesarsLogger.log('info','exports.getContacts','{"timeDiff":"' + timeDiff + '"}');
                response.json(err ? err : result.rows);
            }
        );
    });
}

exports.postContact = function(request, response, next){
     caesarsLogger.generateKey();
     console.log('posting contacts into database');
     var statement = dbUtils.buildContactInsertStatement(JSON.parse(JSON.stringify(request.body)));
     saveIntoDatabase(statement,'exports.postContact',response);
}

exports.uploadContacts = function(fileName){
    console.log('uploading contacts into database : ' + fileName);
    //var statement = 'COPY salesforce.contact FROM '+ '\'' + fileName  + '\' DELIMITER \',\' CSV';
    var statement = dbUtils.buildContactInsertStatement(fileName);
    console.log('statement : ' + statement);
    saveIntoDatabase(statement,'exports.uploadContacts',null);
}

var saveIntoDatabase = function(statement,message,response){
    var startTime = new Date().getTime();
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query(statement,
            function(err, result) {
                var timeDiff = new Date().getTime() - startTime;
                if (err) {
                    caesarsLogger.log('error',message + err,'{"timeDiff":"' + timeDiff + '"}');
                    if(response != null) {
                        response.json({ message: 'Error ' + JSON.stringify(err)});
                    }
                } else {
                    caesarsLogger.log('info',message,'{"timeDiff":"' + timeDiff + '"}');
                    if(response != null) {
                        response.json({ message: 'Done ' + JSON.stringify(result)});
                    }
                }
                client.end();
            });
        }
    );
}