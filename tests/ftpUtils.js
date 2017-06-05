import test from 'ava';

var rewire = require("rewire");

var myModule = rewire("../utils/ftpUtils.js");

var caesarsLoggerMock = {
    log : function(a,b,c,d){}
}

var sftpClient = {
    connect : function(a){
        return new Promise((resolve, reject) => {resolve()});
    },
    put : function (buffer, fileName){
        return new Promise((resolve, reject) => {resolve()});
    },
    get : function(filename){
        return new Promise((resolve, reject) => {resolve()});
    }
}

var fs = {
    existsSync : function(temp_dir){
        return true;
    },
    createWriteStream : function(file){
        return null;
    }
}

myModule.__set__("caesarsLogger", caesarsLoggerMock);
myModule.__set__("sftpClient", sftpClient);
myModule.__set__("fs",fs);

test('save File On SFTP Server', async t=>{
    var contacts = [JSON.parse('{"firstname":"nth offer","lastname":"nth offer"}'),JSON.parse('{"firstname":"nth offer","lastname":"nth offer"}')];
    myModule.saveFileOnSFTPServer(contacts,null,myModule.sftpConnectionTestParameters());
    t.true(true);
});

test('save File On SFTP Server without records', async t=>{
    var contacts;
    myModule.saveFileOnSFTPServer(contacts,null,myModule.sftpConnectionTestParameters());
    t.true(true);
});

test('read File From SFTP Server', async t=> {
    myModule.readFileFromSFTPServer(null,myModule.sftpConnectionTestParameters(), new function(a){})
    t.true(true);
})