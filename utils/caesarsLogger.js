var pg = require('pg');

exports.log = function(loglevel,message,json){

    var statement = 'insert into AppLogs (level,msg,meta) values (\''+loglevel+'\',\''+message+'\',\''+json+'\')';

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query(statement,
            function(err, result) {
                if(err){
                    console.log('Loge save failed : ' + err);
                }
                client.end();
            }
        );
    });
}