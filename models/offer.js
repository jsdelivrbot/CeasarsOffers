var pg = require('pg');
var winston = require("winston");
require("winston-postgresql").PostgreSQL;

winston.add(winston.transports.PostgreSQL, {
                                               "connString" : "postgres://nbqrxjobyivxmr:dbbecaadb1f248feddd2262f387fa51d314cb6c0e10b7fcadbb04cb32abbf40a@ec2-54-221-255-153.compute-1.amazonaws.com:5432/dcvg2h7ksmoa8r",
                                               "tableName" : "winston_logs",
                                           });


var buildInsertStatement = function(offers){
    var statement = 'INSERT INTO offers (name) VALUES ';
    for(var i = 0; i<offers.length; i++){
        statement += '(\''+offers[i].name+'\'),';
    }
    statement = statement.substring(0,statement.length - 1);
    return statement;
}

exports.postOffer = function(request, response, next){

     var dml = buildInsertStatement(JSON.parse(JSON.stringify(request.body)));

     pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query(dml,
            function(err, result) {
                if (err) {
                    response.json({ message: 'Error during offer post ' + JSON.stringify(err)});
                } else {
                    response.json({ message: 'You have done successful offer post call ' + JSON.stringify(result)});
                }
                client.end();
            }
        );
     });
 }

 exports.getOffers = function(request, response, next){
     var startTime = new Date().getTime();
     pg.connect(process.env.DATABASE_URL, function(err, client, done) {
         client.query('SELECT name FROM offers ',
             function(err, result){
                 done();
                 var timeDiff = new Date().getTime() - startTime;
                 winston.log('info','exports get offer','{timeDiff:'+timeDiff+'}');
                 response.json(err ? err : result.rows);
             }
         );
     });
 }