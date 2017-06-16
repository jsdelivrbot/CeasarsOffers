import test from 'ava';

var rewire = require("rewire");

var myModule = rewire("../java/restConnector.js");

var endMock = {
    end : function(){}
}

var httpMock ={
    get : function(a,b){
        return endMock;
    }
}

myModule.__set__("http", httpMock);

test('add customer Info',  t => {
    myModule.callJavaApp(null);
    t.true(true);
});

test('do Something On Java Side',  t => {
    myModule.doSomethingOnJavaSide(null);
    t.true(true);
});