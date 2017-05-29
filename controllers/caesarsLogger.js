var pg = require('pg');

exports.log = function(loglevel,message,json){

    var statement = 'insert into winston_logs (level,msg,meta) values (\''+loglevel+'\',\''+message+'\',\''+json+'\')';

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query(statement,
            function(err, result) {
                console.log('err ' + err);
                client.end();
            }
        );
    });
}