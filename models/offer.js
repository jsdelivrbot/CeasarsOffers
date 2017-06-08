var pg = require('pg');
var logger = require('../utils/caesarsLogger.js');
var dbUtils = require('../utils/dbUtils.js');
var httpUtils = require('../utils/httpUtils.js');
var shortid = require('shortid');

var availableOffersParamsToColumnsMap = new Map();
availableOffersParamsToColumnsMap.set('WinnetId','WinnetId');
availableOffersParamsToColumnsMap.set('PropertyLocalTime','PropertyLocalTime');
availableOffersParamsToColumnsMap.set('Property','Property');
availableOffersParamsToColumnsMap.set('Date','Date');
availableOffersParamsToColumnsMap.set('OutletCode','OutletCode');

exports.getAvailableOffers = function(request,response,next){
    var requestParameters = httpUtils.parseRequestForParameters(request);
    var availableOfferQuery = exports.createOfferQuery(requestParameters,availableOffersParamsToColumnsMap);
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query(availableOfferQuery,function(err, result){
                response.json(err ? err : result.rows);
            }
        );
    });
}

exports.createOfferQuery = function(requestParameters,paramMap){
    var query = 'SELECT name FROM offers WHERE ';
    var keyList = Array.from(paramMap.keys());
    for(var index = 0; index < keyList.length; index++){
        var key = keyList[index];
        if(requestParameters[key]){
            query += paramMap.get(key) + ' = ' + requestParameters[key];
            if(index < requestParameters.length - 2){
                query += ' AND ';
            }
        }
    }
    console.log('Query : ' + query);
    return query;
}

exports.getOfferDetails = function(request,response,next){
    var requestParameters = httpUtils.parseRequestForParameters(request);
    console.log('running get Offer Details with parameters : ' + JSON.stringify(requestParameters));
    response.json('{}');
}

exports.modifyOffer = function(request,response,next){
    response.json('{}');
}

exports.postOffers = function(request, response, next){
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