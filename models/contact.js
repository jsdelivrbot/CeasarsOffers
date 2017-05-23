
var pg = require('pg');

export.getRecordsBeforeDate = function(dateParam){
    var results;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT name FROM salesforce.contact ', function(err, result) {
            done();
            results = result.rows;
        });
    });
    return results;
}