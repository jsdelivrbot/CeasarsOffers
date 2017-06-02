import test from 'ava';

var rewire = require("rewire");

var myModule = rewire("../utils/caesarsLogger.js");

var pgMock ={
    connect : function(a,b){}
}

myModule.__set__("pg", pgMock);

test('log', t => {
   myModule.log(null,null,null,null);
   t.true(true);
});