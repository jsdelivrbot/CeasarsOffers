var jsFtp = require("jsftp");

exports.convertToNiceFileContent = function(records){
    var fileContent = '';
    fileContent = attachHeader(fileContent);
    for(var i = 0; i < records.length; i++){
        fileContent += records[i].name + '\n';
    }
    return fileContent;
}

var attachHeader = function(fileContent){
    fileContent += 'Name'+'\n';
    return fileContent;
}


