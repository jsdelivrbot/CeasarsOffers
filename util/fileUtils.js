let jsFtp = require("jsftp");

exports.convertToNiceFileContent = function(records){
    let fileContent = '';
    fileContent = attachHeader(fileContent);
    for(let i = 0; i < records.length; i++){
        fileContent += records[i].firstname + ',' + records[i].lastname + '\n';
    }
    return fileContent;
}

let attachHeader = function(fileContent){
    fileContent += 'firstname,lastname'+'\n';
    return fileContent;
}


