
var pg = require('pg');

var convertToPostgresDateTime = function(dateParam){
    return dateParam.getFullYear() +'-' + ensureLeadingZeros(dateParam.getMonth()+1)+'-'+ensureLeadingZeros(dateParam.getDate())+' '+ensureLeadingZeros(dateParam.getHours())+':'+ensureLeadingZeros(dateParam.getMinutes())+':'+ensureLeadingZeros(dateParam.getSeconds());
}

var ensureLeadingZeros = function(param){
    return param < 10 ? '0'+param : param;
}

exports.getRecordsBeforeDate = function(dateParam){
    var results;

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        console.log('SELECT name FROM salesforce.contact where systemmodstamp < ' + convertToPostgresDateTime(dateParam));
        client.query('SELECT name FROM salesforce.contact where systemmodstamp < ' + convertToPostgresDateTime(dateParam), function(err, result) {
            done();
            if(results){
                results = result.rows;
            }
        });
    });
    return results;
}