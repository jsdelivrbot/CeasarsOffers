let pg = require('pg');
let dbUtils = require('../util/dbUtils.js');
let logger = require('../util/caesarsLogger.js');
let readLine = require("readline");
let fs = require("fs");

exports.uploadSegments = function(localFileName){
    let startTime = new Date().getTime();

    let segmentStatement = 'insert into segment (id, name, isLocked) values ';

    let segmentMemberStatement = 'insert into segmentMember (id, name, segment, WINetId, accountId) values ';

    let lineReader = readLine.createInterface({
          input: fs.createReadStream(localFileName)
    });

    let lineCounter = 0;

    lineReader.on('line', function (line) {
        var columns = line.split(',');

        lineCounter == 0 ? segmentStatement += '(' : segmentMemberStatement += '(';

        for(let i = 0 ; i < columns.length ; i++){
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
    let logKey = this.lKey;
    let startTime = new Date().getTime();
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