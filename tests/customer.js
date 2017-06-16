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