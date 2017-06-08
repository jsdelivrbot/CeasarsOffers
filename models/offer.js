var pg = require('pg');
var logger = require('../utils/caesarsLogger.js');
var dbUtils = require('../utils/dbUtils.js');
var httpUtils = require('../utils/httpUtils.js');
var shortid = require('shortid');

exports.getAvailableOffers = function(request,response,next){
    var requestParameters = httpUtils.parseRequestForParameters(request);
    console.log('running get Available Offers with parameters : ' + requestParameters);
    response.json('{}');
}

exports.getOfferDetails = function(request,response,next){
    var requestParameters = httpUtils.parseRequestForParameters(request);
    console.log('running get Offer Details with parameters : ' + requestParameters);
    response.json('{}');
}

exports.modifyOffer = function(request,response,next){
    response.json('{}');
}

exports.postOffer = function(request, response, next){
    this.lKey = shortid.generate();
    var startTime = new Date().getTime();
    var dml = request != null ? dbUtils.buildOfferInsertStatement.bind(this)(JSON.parse(JSON.stringify(request.body))) : '';

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query(dml,
            function(err, result) {
                var timeDiff = new Date().getTime() - startTime;
                if (err) {
                    logger.log('error','exports.postOffer','{"timeDiff":"'+timeDiff+'"}',shortid.generate());
                    response.json({ message: 'Error during offer post ' + JSON.stringify(err)});
                } else {
                    logger.log('info','exports.postOffer','{"timeDiff":"'+timeDiff+'"}',shortid.generate());
                    response.json({ message: 'You have done successful offer post call ' + JSON.stringify(result)});
                }
                client.end();
            }
        );
    });
}

exports.getOffers = function(request, response, next){
    this.lKey = shortid.generate();
    var startTime = new Date().getTime();
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT name FROM offers ',
            function(err, result){
                done();
                var timeDiff = new Date().getTime() - startTime;
                logger.log('info','exports.getOffers','{"timeDiff":"'+timeDiff+'"}',shortid.generate());
                response.json(err ? err : result.rows);
            }
        );
    });
}