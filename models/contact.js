var pg = require('pg');
var shortid = require('shortid');
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
            var timeDiff = new Date().getTime() - startTime;
            caesarsLogger.log('info','getRecordsBeforeDateAndPostToFTPServer','{"timeDiff":"' + timeDiff + '"}',this.lKey);
            callback(results,fileName);
        });
    });
}

exports.getContacts = function(request, response, next){
    var startTime = new Date().getTime();
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT firstname, lastname FROM salesforce.contact ',
            function(err, result){
                done();
                var timeDiff = new Date().getTime() - startTime;
                caesarsLogger.log('info','exports.getContacts','{"timeDiff":"' + timeDiff + '"}',shortid.generate());
                response.json(err ? err : result.rows);
            }
        );
    });
}

exports.postContact = function(request, response, next){
     console.log('posting contacts into database');
     this.lKey = shortid.generate();
     console.log('this.lKey ' + this.lKey);
     var statement = dbUtils.buildContactInsertStatement.bind(this)(JSON.parse(JSON.stringify(request.body)));
     dbUtils.saveIntoDatabase.bind(this)(statement,'exports.postContact',response);
}

exports.uploadContacts = function(fileName){
    console.log('uploading contacts into database : ' + fileName);
    //var statement = 'COPY salesforce.contact FROM '+ '\'' + fileName  + '\' DELIMITER \',\' CSV';
    dbUtils.buildContactInsertStatementFromFile.bind(this)(fileName,dbUtils.saveIntoDatabase.bind(this));
}