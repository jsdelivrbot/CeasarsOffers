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
          host: "speedtest.tele2.net",
          port: 21, // defaults to 21
          user: "anonymous", // defaults to "anonymous"
          pass: "anonymous" // defaults to "@anonymous"
        });

        /*ftp.ls(".", function(err, res) {
          res.forEach(function(file) {
            console.log('fname ' + file.name);
          });
        });*/

        var buffer = Buffer.from(dataToBeSaved);

        console.log('Before putting file ' + fileName + ' into ftp server')
        ftp.put(buffer, '/upload/'fileName, function(hadError) {
          console.log('Putting file ' + fileName + ' into ftp server')
          if (!hadError){
            console.log("File transferred successfully!");
          } else {
            console.log("Had error " + hadError);
          }

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

