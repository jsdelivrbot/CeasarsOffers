var jsFtp = require("jsftp");
var fs = require("fs");
var path = require("path");
var fileUtils = require('./fileUtils.js');
var caesarsLogger = require('./caesarsLogger.js');
var sftp = require('ssh2-sftp-client');

var temp_dir = path.join(process.cwd(), 'temp/');

/*
* @description : Saves file on sftp server
* @param records : list of records to be saved in file
* @param fileName : name of the file that should be created
*/
exports.saveFileOnSFTPServer = function(records, fileName){
    var startTime = new Date().getTime();
    if(records){
        var buffer = Buffer.from(fileUtils.convertToNiceFileContent(records));
        var sftpClient = new sftp();
        sftpClient.connect(sftpConnectionParameters()).then(() => {
            sftpClient.put(buffer, fileName).then(() => {
                console.log('Transfer completed');
            }).catch((err) => {
                var timeDiff = new Date().getTime() - startTime;
                caesarsLogger.log('error','exports.saveFileOnSFTPServer','{"timeDiff":"' + timeDiff + '"}',this.lKey);
                console.log(err,'Error during file transfer');
            });
        }).catch((err) => {
            console.log(err,'Error during establishing connection');
            var timeDiff = new Date().getTime() - startTime;
            caesarsLogger.log('error','exports.saveFileOnSFTPServer','{"timeDiff":"' + timeDiff + '"}',this.lKey);
        });
    } else {
        var timeDiff = new Date().getTime() - startTime;
        caesarsLogger.log('info','exports.saveFileOnSFTPServer','{"timeDiff":"' + timeDiff + '"}',this.lKey);
    }
}

/*
* @description : Copies file from sftp into heroku temp directory and fires up callback method
* @param fileName : name of the file that should be read
* @param callback : callback method to be invoked after successful upload
*/
exports.readFileFromSFTPServer = function(fileName,callback){
    var startTime = new Date().getTime();
    var sftpClient = new sftp();
    sftpClient.connect(sftpConnectionParameters()).then((data) => {
        sftpClient.get(fileName).then((stream) => {
            if (!fs.existsSync(temp_dir)){
                fs.mkdirSync(temp_dir);
            }
            stream.pipe(fs.createWriteStream(temp_dir+fileName));
            stream.on('end', () => {
                callback(temp_dir+fileName);
            });
        }).catch((err) => {
            console.log(err,'Error during file transfer');
            var timeDiff = new Date().getTime() - startTime;
            caesarsLogger.log('error','exports.readFileFromSFTPServer','{"timeDiff":"' + timeDiff + '"}',this.lKey);
        });
    }).catch((err) => {
        console.log(err,'Error during establishing connection');
        var timeDiff = new Date().getTime() - startTime;
        caesarsLogger.log('error','exports.readFileFromSFTPServer','{"timeDiff":"' + timeDiff + '"}',this.lKey);
    });
}

/*
* @description : Saves file on ftp server
* @param records : list of records to be saved in file
* @param fileName : name of the file that should be created
*/
exports.saveFileOnFTPServer = function(records, fileName){
    var startTime = new Date().getTime();
    if(records){
        var connectionParams = ftpConnectionParameters();
        var ftpClient = new jsFtp(connectionParams);
        var buffer = Buffer.from(fileUtils.convertToNiceFileContent(records));
        var filePath = 'upload/'+fileName;
        ftpClient.put(buffer, filePath, function(hadError) {
          console.log('Transferring file ' + fileName + ' into FTP server');
          var timeDiff = new Date().getTime() - startTime;
          if (!hadError){
            caesarsLogger.log('info','exports.saveFileOnFTPServer','{"timeDiff":"' + timeDiff + '"}',this.lKey);
            console.log("File transferred successfully!");
          } else {
            caesarsLogger.log('error','exports.saveFileOnFTPServer','{"timeDiff":"' + timeDiff + '"}',this.lKey);
            console.log("Error occured during transfer " + hadError);
          }
        });
    } else {
        var timeDiff = new Date().getTime() - startTime;
        caesarsLogger.log('info','exports.saveFileOnFTPServer','{"timeDiff":"' + timeDiff + '"}',this.lKey);
    }
}

/*
* @description : Copies file from ftp into heroku temp directory and fires up callback method
* @param fileName : name of the file that should be read
* @param callback : callback method to be invoked after successful upload
*/
exports.readFileFromFTPServer = function(fileName,callback){
    var startTime = new Date().getTime();
    var connectionParams = ftpConnectionParameters();
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

/*
* @description : Returns ftp server connection details
*/
var ftpConnectionParameters = function(){
    return {host:'speedtest.tele2.net',port:21,user:'anonymous',pass:'anonymous'};
}

/*
* @description : Returns sftp server connection details
*/
var sftpConnectionParameters = function(){
    return {host:'test.rebex.net',port:'22',username:'demo',password:'password'};
}