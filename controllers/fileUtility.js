var Readable = require('stream').Readable;
var PromiseFtp = require('promise-ftp');
var JSFtp = require("jsftp");

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

        var ftp = new JSFtp({
          host: "test.talia.net",
          port: 21, // defaults to 21
          user: "anonymous", // defaults to "anonymous"
          pass: "michal.bluj@wp.pl" // defaults to "@anonymous"
        });

        ftp.ls(".", function(err, res) {
          res.forEach(function(file) {
            console.log('fname ' + file.name);
          });
        });

        /*var connection = {host: 'test.talia.net', user: 'anonymous', password: 'michal.bluj@wp.pl', pasvTimeout:20000};

        var ftp = new PromiseFtp();
        ftp.connect(connection)
            .then(function (serverMessage) {
                return ftp.put(readableStream,fileName);
            }).then(function () {
                return ftp.end();
        });*/
    }
}

