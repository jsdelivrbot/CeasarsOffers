var dbUtils = require('../utils/dbUtils.js');

exports.uploadSegments = function(localFileName){
    var statement = '';
    dbUtils.buildInsertStatementFromFile(localFileName,statement,dbUtils.runQuery.bind(this));
}