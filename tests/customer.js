import test from 'ava';

var rewire = require("rewire");

var myModule = rewire("../model/customer.js");

var caesarsLoggerMock = {
    log : function(a,b,c,d){}
}

var pgMock ={
    connect : function(a,b){}
}

myModule.__set__("logger", caesarsLoggerMock);
myModule.__set__("pg", pgMock);


test('add customer Info',  t => {
    myModule.addCustomerInfo(null,null,null);
    t.true(true);
});

test('get customers',  t => {
    myModule.getCustomers(null,null,null);
    t.true(true);
});

test('build Customer Query Statement', t => {
	
	var requestParameters = new Map();
	requestParameters.set('ExternalId','1');
	requestParameters.set('FirstName','Mickey');
	
	var paramMap = new Map();
	paramMap.set('ExternalId','id');
	paramMap.set('FirstName','data->>\'firstName\'');
	
	let statement = myModule.buildCustomerQueryStatement(requestParameters,paramMap);
	console.log(statement);
	t.is(statement,'SELECT id, data FROM CustomerInfo WHERE id = 1 AND data->>\'firstName\' = \'Mickey\'');
});