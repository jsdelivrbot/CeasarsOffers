var pg = require('pg');

const winston = require("winston");

//require("winston-pg-native");
require("winston-postgresql").PostgreSQL;

const options = {
  conString: process.env.DATABASE_URL,
  tableName: 'AppLogs',
  level: 'info'
};


const logger = new(winston.Logger)({
  transports: [
    new(winston.transports.Postgres)(options)
  ]
});


exports.log = function(loglevel,message,json){

    logger.log(loglevel,message,json);

    /*var statement = 'insert into AppLogs (level,msg,meta) values (\''+loglevel+'\',\''+message+'\',\''+json+'\')';

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query(statement,
            function(err, result) {
                if(err){
                    console.log('Loge save failed : ' + err);
                }
                client.end();
            }
        );
    });*/
}