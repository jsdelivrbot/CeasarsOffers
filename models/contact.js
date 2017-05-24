var pg = require('pg');
var dateUtils = require('../utils/dateUtils.js');
var fileUtility = require('../controllers/fileUtility.js');

exports.getRecordsBeforeDateAndPostToFTPServer = function(dateParam){
    var results = [];

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        const query = client.query('SELECT name FROM salesforce.contact where systemmodstamp < \'' + dateUtils.convertToPostgresDateTime(dateParam)+'\';');
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