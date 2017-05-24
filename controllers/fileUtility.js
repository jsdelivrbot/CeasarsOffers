var Readable = require('stream').Readable;
var PromiseFtp = require('promise-ftp');

var convertToNiceFileContent = function(records){
    var fileContent = '';
    for(var i = 0; i < records.length; i++){
        fileContent += records[i].name + '\n';
    }
    return fileContent;
}


exports.saveFileOnFTPServer = function(records, fileName){
    if(records){
        var dataToBeSaved = convertToNiceFileContent(records);

        var readableStream = new Readable();
        readableStream._read = function noop() {};
        readableStream.push(dataToBeSaved);

        var host = '192.168.0.57'
        var user = 'node';
        var password = 'node';

        var ftp = new PromiseFtp();
            ftp.connect({host: host, user: user, password: password})
            .then(function (serverMessage) {
                return ftp.put(readableStream,fileName);
            }).then(function () {
                return ftp.end();
            });
    }
}

