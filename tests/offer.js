import test from 'ava';

var rewire = require("rewire");

var myModule = rewire("../models/offer.js");

var caesarsLoggerMock = {
    log : function(a,b,c,d){}
}

var dbUtilsMock = {
    buildOfferInsertStatement : function(a){
        return '';
    }
}

var pgMock ={
    connect : function(a,b){}
}

myModule.__set__("logger", caesarsLoggerMock);
myModule.__set__("dbUtils", dbUtilsMock);
myModule.__set__("pg", pgMock);

test('get offers',  t => {
    myModule.getOffers(null,null,null);
    t.true(true);
});


test('post Offer', t => {
   myModule.postOffer(null,null,null);
   t.true(true);
});