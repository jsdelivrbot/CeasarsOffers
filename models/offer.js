var pg = require('pg');
var caesarsLogger = require('../utils/caesarsLogger.js');
var dbUtils = require('../utils/dbUtils.js');

exports.postOffer = function(request, response, next){
     caesarsLogger.generateKey();
     var startTime = new Date().getTime();
     var dml = dbUtils.buildOfferInsertStatement(JSON.parse(JSON.stringify(request.body)));

     pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query(dml,
            function(err, result) {
                var timeDiff = new Date().getTime() - startTime;
                if (err) {
                    caesarsLogger.log('error','exports.postOffer','{"timeDiff":"'+timeDiff+'"}');
                    response.json({ message: 'Error during offer post ' + JSON.stringify(err)});
                } else {
                    caesarsLogger.log('info','exports.postOffer','{"timeDiff":"'+timeDiff+'"}');
                    response.json({ message: 'You have done successful offer post call ' + JSON.stringify(result)});
                }
                client.end();
            }
        );
     });
 }

 exports.getOffers = function(request, response, next){
     caesarsLogger.generateKey();
     var startTime = new Date().getTime();
     pg.connect(process.env.DATABASE_URL, function(err, client, done) {
         client.query('SELECT name FROM offers ',
             function(err, result){
                 done();
                 var timeDiff = new Date().getTime() - startTime;
                 caesarsLogger.log('info','exports.getOffers','{"timeDiff":"'+timeDiff+'"}');
                 response.json(err ? err : result.rows);
             }
         );
     });
 }