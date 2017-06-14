var pg = require('pg');
var shortid = require('shortid');
var logger = require('../util/caesarsLogger.js');

exports.getAllCustomers = function(request, response, next){
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