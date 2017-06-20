let pg = require('pg');
let shortid = require('shortid');
let dateUtils = require('../util/dateUtils.js');
let httpUtils = require('../util/httpUtils.js');
let logger = require('../util/caesarsLogger.js');

var customerDetailsParamsToFieldMap = new Map();
customerDetailsParamsToFieldMap.set('id','id');
customerDetailsParamsToFieldMap.set('ExternalId','id');
customerDetailsParamsToFieldMap.set('first_name','data->>\'c_first_name\'');
customerDetailsParamsToFieldMap.set('fast_name','data->>\'c_last_name\'');
customerDetailsParamsToFieldMap.set('winet_id','data->>\'i_dmid\'');
customerDetailsParamsToFieldMap.set('address_preferences','data->>\'c_addr_pref\'');
customerDetailsParamsToFieldMap.set('date_of_birth','data->>\'d_dob\'');

customerDetailsParamsToFieldMap.set('address_type','data->>\'c_addr_type\'');
customerDetailsParamsToFieldMap.set('address','data->>\'c_address_1\'');
customerDetailsParamsToFieldMap.set('address_2','data->>\'c_address_2\'');
customerDetailsParamsToFieldMap.set('state_code','data->>\'c_state_cd\'');
customerDetailsParamsToFieldMap.set('country_code','data->>\'c_country_cd\'');
customerDetailsParamsToFieldMap.set('apartment_number','data->>\'c_apt_num\'');
customerDetailsParamsToFieldMap.set('zip','data->>\'c_zip_7\'');
customerDetailsParamsToFieldMap.set('city','data->>\'c_city\'');


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

exports.convertRequestBodyToCustomerInfoJson = function(request){
    return '';
}

exports.getCustomers = function(request, response, next){
    var startTime = new Date().getTime();
	let requestParameters = httpUtils.parseRequestForParameters(request);
	let queryStatement = exports.buildCustomerQueryStatement(requestParameters,customerDetailsParamsToFieldMap);
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
    var keyList = Array.from(paramMap.keys());
	var query = 'SELECT id, data, recordType FROM CustomerInfo WHERE';
    for(var index = 0; index < keyList.length; index++){
        var key = keyList[index];
        if(requestParameters[key]){
			if(paramMap.get(key) == 'id' || paramMap.get(key) == 'ExternalId'){
				query += ' ' + paramMap.get(key) + ' = ' + requestParameters[key];
			} else {
				query += ' ' + paramMap.get(key) + ' = \'' + requestParameters[key] + '\'';
			}
            query += ' AND ';
        }
    }
    return query.substring(0,query.length-5);
}