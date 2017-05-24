var pg = require('pg');
var dateUtils = require('../utils/dateUtils.js');
var fileUtility = require('../controllers/fileUtility.js');

exports.getRecordsBeforeDate = function(dateParam){
    var results = [];

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        /*client.query('SELECT name FROM salesforce.contact where systemmodstamp < \'' + dateUtils.convertToPostgresDateTime(dateParam)+'\'', function(err, result) {
            done();
            console.log('result ' + result.rows);
            results = result.rows;
            console.log('results ' + results);
            return results;
        });*/

        //const query = client.query('SELECT name FROM salesforce.contact where systemmodstamp < \'' + dateUtils.convertToPostgresDateTime(dateParam)+'\';');
        const query = client.query('SELECT name FROM salesforce.contact;');
        // Stream results back one row at a time
        query.on('row', (row) => {results.push(row);});
        // After all data is returned, close connection and return results

        query.on('end', () => {
            done();
            console.log('results ' + results);
            fileUtility.saveFileOnFTPServer(results,'contacts.txt');
        });
    });
}