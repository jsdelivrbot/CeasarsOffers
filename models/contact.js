var pg = require('pg');
var dateUtils = require('../utils/dateUtils.js');

exports.getRecordsBeforeDate = function(dateParam){
    var results;

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT name FROM salesforce.contact where systemmodstamp < \'' + dateUtils.convertToPostgresDateTime(dateParam)+'\'', function(err, result) {
            done();
            console.log('result ' + result.rows);
            results = result.rows;
            console.log('results ' + results);
        });
    });

    console.log('SELECT name FROM salesforce.contact where systemmodstamp < \'' + dateUtils.convertToPostgresDateTime(dateParam)+'\'');
    console.log('results after ' + results);
    return results;
}