import test from 'ava';

var rewire = require("rewire");

var myModule = rewire("../utils/ftpUtils.js");

var caesarsLoggerMock = {
    log : function(a,b,c,d){}
}

var sftpClient = {

    connect : function(a){
        console.log('mock connect');
        return new Promise((resolve, reject) => {});
    },
    put : function (buffer, fileName){
        console.log('mock put');
        return new Promise((resolve, reject) => {});
    },
    get : function(filename){
        console.log('mock get');
        return new Promise((resolve, reject) => {});
    }
}

myModule.__set__("caesarsLogger", caesarsLoggerMock);
myModule.__set__("sftpClient", sftpMock);

test('save File On SFTP Server', t=>{
    var contact = JSON.parse('{"firstname":"nth offer","lastname":"nth offer"}');
    var contact1 = JSON.parse('{"firstname":"nth offer","lastname":"nth offer"}');
    var contacts = [contact,contact1];
    myModule.saveFileOnSFTPServer(contacts,null,myModule.sftpConnectionTestParameters());
    t.true(true);
});

test('read File From SFTP Server', t=> {
    myModule.readFileFromSFTPServer(null,myModule.sftpConnectionTestParameters(), new function(a){})
    t.true(true);
})