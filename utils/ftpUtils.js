var jsFtp = require("jsftp");

var fileUtils = require('./fileUtils.js');

exports.saveFileOnFTPServer = function(records, fileName){
    if(records){
        var ftpClient = new jsFtp({host: "speedtest.tele2.net",port: 21,user: "anonymous",pass: "anonymous"});
        var dataToBeSaved = fileUtils.convertToNiceFileContent(records);
        var buffer = Buffer.from(dataToBeSaved);
        var filePath = 'upload/'+fileName;
        ftpClient.put(buffer, filePath, function(hadError) {
          console.log('Transferring file ' + fileName + ' into FTP server')
          if (!hadError){
            console.log("File transferred successfully!");
          } else {
            console.log("Error occured during transfer " + hadError);
          }
        });
    }
}

exports.readFileFromFTPServer = function(fileName,callback){
    var startTime = new Date().getTime();
    var ftpClient = new jsFtp({host: "speedtest.tele2.net",port: 21,user: "anonymous",pass: "anonymous"});

    var fileContent = "";

    console.log('Start read file from FTP server');

    ftpClient.get(fileName, function(err, socket) {
        if (err) {
            return;
        } else {
            socket.on("data", function(d) {
                console.log('Reading ...');
                fileContent += d.toString();
            });

            socket.on("close", function(hadErr) {
                if (hadErr){
                    console.error('There was an error retrieving the file.');
                } else {
                    console.log('Reading completed');
                    var timeDiff = new Date().getTime() - startTime;
                    caesarsLogger.log('info','exports.readFileFromFTPServer','{"timeDiff":"'+timeDiff+'"}');
                    callback(fileContent);
                }
            });
            socket.resume();
        }
      }
    );
}