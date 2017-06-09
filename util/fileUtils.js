var jsFtp = require("jsftp");

exports.convertToNiceFileContent = function(records){
    var fileContent = '';
    fileContent = attachHeader(fileContent);
    for(var i = 0; i < records.length; i++){
        fileContent += records[i].firstname + ',' + records[i].lastname + '\n';
    }
    return fileContent;
}

var attachHeader = function(fileContent){
    fileContent += 'firstname,lastname'+'\n';
    return fileContent;
}


