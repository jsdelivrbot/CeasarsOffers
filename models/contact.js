var pg = require('pg');
var dateUtils = require('../utils/dateUtils.js');

exports.getRecordsBeforeDate = function(dateParam){
    var results;

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT name FROM salesforce.contact where systemmodstamp < ' + dateUtils.convertToPostgresDateTime(dateParam), function(err, result) {
            done();
            if(results){
                results = result.rows;
            }
        });
    });
    return results;
}