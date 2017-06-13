let jsFtp = require("jsftp");
let fs = require("fs");
let path = require("path");
let fileUtils = require('./fileUtils.js');
let logger = require('./caesarsLogger.js');
let dateUtils = require('./dateUtils.js');
let sftp = require('ssh2-sftp-client');
let temp_dir = path.join(process.cwd(), 'temp/');
let sftpClient = new sftp();


/*
* @description : Saves file on sftp server
* @param records : list of records to be saved in file
* @param fileName : name of the file that should be created
*/
exports.saveFileOnSFTPServer = function(records, fileName, sftpConnectionParameters){
    let startTime = new Date().getTime();
    if(records){
        let buffer = Buffer.from(fileUtils.convertToNiceFileContent(records));
        sftpClient.connect(sftpConnectionParameters).then(() => {
            sftpClient.put(buffer, fileName).then(() => {
                console.log('Transfer completed');
            }).catch((err) => {
                logger.log('error','exports.saveFileOnSFTPServer ' + err,'{"timeDiff":"' + dateUtils.calculateTimeDiffInMilliseconds(startTime) + '"}',this.lKey);
            });
        }).catch((err) => {
            logger.log('error','exports.saveFileOnSFTPServer ' + err,'{"timeDiff":"' + dateUtils.calculateTimeDiffInMilliseconds(startTime) + '"}',this.lKey);
        });
    } else {
        logger.log('info','exports.saveFileOnSFTPServer','{"timeDiff":"' + dateUtils.calculateTimeDiffInMilliseconds(startTime) + '"}',this.lKey);
    }
}

/*
* @description : Copies file from sftp into heroku temp directory and fires up callback method
* @param fileName : name of the file that should be read
* @param callback : callback method to be invoked after successful upload
*/
exports.readFileFromSFTPServer = function(sourceFilePath,fileName,sftpConnectionParameters,callback){
    let startTime = new Date().getTime();
    sftpClient.connect(sftpConnectionParameters).then((data) => {
        sftpClient.get(sourceFilePath).then((stream) => {
            if (!fs.existsSync(temp_dir)){
                fs.mkdirSync(temp_dir);
            }
            stream.pipe(fs.createWriteStream(temp_dir+fileName));
            stream.on('end', () => {
                callback(temp_dir+fileName);
            });
        }).catch((err) => {
            logger.log('error','exports.readFileFromSFTPServer ' + err,'{"timeDiff":"' + dateUtils.calculateTimeDiffInMilliseconds(startTime) + '"}',this.lKey);
        });
    }).catch((err) => {
        logger.log('error','exports.readFileFromSFTPServer ' + err,'{"timeDiff":"' + dateUtils.calculateTimeDiffInMilliseconds(startTime) + '"}',this.lKey);
    });
}

/*
* @description : Saves file on ftp server
* @param records : list of records to be saved in file
* @param fileName : name of the file that should be created
*/
exports.saveFileOnFTPServer = function(records, fileName){
    let startTime = new Date().getTime();
    if(records){
        let connectionParams = ftpConnectionParameters();
        let ftpClient = new jsFtp(connectionParams);
        let buffer = Buffer.from(fileUtils.convertToNiceFileContent(records));
        let filePath = 'upload/'+fileName;
        ftpClient.put(buffer, filePath, function(hadError) {
          console.log('Transferring file ' + fileName + ' into FTP server');
          let timeDiff = new Date().getTime() - startTime;
          if (!hadError){
            logger.log('info','exports.saveFileOnFTPServer','{"timeDiff":"' + dateUtils.calculateTimeDiffInMilliseconds(startTime) + '"}',this.lKey);
          } else {
            logger.log('error','exports.saveFileOnFTPServer ' + hadError,'{"timeDiff":"' + dateUtils.calculateTimeDiffInMilliseconds(startTime) + '"}',this.lKey);
          }
        });
    } else {
        logger.log('info','exports.saveFileOnFTPServer','{"timeDiff":"' + dateUtils.calculateTimeDiffInMilliseconds(startTime) + '"}',this.lKey);
    }
}

/*
* @description : Copies file from ftp into heroku temp directory and fires up callback method
* @param fileName : name of the file that should be read
* @param callback : callback method to be invoked after successful upload
*/
exports.readFileFromFTPServer = function(fileName,callback){
    let startTime = new Date().getTime();
    let connectionParams = ftpConnectionParameters();
    let ftpClient = new jsFtp(connectionParams);
    let fileContent = "";
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
let ftpConnectionParameters = function(){
    return {host:'speedtest.tele2.net',port:21,user:'anonymous',pass:'anonymous'};
}

let ftpConnectionTestParameters = function(){
    return {host:'speedtest.tele2.net',port:21,user:'anonymous',pass:'anonymous'};
}

/*
* @description : Returns sftp server connection details
*/
exports.sftpConnectionParameters = function(){
    return {host:'test.rebex.net',port:'22',username:'demo',password:'password'};
}

exports.sftpConnectionTestParameters = function(){
    return {host:'test.rebex.net',port:'22',username:'demo',password:'password'};
}