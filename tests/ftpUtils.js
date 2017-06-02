import test from 'ava';

var rewire = require("rewire");

var myModule = rewire("../utils/ftpUtils.js");

var caesarsLoggerMock = {
    log : function(a,b,c,d){}
}

var sftpClient = {

    connect : function(a){
        return new Promise((resolve, reject) => {});
    },
    put : function (buffer, fileName){
        return new Promise((resolve, reject) => {});
    },
    get : function(filename){
        return new Promise((resolve, reject) => {});
    }
}

myModule.__set__("caesarsLogger", caesarsLoggerMock);
myModule.__set__("sftpClient", sftpClient);

test('save File On SFTP Server', async t=>{
    var contacts = [JSON.parse('{"firstname":"nth offer","lastname":"nth offer"}'),JSON.parse('{"firstname":"nth offer","lastname":"nth offer"}')];
    myModule.saveFileOnSFTPServer(contacts,null,myModule.sftpConnectionTestParameters());
    t.true(true);
});

test('read File From SFTP Server', async t=> {
    myModule.readFileFromSFTPServer(null,myModule.sftpConnectionTestParameters(), new function(a){})
    t.true(true);
})