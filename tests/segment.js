import test from 'ava';

var rewire = require("rewire");

var myModule = rewire("../models/segment.js");

var caesarsLoggerMock = {
    log : function(a,b,c,d){}
}

var dbUtilsMock = {
    buildContactInsertStatement : function(a){},
    runQuery : function(a,b,c){},
    buildContactInsertStatementFromFile : function(a,b){}
}

var pgMock = {
    connect : function(a,b){}
}

var lineReaderMock = {
    on : function (a,b){}
}

var readLineMock = {
    createInterface : function(a){
        return lineReaderMock;
    }
}

var fsMock = {
    createReadStream : function(a){}
}


myModule.__set__("logger", caesarsLoggerMock);
myModule.__set__("dbUtils", dbUtilsMock);
myModule.__set__("pg", pgMock);
myModule.__set__("readLine", readLineMock);
myModule.__set__("fs", fsMock);

test('insert Segment Members',  t => {
    myModule.insertSegmentMembers(null);
    t.true(true);
});

test('upload Segments', t => {
    myModule.uploadSegments(null);
    t.true(true);
});