var pg = require('pg');
var shortid = require('shortid');

exports.logKey;

exports.generateKey = function(){
    exports.logKey = shortid.generate();
}

exports.log = function(level,message,json){

    var statement = 'insert into AppLogs (level,msg,meta,reqkey) values (\''+level+'\',\''+message+'\',\''+json+'\',\''+exports.logKey+'\')';

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