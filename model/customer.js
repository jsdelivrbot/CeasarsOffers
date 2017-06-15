var pg = require('pg');
var shortid = require('shortid');
var dateUtils = require('../util/dateUtils.js');
var httpUtils = require('../util/httpUtils.js');
var logger = require('../util/caesarsLogger.js');

exports.addCustomerInfo = function(request, response, next){
    var startTime = new Date().getTime();
    var jsonCustomerInfoRepresentation = exports.convertRequestBodyToCustomerInfoJson(request);
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('INSERT INTO CustomerInfo (data) VALUES (\'' + jsonCustomerInfoRepresentation + '\')',
            function(err, result){
                done();
                logger.log('info','exports.getAllCustomers','{"timeDiff":"' + dateUtils.calculateTimeDiffInMilliseconds(startTime) + '"}',shortid.generate());
                response.json(err ? err : result.rows);
            }
        );
    });
}

exports.getCustomers = function(request, response, next){
    var startTime = new Date().getTime();
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT data FROM CustomerInfo ',
            function(err, result){
                done();
                logger.log('info','exports.getAllCustomers','{"timeDiff":"' + dateUtils.calculateTimeDiffInMilliseconds(startTime) + '"}',shortid.generate());
                response.json(err ? err : result.rows);
            }
        );
    });
}

exports.convertRequestBodyToCustomerInfoJson = function(request){
    return '';
}
