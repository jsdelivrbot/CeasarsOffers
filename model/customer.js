let pg = require('pg');
let shortid = require('shortid');
let dateUtils = require('../util/dateUtils.js');
let httpUtils = require('../util/httpUtils.js');
let logger = require('../util/caesarsLogger.js');

var customerDetailsParamsToFieldMap = new Map();
customerDetailsParamsToFieldMap.set('id','id');
customerDetailsParamsToFieldMap.set('ExternalId','id');

exports.addCustomerInfo = function(request, response, next){
    var startTime = new Date().getTime();
    var jsonCustomerInfoRepresentation = exports.convertRequestBodyToCustomerInfoJson(request);
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('INSERT INTO CustomerInfo (data) VALUES (\'' + jsonCustomerInfoRepresentation + '\')',
            function(err, result){
                done();
                logger.log('info','exports.getAllCustomers','{"timeDiff":"' + dateUtils.calculateTimeDiffInMilliseconds(startTime) + '"}',shortid.generate());
                response.json(err ? err : result.rows);
            }
        );
    });
}

exports.getCustomers = function(request, response, next){
    var startTime = new Date().getTime();
	let requestParameters = httpUtils.parseRequestForParameters(request);
	let queryStatement = exports.buildCustomerQueryStatement(requestParameters,customerDetailsParamsToFieldMap);
	console.log(queryStatement);
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query(queryStatement,
            function(err, result){
                done();
                logger.log('info','exports.getCustomers','{"timeDiff":"' + dateUtils.calculateTimeDiffInMilliseconds(startTime) + '"}',shortid.generate());
                response.json(err ? err : result.rows);
            }
        );
    });
}

exports.buildCustomerQueryStatement = function(requestParameters,paramMap){
    var query = 'SELECT id, data FROM CustomerInfo ';
    var keyList = Array.from(paramMap.keys());
	if(keyList.length > 0){
		query += 'WHERE ';
	}
    for(var index = 0; index < keyList.length; index++){
        var key = keyList[index];
        if(requestParameters[key]){
			if(paramMap.get(key) == 'id' || paramMap.get(key) = 'ExternalId'){
				query += paramMap.get(key) + ' = ' + requestParameters[key];
			} else {
				query += paramMap.get(key) + ' = ' + requestParameters[key];
			}
            query += ' AND ';
        }
    }
    return query.substring(0,query.length-5);
}

exports.convertRequestBodyToCustomerInfoJson = function(request){
    return '';
}
