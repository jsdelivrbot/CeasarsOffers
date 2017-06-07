var pg = require('pg');
var dbUtils = require('../utils/dbUtils.js');
var logger = require('../utils/caesarsLogger.js');
var readLine = require("readline");
var fs = require("fs");

exports.uploadSegments = function(localFileName){
    var startTime = new Date().getTime();

    var segmentStatement = 'insert into segment (id, name, isLocked) values ';

    var segmentMemberStatement = 'insert into segmentMember (id, name, segment, WINetId, accountId) values ';

    var lineReader = readLine.createInterface({
          input: fs.createReadStream(localFileName)
    });

    var lineCounter = 0;

    lineReader.on('line', function (line) {
        var columns = line.split(',');

        lineCounter == 0 ? segmentStatement += '(' : segmentMemberStatement += '(';

        for(var i = 0 ; i < columns.length ; i++){
            lineCounter == 0 ? segmentStatement += '\''+line[i]+'\'' + ',' : segmentMemberStatement += '\''+line[i]+'\'' + ',';
        }

        if(lineCounter == 0) {
            segmentStatement = segmentStatement.substring(0,segmentStatement.length - 1);
            segmentStatement += '),';
        } else {
            segmentMemberStatement = segmentMemberStatement.substring(0,segmentMemberStatement.length - 1);
            segmentMemberStatement += '),';
        }

        lineCounter ++;

    });

    lineReader.on('close', function(){

        segmentMemberStatement = segmentMemberStatement.substring(0,segmentMemberStatement.length - 1);
        segmentStatement = segmentStatement.substring(0,segmentStatement.length - 1);

        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query(segmentStatement ,
                function(err, result) {
                    if(!err){
                        logger.log('info','uploadSegments','{"timeDiff":"' + dateUtils.calculateTimeDiffInMilliseconds(startTime) + '"}',this.lKey);
                        exports.insertSegmentMembers.bind(this)(segmentMemberStatement);
                    } else {
                        logger.log('error','uploadSegments : ' + err,'{"timeDiff":"' + dateUtils.calculateTimeDiffInMilliseconds(startTime) + '"}',this.lKey);
                    }
                })
            }
        );

    });
}

exports.insertSegmentMembers = function(segmentMemberStatement){
    var logKey = this.lKey;
    var startTime = new Date().getTime();
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query(segmentMemberStatement,
            function(err, result) {
                if(!err){
                    logger.log('info','insertSegmentMembers','{"timeDiff":"' + dateUtils.calculateTimeDiffInMilliseconds(startTime) + '"}',logKey);
                } else {
                    logger.log('error','insertSegmentMembers : ' + err,'{"timeDiff":"' + dateUtils.calculateTimeDiffInMilliseconds(startTime) + '"}',logKey);
                }
            })
        }
    );
}