var pg = require('pg');
var dbUtils = require('../utils/dbUtils.js');
var caesarsLogger = require('../utils/caesarsLogger.js');

exports.uploadSegments = function(localFileName){
    var startTime = new Date().getTime();

    var segmentStatement = 'insert into segment (id, name, isLocked) values ';

    var segmentMemberStatement = 'insert into segmentMember (id, name, segment, WINetId, accountId) values ';

    var lineReader = readLine.createInterface({
          input: fs.createReadStream(fileName)
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
                        caesarsLogger.log('info','uploadSegments','{"timeDiff":"' + dateUtils.calculateTimeDiffInMilliseconds(startTime) + '"}',this.lKey);
                        insertSegmentMembers.bind(this)(segmentMemberStatement);
                    } else {
                        caesarsLogger.log('error','uploadSegments : ' + err,'{"timeDiff":"' + dateUtils.calculateTimeDiffInMilliseconds(startTime) + '"}',this.lKey);
                    }
                })
            }
        );

    });
}

var insertSegmentMembers = function(segmentMemberStatement){
    var startTime = new Date().getTime();
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query(segmentMemberStatement,
            function(err, result) {
                if(!err){
                    caesarsLogger.log('info','insertSegmentMembers','{"timeDiff":"' + dateUtils.calculateTimeDiffInMilliseconds(startTime) + '"}',this.lKey);
                } else {
                    caesarsLogger.log('error','insertSegmentMembers : ' + err,'{"timeDiff":"' + dateUtils.calculateTimeDiffInMilliseconds(startTime) + '"}',this.lKey);
                }
            })
        }
    );
}