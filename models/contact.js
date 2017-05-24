var pg = require('pg');
var dateUtils = require('../utils/dateUtils.js');

exports.getRecordsBeforeDate = function(dateParam){
    var results;

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT name FROM salesforce.contact where systemmodstamp < ' + dateUtils.convertToPostgresDateTime(dateParam), function(err, result) {
            done();
            console.log('err ' + err);
            console.log('rows ' + results.row);
            if(results){
                results = result.rows;
            }
        });
    });

    console.log('SELECT name FROM salesforce.contact where systemmodstamp < ' + dateUtils.convertToPostgresDateTime(dateParam));
    console.log('results ' + results);

    return results;
}