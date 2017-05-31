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
    var ftpClient = new jsFtp({host: "speedtest.tele2.net",port: 21,user: "anonymous",pass: "anonymous"});
    var fileContent = "";
    console.log('Start read file from FTP server ' + connectionParams);

    if (!fs.existsSync(temp_dir))
        fs.mkdirSync(temp_dir);

    console.log('temp_dir ' + temp_dir);

    /*ftp.get(fileName, 'local/file.txt', function(hadErr) {
        if (hadErr)
            console.error('There was an error retrieving the file.');
        else
          console.log('File copied successfully!');
    });*/


    /*ftpClient.get(fileName, function(err, socket) {
        if (err) {
            return;
        } else {

            socket.on("data", function(d) {
                console.log('Reading ...');
                fileContent += d.toString();
            });

            socket.on("close", function(hadErr) {
                var timeDiff = new Date().getTime() - startTime;
                if (hadErr){
                    console.error('There was an error retrieving the file : ' + hadErr);
                    caesarsLogger.log('error','exports.readFileFromFTPServer : ' + hadErr,'{"timeDiff":"' + timeDiff + '"}');
                } else {
                    console.log('Reading completed');

                    caesarsLogger.log('info','exports.readFileFromFTPServer','{"timeDiff":"' + timeDiff + '"}');
                    callback(fileContent);
                }
            });

            socket.resume();
        }
      }
    );*/
}

var connectionParameters = function(){
    return {host: "speedtest.tele2.net",port: 21,user: "anonymous",pass: "anonymous"};
}