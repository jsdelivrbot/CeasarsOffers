var pg = require('pg');

exports.log = function(level,message,json,reqKey){

    var statement = 'insert into AppLogs (level,msg,meta,reqkey) values (\''+level+'\',\''+message+'\',\''+json+'\',\''+reqKey+'\')';

    console.log(statement);

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if(client == null) return;
        client.query(statement,
            function(err, result) {
                if(err){
                    console.log('Log save failed with error : ' + err);
                }
                client.end();
            }
        );
    });
}