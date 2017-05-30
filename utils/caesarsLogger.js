var pg = require('pg');

var logKey = Date.now();

exports.log = function(level,message,json){

    var statement = 'insert into AppLogs (level,msq,meta) values (\''+level+'\',\''+message+'\',\''+json+'\')';

    console.log('logKey ' + logKey);
    console.log(statement);

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query(statement,
            function(err, result) {
                if(err){
                    console.log('Log save failed : ' + err);
                }
                client.end();
            }
        );
    });
}