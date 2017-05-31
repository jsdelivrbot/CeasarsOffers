var jsFtp = require("jsftp");
var fs = require("fs");
var path = require("path");

var temp_dir = path.join(process.cwd(), 'temp/');


var fileUtils = require('./fileUtils.js');
var caesarsLogger = require('./caesarsLogger.js');

exports.saveFileOnFTPServer = function(records, fileName){
    var startTime = new Date().getTime();
    if(records){
        var connectionParams = connectionParameters();
        var ftpClient = new jsFtp(connectionParams);
        var buffer = Buffer.from(fileUtils.convertToNiceFileContent(records));
        var filePath = 'upload/'+fileName;
        ftpClient.put(buffer, filePath, function(hadError) {
          console.log('Transferring file ' + fileName + ' into FTP server')
          if (!hadError){
            caesarsLogger.log('info','exports.saveFileOnFTPServer','{"timeDiff":"' + new Date().getTime() - startTime + '"}');
            console.log("File transferred successfully!");
          } else {
            caesarsLogger.log('error','exports.saveFileOnFTPServer','{"timeDiff":"' + new Date().getTime() - startTime + '"}');
            console.log("Error occured during transfer " + hadError);
          }
        });
    } else {
        caesarsLogger.log('info','exports.saveFileOnFTPServer','{"timeDiff":"' + new Date().getTime() - startTime + '"}');
    }
}

exports.readFileFromFTPServer = function(fileName,callback){
    var startTime = new Date().getTime();
    var connectionParams = connectionParameters();
    var ftpClient = new jsFtp(connectionParams);
    var fileContent = "";
    console.log('Start read file from FTP server');

    if (!fs.existsSync(temp_dir)){
        fs.mkdirSync(temp_dir);
    }

    ftpClient.get(fileName, temp_dir+fileName, function(hadErr) {
        if (hadErr){
            console.error('There was an error retrieving the file.');
        } else {
          console.log('File copied successfully!');
          callback(temp_dir+fileName);
        }
    });
}

var connectionParameters = function(){
    return {host: "speedtest.tele2.net",port: 21,user: "anonymous",pass: "anonymous"};
}