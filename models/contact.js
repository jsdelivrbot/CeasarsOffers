var pg = require('pg');
var shortid = require('shortid');
var dateUtils = require('../utils/dateUtils.js');
var ftpUtils = require('../utils/ftpUtils.js');
var logger = require('../utils/caesarsLogger.js');
var dbUtils = require('../utils/dbUtils.js');

exports.getRecordsBeforeDateAndPostToFTPServer = function(dateParam,fileName,callback){
    var startTime = new Date().getTime();
    var results = [];
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        const query = client.query('SELECT name FROM salesforce.contact where systemmodstamp < \'' + dateUtils.convertToPostgresDateTime(dateParam)+'\';');

        query.on('row', (row) => {results.push(row);});

        query.on('end', () => {
            done();
            logger.log('info','getRecordsBeforeDateAndPostToFTPServer','{"timeDiff":"' + dateUtils.calculateTimeDiffInMilliseconds(startTime) + '"}',this.lKey);
            callback(results,fileName,ftpUtils.sftpConnectionParameters());
        });
    });
}

exports.getContacts = function(request, response, next){
    var startTime = new Date().getTime();
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT firstname, lastname FROM salesforce.contact ',
            function(err, result){
                done();
                logger.log('info','exports.getContacts','{"timeDiff":"' + dateUtils.calculateTimeDiffInMilliseconds(startTime) + '"}',shortid.generate());
                response.json(err ? err : result.rows);
            }
        );
    });
}

exports.postContact = function(request, response, next){
     this.lKey = shortid.generate();
     var statement = request != null ? dbUtils.buildContactInsertStatement.bind(this)(JSON.parse(JSON.stringify(request.body))) : '';
     dbUtils.runQuery.bind(this)(statement,'exports.postContact',response);
}

exports.uploadContacts = function(fileName){
    //var statement = 'COPY salesforce.contact FROM '+ '\'' + fileName  + '\' DELIMITER \',\' CSV';
    dbUtils.buildContactInsertStatementFromFile(fileName,dbUtils.runQuery.bind(this));
}