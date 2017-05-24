var Readable = require('stream').Readable;
var PromiseFtp = require('promise-ftp');

var convertToNiceFileContent = function(recordsJSON){
    var records [] = JSON.parse(recordsJSON);
    var fileContent;
    for(int i = 0; i < records.length; i++){
        fileContent += records[0].name + '\n';
    }
    return fileContent;
}


exports.saveFileOnFTPServer = function(records, fileName){
    var dataToBeSaved = convertToNiceFileContent(records);

    console.log(dataToBeSaved);

    var readableStream = new Readable();
    readableStream._read = function noop() {};
    readableStream.push(dataToBeSaved);

    var ftp = new PromiseFtp();
        ftp.connect({host: host, user: user, password: password})
        .then(function (serverMessage) {
            return ftp.put(readableStream,fileName);
        }).then(function () {
            return ftp.end();
        });
}
